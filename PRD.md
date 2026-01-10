# Product Requirements Document (PRD)
## Project: Proximity-Based Social Matching App (Hackathon MVP)

### Author
Team: Fiona Laygo & Garv Gupta  
Date: Hackathon MVP (1-day build)

---

## 1. Problem Statement

Meeting new people organically in shared physical spaces is rare, even when people are nearby and share interests. Existing dating and social apps rely on swiping, profiles, or chatting, which creates friction and discourages spontaneous real-world interaction.

This product aims to enable **low-pressure, real-world connections** by notifying users when someone compatible is nearby and suggesting a **neutral, shared meetup location**.

---

## 2. Goals & Success Criteria

### Primary Goal
Enable two nearby users with overlapping interests to:
- Be notified in real time
- Receive a suggested meetup location
- Be encouraged to meet in person

### Success Criteria (MVP)
- Two users on different phones receive a push notification when within a configurable distance
- Notification suggests a real nearby place (via Google Maps)
- Users can tap “Interested” and see instructions to go to that location
- Demo works live during pitch

---

## 3. Non-Goals (Explicitly Out of Scope)

The following are **not** included in the MVP:
- In-app chat
- Live maps or user pins
- User photos or detailed profiles
- Background location tracking
- Complex compatibility algorithms
- Safety moderation features (beyond basic privacy design)

These may be discussed as future improvements.

---

## 4. Target Platforms & Tech Stack

### Platforms
- iOS & Android (Expo / React Native)

### Backend
- Supabase (Auth, Postgres, PostGIS, Edge Functions)

### Notifications
- Expo Push Notifications

### External APIs
- Google Maps Places API (for meetup location suggestions)

---

## 5. User Flow (End-to-End)

### 5.1 Onboarding
1. User signs up via email + password
2. User enters:
   - Name
   - Interests (checkboxes, e.g. books, coffee, fitness)
   - Places they are comfortable meeting (checkboxes)
3. User grants:
   - Location permission
   - Push notification permission

---

### 5.2 Home Screen
- Greeting: “Hi, [Name]”
- Controls:
  - Edit interests
  - Edit meeting location preferences
  - Adjustable distance slider (for demo/testing)
  - Pause discovery toggle

---

### 5.3 Location Polling
- App polls user location:
  - Every ~30 seconds OR on significant movement
- Location is sent to backend with timestamp
- No continuous background tracking

---

### 5.4 Matching Logic (Backend)
Triggered when a location update is received:

1. Fetch current user location and preferences
2. Query nearby users using PostGIS (`ST_DWithin`)
3. Filter users by:
   - Recent activity (e.g. last 15 minutes)
   - Mutual interest overlap
4. Apply cooldown to avoid repeated alerts
5. If a match exists:
   - Select a shared interest
   - Query Google Maps Places API for a nearby venue
   - Fallback to a generic venue if API fails

---

### 5.5 Notification
Both users receive a push notification:

> “Someone nearby shares your interests 👀  
> We think you’d both enjoy meeting at [Place Name] ☕”

---

### 5.6 Match Screen
When user taps notification:

- Show:
  - Suggested location name
  - Distance category (e.g. “a short walk away”)
  - Optional “cute task” (e.g. “Grab a book with a red cover”)
- Actions:
  - ✅ Interested
  - ❌ Dismiss

No chat or further coordination in MVP.

---

## 6. Functional Requirements

### Authentication
- Email/password auth via Supabase
- Each user has a unique ID

### User Profile
- Name (string)
- Interests (array of strings)
- Preferred meeting locations (array of strings)
- Expo push token

### Location
- Stored as PostGIS `geography(Point)`
- Updated periodically
- Auto-expire inactive users

### Matching
- Distance threshold configurable
- Mutual interest required
- Both users notified simultaneously

### Notifications
- Sent via Expo Push API
- Include place name and intent

---

## 7. Privacy & Safety Considerations (MVP)

- Exact user locations are never shown
- Distance is abstracted (e.g. “nearby”)
- Meetup locations are neutral public places
- Users can pause discovery at any time

---

## 8. Compatibility & Matching (MVP Approach)

### MVP Strategy
- Compatibility is **rule-based**, not ML
- Based on:
  - Shared interests
  - Shared acceptable meeting locations
- This is intentionally simple for reliability

### Future Improvements (Pitch)
- Weighted interest matching
- Time-of-day context
- Anonymous pre-meet chat
- Repeated positive encounters

---

## 9. Demo Plan (Pitch)

1. Two phones log in
2. Select overlapping interests
3. Walk within distance threshold
4. Both receive notification
5. Open app → see suggested place
6. Explain design choices to judges

---

## 10. Future Roadmap (Optional Slide)

- Anonymous chat after interest confirmation
- Smart compatibility scoring
- Event-based matching (e.g. studying, workouts)
- Safety check-ins

---

## 11. MVP Definition of Done

- Matching works live
- Notifications fire correctly
- Google Maps venue appears
- App is stable for demo
