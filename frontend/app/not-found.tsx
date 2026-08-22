import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[600px] p-2">

        {/* Left Content Area */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col">

          <div className="space-y-6 my-auto">
            <h1 className="text-7xl md:text-8xl font-serif text-white tracking-tight">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-medium text-zinc-200">
              Page not found
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
              The page you requested could not be found or has been moved to a new route. Please check the URL or return home.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 active:scale-95"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-zinc-500 text-sm">
              Lost? <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">Go to home</Link>
            </p>
          </div>
        </div>

        {/* Right Abstract Art Area */}
        <div className="hidden md:block md:w-1/2 relative p-2.5">
          <div 
            className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner"
            style={{ backgroundColor: '#f3ebd9' }}
          >
            {/* Top Right Golden / Amber Swirl */}
            <div 
              className="absolute -top-[15%] -right-[15%] w-[85%] h-[80%] rounded-full opacity-90 filter blur-[75px]"
              style={{ background: 'radial-gradient(circle, #e5ae52 0%, #dca042 60%, transparent 80%)' }}
            />

            {/* Bottom Right Warm Honey Swirl */}
            <div 
              className="absolute -bottom-[20%] right-[0%] w-[90%] h-[85%] rounded-full opacity-90 filter blur-[85px]"
              style={{ background: 'radial-gradient(circle, #e2aa4e 0%, #ce9338 60%, transparent 80%)' }}
            />

            {/* Top Left Warm Tint */}
            <div 
              className="absolute -top-[10%] left-[5%] w-[55%] h-[55%] rounded-full opacity-75 filter blur-[65px]"
              style={{ background: 'radial-gradient(circle, #f0ca7b 0%, #e8bc68 50%, transparent 75%)' }}
            />

            {/* Vibrant Cobalt / Azure Blue S-Curve Wave (Center-Left) */}
            <div 
              className="absolute top-[18%] left-[10%] w-[50%] h-[55%] rounded-[45%_55%_65%_35%/50%_60%_40%_50%] opacity-95 filter blur-[60px] -rotate-12"
              style={{ background: 'linear-gradient(145deg, #1d4ed8 0%, #2563eb 45%, #60a5fa 90%)' }}
            />

            {/* Bottom-Left Blue Tail Extension */}
            <div 
              className="absolute bottom-[2%] -left-[10%] w-[35%] h-[40%] rounded-full opacity-80 filter blur-[55px]"
              style={{ background: 'radial-gradient(circle, #2563eb 0%, #3b82f6 50%, transparent 80%)' }}
            />

            {/* Soft Cream Highlight in Center */}
            <div 
              className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full opacity-60 filter blur-[50px]"
              style={{ background: '#fbf7ee' }}
            />

            {/* Sand / Film Grain Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.42] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sandGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sandGrain)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>
        </div>

      </div>
    </main>
  );
}
