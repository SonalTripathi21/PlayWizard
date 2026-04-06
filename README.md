# PlayWizard (AI Game Builder)

PlayWizard is a full-stack, no-code web application that allows users to create simple 2D games instantly using natural language prompts. It uses React.js, Express.js, MongoDB, and Phaser.js to convert text instructions into playable games.

## Features

- **Prompt Input System**: Create games by typing natural language prompts (e.g. "Create a fast space shooter game").
- **AI Processing (Mocked)**: Converts prompts into structured JSON game logic defining the game type, player, obstacles, goal, and difficulty.
- **Game Engine**: Dynamic rendering via Phaser.js utilizing the generated JSON config.
- **Customization Panel**: Tweak player speed, colors, and background in real-time.
- **Save & Share**: Save your generated games to a MongoDB database and share the unique generated ID.

## Tech Stack
- Frontend: React.js (Vite), Phaser.js, Tailwind-like custom CSS (Glassmorphism aesthetics)
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)

## Setup Instructions

1. **Pre-requisites**: Make sure you have Node.js and MongoDB installed on your system.

2. **Clone the repository** (if applicable) and navigate to the project directory.

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Make sure MongoDB is running locally on port 27017
   node server.js
   ```
   The backend will start on `http://localhost:5000`.

4. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or 5174/etc depending on availability).

5. **Usage**:
   - Open your browser to the frontend URL.
   - Enter a prompt like "Create a 2D racing game with obstacles" and click **Generate Game**.
   - Play the game using the Arrow keys.
   - Adjust settings in the Customization panel.
   - Click "Save & Share" to view your unique game ID.

Enjoy generating games with AI!
