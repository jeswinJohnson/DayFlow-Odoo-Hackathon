#  DayFlow

**A high-performance, role-based Human Resource Management System (HRMS) built in just 8 hours for the Odoo Hackathon.**

##  Overview
DayFlow is designed to streamline employee onboarding and management. Built under extreme time constraints, it prioritizes a rock-solid backend architecture and a frictionless user experience. We bypassed heavy, rigid frameworks in favor of a lean, custom-built full-stack architecture to ensure maximum performance and zero demo-day crashes.

##  Key Features
* **Role-Based Access Control (RBAC):** Secure JWT authentication strictly separating Admin and Employee privileges.
* **Admin-Controlled Onboarding:** A centralized dashboard for HR to seamlessly invite, provision, and manage new hires.
* **Lightning-Fast UI:** A highly responsive, modern frontend powered by Next.js, and Tailwind CSS.
* **Secure API Architecture:** FastAPI backend optimized for rapid, reliable data handling and validation.

##  Tech Stack
* **Frontend:** Next.js, Tailwind CSS
* **Backend:** FastAPI, Supabase auth
* **Database:** MySQL, Postgres managed in supabase
* **Security:** JWT (JSON Web Tokens), bcrypt


##  Future Roadmap (Enterprise & Odoo Integration)
While initially built as a highly stable standalone application for the 8-hour hackathon, the long-term vision for DayFlow focuses heavily on enterprise strategy and ecosystem alignment:
* **Odoo API Sync:** Pushing DayFlow's clean onboarding data directly into Odoo's native HR and Payroll modules via XML-RPC/JSON-RPC.
* **Unified Authentication:** Implementing SSO to bridge the DayFlow frontend with existing Odoo user credentials.
* **Advanced Analytics:** Dashboard reporting for HR bottlenecks and onboarding drop-offs.

##  Team
* **Jeswin Johnson** - Backend Development 
* **Moksha T M** - Frontend Development
