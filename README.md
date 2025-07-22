# Multi-Round Points Challenge — Real-Time Multiplayer Game

### Author: Amanuel Abera Kedida

---

## Project Overview

This is a simplified real-time multiplayer game where multiple users join a session consisting of several rounds.  
Each round selects a random winner from connected players who earn points. The game progresses through fixed rounds, displaying live scores, round info, and ultimately the overall winner.

The frontend is built with **React** (using Vite) and the backend is a **NestJS** WebSocket server that manages game state and broadcasts events.

---

## Project Structure

- `/client` — React frontend generated with Vite (runs on port 5173)
- `/server` — NestJS backend WebSocket server (runs on port 3002 for Socket.IO connections)

---

## Features

- Real-time multiplayer support using WebSocket.
- Spinner animation synchronized across clients.
- Automatic round progression and winner selection.
- Displays player list, scores, and round results.
- Game ends after a predefined number of rounds.

---

## Tech Stack

- **Frontend**: React (Vite) + Socket.IO client
- **Backend**: NestJS + Socket.IO
- **State Management**: React state/context
- **Communication**: WebSocket events (no REST API)

---

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- npm or yarn

### Environment Variables
- Create a .env file in the client directory with the following:

    VITE_SOCKET_URL=http://localhost:3002


### Running the Application

1. Start the backend server first:
   ```bash
   cd server
   npm install
   npm start


2. Install dependencies and start the frontend client:
   ```bash
    cd client
    npm install
    npm run dev

3. Open multiple browser windows/tabs and join the game with different player names to test the multiplayer functionality.

---

## Hardcoded Values & Configuration

- **Total Rounds:** 5  
- **Minimum Players to Start:** 2  
- **Backend WebSocket Port:** 3002  
- **Game Start Countdown:** 10 seconds  
- **Round Duration:** 15 seconds  
- **Delay Between Rounds:** 10 seconds  

These values are currently hardcoded inside the backend `GameGateway` class for simplicity.

---

## Design Decisions & Assumptions

### Backend

- **Used NestJS with Socket.IO** instead of Laravel as allowed by the recruiter to leverage my familiarity and speed up development.
- All **game state** (players, rounds, scores) and **logic** (player join/leave, round progression, winner selection) is contained in a single **Gateway class** for simplicity and maintainability.
- Backend acts as the **authoritative source of truth** for game state, broadcasting all events and updates to clients in real-time.
- **Hardcoded game parameters** like rounds count, minimum players, and timing inside the gateway to keep it lightweight and focused.
- **Graceful handling of player disconnects** by removing them from the game and notifying clients immediately.
- **Avoided extra layers** like services or repositories for this small real-time game, per recruiter’s preference for simplified backend.

### Frontend

- Built with **React + Vite** for fast and modular UI development.
- Used **WebSocket client** to connect to backend and listen/respond to events like `player_update`, `game_start`, `new_round`, `round_result`, and `game_over`.
- Managed **game state** (players, scores, current round, spinning status) via **React hooks** and context/state for responsive UI updates.
- Implemented **synchronized spinning animation** that starts/stops exactly based on backend events to meet the requirement for synchronized visual feedback.
- Displayed **clear player list** with scores, round info, and notifications to provide an intuitive user experience.
- Provided a **clean and simple UI**, prioritizing clarity and usability over elaborate styling as per recruiter’s instructions.
- **Distinguished the current user** clearly in the UI.
- Ensured **multi-client synchronization** by relying on backend event broadcasts only, no client-side guesses or spin triggers.

---

## Important Note on Backend Implementation

> In line with the recruiter’s request for a simplified backend, all game logic is handled within the `GameGateway` class. This avoids unnecessary architectural complexity for a lightweight real-time game.

---

## Contact

If you have any questions or need clarifications, feel free to reach out to me:

**Amanuel Abera Kedida**  
🌐 Portfolio: [amanuelabera.dev](https://amanuelabera.dev)  
📧 Email: [contact@amanuelabera.dev](mailto:contact@amanuelabera.dev)

---

## Demo Video (Optional)

A short screen recording showing real-time multiplayer interaction:

📺 [Watch the demo video](https://your-demo-link.com)