from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose.jwk import construct
from core.config import settings
import urllib.request
import json

security = HTTPBearer()


# JWT Verification Things
_jwks_json = None
_parsed_keys = {}

def get_jwks():
    global _jwks_json
    if _jwks_json is None:
        url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                _jwks_json = json.loads(response.read())
        except Exception as e:
            print(f"Error fetching JWKS: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not fetch auth keys",
            )
    return _jwks_json

def get_public_key_object(kid: str) -> dict:
    global _parsed_keys
    if kid in _parsed_keys:
        return _parsed_keys[kid]
        
    jwks = get_jwks()
    for key_dict in jwks.get("keys", []):
        if key_dict.get("kid") == kid:
            constructed_key = construct(key_dict)
            _parsed_keys[kid] = constructed_key
            return constructed_key
            
    _jwks_json = None
    return get_public_key_object(kid)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        # 1. Grab the unverified header to see what algorithm the token is using
        unverified_header = jwt.get_unverified_header(token)
        alg = unverified_header.get("alg")
        
        if not alg:
            raise JWTError("Token header missing algorithm (alg)")

        # ----------------------------------------------------
        # BRANCH A: Symmetric HS256 (Local Dev / Sandbox Tokens)
        # ----------------------------------------------------
        if alg == "HS256":
            # Verify using your Supabase JWT secret. No internet/JWKS needed!
            # Ensure settings.JWT_SECRET is loaded from your .env
            payload = jwt.decode(
                token,
                settings.JWT_SECRET, 
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            return payload

        # ----------------------------------------------------
        # BRANCH B: Asymmetric RS256 (Supabase Cloud Production)
        # ----------------------------------------------------
        elif alg == "RS256":
            kid = unverified_header.get("kid")
            if not kid:
                raise JWTError("Token header missing Key ID (kid)")
                
            public_key = get_public_key_object(kid)
            
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={"verify_aud": False}
            )
            return payload
            
        elif alg == "ES256":
            kid = unverified_header.get("kid")
            if not kid:
                raise JWTError("Token header missing Key ID (kid)")
                
            public_key = get_public_key_object(kid)
            
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["ES256"],
                options={"verify_aud": False}
            )
            return payload
        
        else:
            raise JWTError(f"Unsupported algorithm: {alg}")
        
    except JWTError as e:
        print(f"JWT Verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )