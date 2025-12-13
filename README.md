# AgroEcom

*AgroEcom* is an agricultural e-commerce platform dedicated to connecting farmers with equipment owners. It facilitates the renting of farming machinery—such as tractors, harvesters, and tillers—allowing farmers to access essential tools on a pay-as-you-use basis, improving productivity and reducing capital costs.

## 📑 Table of Contents

  - [Features](#features)<br>
      - [Farmer Features](#farmer-renter-features)<br>
      - [Admin Features](#admin-features)<br>
      - [Lender Features](#lender-owner-features)<br>
  - [Tech Stack](#tech-stack)<br>
  - [Database Schema](#database-schema)<br>
  - [Getting Started](#getting-started)<br>
      - [Prerequisites](#prerequisites)<br>
      - [Installation](#installation)<br>
      - [Environment Variables](#environment-variables)<br>
  - [Deployment](#deployment)<br>
  - [Releases](#releases)<br>
  - [Contributing](#contributing)

## Features

### General Features

  * *Secure Authentication:* User signup and login using Email/Password and Google OAuth (via Supabase Auth).<br>
  * *Role-Based Access Control:* Distinct dashboards and permissions for Farmers, Lenders, and Admins.<br>
  * *Responsive Design:* Fully responsive UI built with Tailwind CSS and Shadcn UI components.<br>
  * *Contact System:* Integrated inquiry form sending emails via Resend.

### Farmer (Renter) Features

  * *Equipment Marketplace:* Browse and search for equipment by name, location, or type.<br>
  * *Advanced Filtering:* Filter equipment lists by location, type, and sort by price or popularity.<br>
  * *Rental Requests:* detailed form to request equipment rentals with specific start/end dates and delivery options.<br>
  * *Review System:* Rate and review equipment after use to help the community.<br>
  * *Profile Management:* Manage personal details and view rental history.

### Lender (Owner) Features

  * *Equipment Management:* Add, edit, and list farming equipment with images, rates, and descriptions.<br>
  * *Rental Dashboard:* View incoming rental requests with options to *Approve* or *Reject*.<br>
  * *Analytics:* Visual charts (Recharts) displaying rental growth, total equipment count, and revenue stats.<br>
  * *Request Details:* View detailed information about the renter and the requested schedule.<br>
  * *Data Export:* Export renter data to CSV/JSON formats<br>

### Admin Features

  * *User Management:* View all registered users (Farmers and Lenders) and manage accounts (delete capabilities).<br>
  * *Platform Overview:* High-level statistics on total user base growth and platform activity.<br>
  * *Data Export:* Export user data to CSV/JSON formats.

-----

## Tech Stack

  * *Framework:* [Next.js 15+](https://nextjs.org/) (App Router)<br>
  * *Language:* [TypeScript](https://www.typescriptlang.org/)<br>
  * *Styling:* [Tailwind CSS v4](https://tailwindcss.com/)<br>
  * *UI Components:* [Shadcn UI](https://ui.shadcn.com/) (Radix UI)<br>
  * *Icons:* [Lucide React](https://lucide.dev/)<br>
  * *Database & Auth:* [Supabase](https://supabase.com/) (PostgreSQL)<br>
  * *File Storage:* Supabase Storage (for equipment images and avatars)<br>
  * *Email Service:* [Resend](https://resend.com/)<br>
  * *Visualization:* [Recharts](https://recharts.org/)<br>
  * *Date Handling:* date-fns

-----

## Database Schema

The application uses Supabase (PostgreSQL). Below is an overview of the core tables and relationships:

### profiles

Extends the detailed user information linked to auth.users.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key, FK to `auth.users` |
| role | USER-DEFINED (`user_role`) | 'farmer', 'lender', or 'admin' (default 'farmer') |
| first\_name | text | User's first name |
| last\_name | text | User's last name |
| username | text | Unique username (min 3 characters) |
| email | text | User's email |
| address | text | Physical address |
| contact\_number | text | Phone number |
| avatar\_url | text | URL to storage bucket |
| subscription | USER-DEFINED (`subscription_type`) | User subscription level (default 'free') |
| created\_at | timestamp without time zone | Creation timestamp |
| updated\_at | timestamp with time zone | Last updated timestamp |

### equipment

Stores details about the machinery available for rent.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| user\_id | uuid | FK to `public.profiles` (The Owner) |
| type\_id | uuid | FK to `public.equipment_types` |
| name | text | e.g., "John Deere Tractor" |
| model | text | Equipment model number |
| description | text | Detailed description of the equipment |
| rate | numeric | Hourly rental cost |
| delivery | USER-DEFINED | 'Pickup', 'Delivery', or 'Hybrid' |
| location | text | Equipment location |
| image\_url | text | URL to image in storage |
| rental\_count | bigint | Total number of times rented (default 0) |
| added\_at | timestamp with time zone | Creation timestamp |
| updated\_at | timestamp with time zone | Last updated timestamp |

### rentals

Tracks the transaction status between renters and lenders.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| equipment\_id | uuid | FK to `public.equipment` |
| renter\_id | uuid | FK to `public.profiles` (The Farmer) |
| owner\_id | uuid | FK to `public.profiles` (The Lender) |
| status | USER-DEFINED (`status_type`) | Rental status (default 'pending') |
| start\_date | timestamp with time zone | Rental start time |
| end\_date | timestamp with time zone | Rental end time |
| message | text | Optional message from renter |
| deliver\_at | text | Delivery location/instructions |
| return\_at | text | Return location/instructions |
| created\_at | timestamp with time zone | Creation timestamp |
| updated\_at | timestamp with time zone | Last updated timestamp |

### reviews

Feedback left by renters.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| user\_id | uuid | FK to `public.profiles` (Reviewer) |
| equipment\_id | uuid | FK to `public.equipment` |
| rating\_count | numeric | 1-5 star rating |
| comment | text | Written feedback |
| created\_at | timestamp with time zone | Creation timestamp |

### equipment\_types

Lookup table for categorizing equipment.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| name | text | Name of the type (e.g., 'Tractor') |
| created\_at | timestamp with time zone | Creation timestamp |

### inquiries

Stores messages submitted via the contact form.
| Column | Type | Description |
| :--- | :--- | :--- |
| id | bigint | Primary Key (auto-increment) |
| email | text | Sender's email address |
| first\_name | text | Sender's first name |
| last\_name | text | Sender's last name |
| message | text | The inquiry message |
| created\_at | timestamp with time zone | Creation timestamp |

-----

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

  * *Node.js* (v18 or higher recommended)<br>
  * *npm*, *yarn*, or *pnpm*<br>
  * A *Supabase* project (for DB, Auth, and Storage)<br>
  * A *Resend* API key (for emails)

### Installation

1.  *Clone the repository:*

    
    git clone https://github.com/yourusername/agroecom.git
    cd agroecom
    

2.  *Install dependencies:*

    
    npm install
    # or
    yarn install
    

3.  *Configure Environment Variables:*
    Create a .env.local file in the root directory (see section below).

4.  *Run the development server:*

    
    npm run dev
    

5.  *Open the app:*
    Visit http://localhost:3000 in your browser.

-----

## Environment Variables

Create a .env.local file in the root of your project and add the following keys:

env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url<br>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key<br>
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email Configuration
RESEND_API_KEY=re_123456789
MY_EMAIL=your_email@example.com

*Note: SUPABASE_SERVICE_ROLE_KEY is required for Admin actions like deleting users. Keep this secret.*

-----

## Deployment

The project is optimized for deployment on *Vercel*.<br><br>
1.  Push your code to a Git repository (GitHub/GitLab).<br>
2.  Import the project into Vercel.<br>
3.  Add the *Environment Variables* configured above in the Vercel project settings.<br>
4.  Deploy.<br>

Alternatively, you can build the project locally for production:

npm run build
npm start

-----

## Releases

  * *v0.1.0* - Initial Release (MVP)<br>
      * Basic Authentication and Role management.<br>
      * Equipment listing and searching.<br>
      * Rental request flow (Pending -> Approve/Reject).<br>
      * Basic Admin dashboard.<br>

-----

## Contributing

Contributions are welcome\! Please follow these steps:

1.  *Fork* the repository.<br>
2.  Create a new *Feature Branch* (git checkout -b feature/AmazingFeature).<br>
3.  *Commit* your changes (git commit -m 'Add some AmazingFeature').<br>
4.  *Push* to the branch (git push origin feature/AmazingFeature).<br>
5.  Open a *Pull Request*.<br>
