# HungerBridge

## Project Description

HungerBridge is a real-time surplus food redistribution platform
designed to connect food donors such as restaurants, wedding halls, and
canteens with NGOs and volunteers. The system ensures that excess food
is quickly collected and delivered to those in need within a limited
time window, minimizing waste and addressing food insecurity.

------------------------------------------------------------------------

## Problem Statement

A significant amount of food is wasted daily while many people lack
access to proper meals. The absence of a real-time coordination system
between food donors and distribution organizations leads to
inefficiencies and missed opportunities to utilize surplus food before
it expires.

------------------------------------------------------------------------

## Features and Functionality

-   Real-time food listing by donors with quantity and expiry time\
-   Time-bound availability with a 2-hour expiry window\
-   NGO interface to view and claim available food\
-   Volunteer coordination for pickup and delivery\
-   Status tracking from posting to delivery\
-   Location-based matching for efficient allocation\
-   Role-based authentication for donors, NGOs, and volunteers

------------------------------------------------------------------------

## Tech Stack

Frontend:\
- React.js\
- Tailwind CSS

Backend:\
- FastAPI

Database:\
- PostgreSQL (planned)\
- SQLite (currently used for development)

Other Tools and Services:\
- REST APIs\
- Geolocation services (if implemented)

------------------------------------------------------------------------

## Setup / Installation Instructions

### Clone the repository

``` bash
git clone https://github.com/your-username/hungerbridge.git
cd hungerbridge
```

### Backend Setup

``` bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory and configure:

    DATABASE_URL=sqlite:///./test.db
    SECRET_KEY=your_secret_key

Note: PostgreSQL integration can be enabled by updating the
DATABASE_URL.

------------------------------------------------------------------------

## Team Details

Team Name: Cheese Paratha

-   Sambodhi Bhowal\
-   Apoorva Mundada\
-   Manas Tiwari

------------------------------------------------------------------------

## Future Scope

-   Migration to PostgreSQL for production scalability\
-   AI-based demand prediction and food allocation optimization\
-   Route optimization for efficient delivery\
-   Mobile application support\
-   Notification system for real-time updates\
-   Rating and reliability system for participants

------------------------------------------------------------------------

## Additional Notes

If any setup steps are incomplete during submission, they will be
updated shortly after the hackathon.