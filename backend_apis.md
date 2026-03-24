# HungerBridge Backend API Specifications
Provide this document to your backend engineer. These are the exact routes the Frontend expects to interact with. All protected routes require a `Bearer <JWT>` in the Authorization header.

## 1. Authentication & Users
- `POST /api/auth/register`
  - *Body:* `name`, `email`, `password`, `roles` array (e.g., `['donor', 'ngo', 'volunteer']`).
- `POST /api/auth/login`
  - *Body:* `email`, `password`
  - *Returns:* JWT token, user object (ID, `roles` array, default active role, reputation score).
- `GET /api/users/me`
  - Get current user's profile metadata and gamified stats.
- `PUT /api/users/me`
  - Update details (verified status, location lat/lng for NGO/Donors).

## 2. Food Listings & ML (Donor & NGO flow)
- `POST /api/listings`
  - **(Donor)** Create a new food listing.
  - *Body:* `food_type` (Enum of the 20 ML labels), `quantity_kg`, `packaging_type`, `veg_nonveg`, `refrigerated`.
  - **BACKEND REQUIREMENT:** Backend must asynchronously process this via the ML script (bringing in weather APIs for temp/humidity) to calculate and save the `safe_minutes_remaining` timestamp.
- `GET /api/listings`
  - **(NGO)** Get active food listings in a radius.
  - *Query Params:* `lat`, `lng`, `radius_km`.
  - **BACKEND REQUIREMENT:** Do NOT return any listings where `[current_time] > [expiry_timestamp] - [buffer]`.
- `GET /api/listings/:id`
  - Get precise listing details.
- `PUT /api/listings/:id/claim`
  - **(NGO)** Formally claim a food listing so nobody else can take it.
  - *Body:* `delivery_method` (either `'self_pickup'` or `'request_volunteer'`).

## 3. Volunteer Logistics
- `GET /api/dispatch/jobs`
  - **(Volunteer)** Get available delivery jobs (listings that NGOs claimed via `request_volunteer`).
- `PUT /api/dispatch/:job_id/accept`
  - **(Volunteer)** Accept a delivery job. Marks job as `in_transit`.
- `PUT /api/dispatch/:job_id/complete`
  - **(Volunteer)** Mark job as delivered. Triggers Impact Points calculation.
- `PUT /api/users/status`
  - **(Volunteer)** Toggle `is_active` status to true/false (Online/Offline) so system knows who to ping.

## 4. Gamification, Reviews, & Validation
- `POST /api/reviews`
  - **(NGO)** Submit a review after delivery.
  - *Body:* `job_id`, `volunteer_rating` (1-5), `food_rating` (1-5), `volunteer_feedback`, `food_feedback`.
- `GET /api/profiles/:user_id`
  - **(Public)** Get the gamified stats for any user. Returns Impact Score, Badge tier (Bronze/Silver/Gold), People Fed tally, and public text reviews.
- `GET /api/leaderboard`
  - **(Public)** Get top users ranked by Impact Score. 
  - *Query Params:* `role=donor|ngo|volunteer` & `timeframe=weekly|all_time`.
