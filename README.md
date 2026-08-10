<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project. -->


# 🎮 Foosball Ranking System

### A full-stack competitive Foosball platform with Elo ratings, rankings, tournaments, teams, match scheduling and player statistics.

The **Foosball Ranking System** is a full-stack web application designed to manage competitive foosball matches and provide a dynamic player ranking experience.

Players can record matches, improve their **Elo rating**, compete in tournaments, join teams, schedule matches and track their performance through statistics and ranking history.

---

## 🚀 Highlights

* 🏆 Dynamic **Elo Rating System**
* 📊 Global player **Leaderboard**
* 🥇 Ranking tiers: Bronze, Silver, Gold, Platinum & Diamond
* 🎯 Match submission and match history
* 📈 Elo rating history and performance statistics
* 🏟️ Tournament creation and bracket management
* 👥 Team creation and management
* 📅 Match scheduling
* ✉️ Player invitations
* 🔔 Notifications
* ⚔️ Head-to-head player statistics
* 🔐 JWT-based authentication
* 👨‍💼 Admin dashboard and management
* 📱 Responsive React interface

---

## 📸 Application Preview

### Dashboard

![Dashboard](./public/screenshots/admin-dashboard.png)

### Create-team

![Create-team](./public/screenshots/create-team.png)

### Elo-history

![Elo-history](./public/screenshots/elo-history.png)

### Head-to-Head

![Head-to-Head](./public/screenshots/head-to-head.png)

### Invitation

![Invitation](./public/screenshots/invitation.png)

### Leaderboard

![Leaderboard](./public/screenshots/leaderboard.png)

### Login

![Login](./public/screenshots/login-page.png)

### Register

![Register](./public/screenshots/register.png)

### Manage-players by admin

![Manage-players](./public/screenshots/manage-players.png)

### Manage-team by admin

![Manage-team](./public/screenshots/manage-team.png)

### Manage-tournament by admin

![Manage-tournament](./public/screenshots/manage-tournament.png)

### Match-history

![Match-history](./public/screenshots/match-history.png)

### Manage-scheduling

![Manage-scheduling](./public/screenshots/match-scheduling.png)

### Notification

![Notification](./public/screenshots/notification.png)

### Player-dashboard

![Player-dashboard](./public/screenshots/player-dashboard.png)

### Player-profile

![Player-profile](./public/screenshots/profile-page.png)

### Statics

![Statics](./public/screenshots/statics.png)

### Submit-match

![Submit-match](./public/screenshots/submit-match.png)

### Tournament

![Tournament](./public/screenshots/tournament.png)

---

## 🏆 Elo Rating System

The application uses an Elo-based rating system to calculate player rankings after competitive matches.

Players start with:

```text
1000 Elo
```

### Ranking Tiers

| Tier        | Elo Rating  |
| ----------- | ----------- |
| 🥉 Bronze   | Below 1200  |
| 🥈 Silver   | 1200 – 1399 |
| 🥇 Gold     | 1400 – 1599 |
| 💎 Platinum | 1600 – 1799 |
| 💠 Diamond  | 1800+       |

Player ratings are automatically updated after eligible matches.

---

## 📊 Player Statistics

Each player can track:

* Current Elo rating
* Matches played
* Wins
* Losses
* Win rate
* Current winning/losing streak
* Elo rating history
* Match history
* Head-to-head performance
* Current ranking tier

---

## 🏟️ Tournament System

The tournament module allows players to participate in competitive tournaments.

### Features

* Create tournaments
* Join tournaments
* Leave tournaments
* Tournament participant management
* Automatic bracket generation
* Tournament matches
* Winner tracking
* Tournament Elo updates
* Tournament Elo history

---

## 👥 Team Management

Players can create and manage teams for team-based competition.

### Team Features

* Create teams
* Add/manage team members
* View team details
* Team-based competition
* Team management through the application

---

## 📅 Match Scheduling

Players can schedule upcoming matches with other players.

The scheduling system supports:

* Match date and time
* Player invitations
* Scheduled match management
* Invitation handling
* Notifications

---

## 🔔 Notifications & Invitations

The application provides a notification system for important player activities.

Examples include:

* Match invitations
* Scheduled match updates
* Tournament-related events
* Player invitations
* Other system notifications

---

## ⚔️ Head-to-Head

Players can compare their performance against another player.

The Head-to-Head system provides:

* Total matches
* Player wins
* Opponent wins
* Draws
* Win rate
* Total scores
* Current H2H streak
* Recent matches
* Current Elo ratings
* Ranking tiers

---

## 🔐 Authentication & Authorization

The application uses JWT-based authentication.

### Supported functionality

* User registration
* User login
* Protected routes
* JWT authentication
* Role-based access
* Admin-only sections

---

## 👨‍💼 Admin Dashboard

Administrators can manage important parts of the platform.

Admin functionality includes:

* User management
* Player management
* Match management
* Team management
* Tournament management

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Lucide React
* Recharts

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-JWT-Extended
* Flask-CORS

### Database

* SQLite

### Development Tools

* Git
* GitHub
* VS Code

---

## 📁 Project Structure

```text
Foosball-Ranking-System/
│
├── client/
│   ├── public/
|   |    ├── screenshots/
│   |       ├── admin-dashboard.png
│   |       ├── create-team.png
│   |       ├── elo-history.png
│   |       ├── head-to-head.png
│   |       ├── invitation.png
│   |       ├── leaderboard.png
│   |       ├── login-page.png
│   |       ├── register.png
│   |       ├── manage-players.png
│   |       ├── manage-team.png
│   |       ├── manage-tournament.png
│   |       ├── match-history.png
│   |       ├── match-scheduling.png
│   |       ├── notification.png
│   |       ├── player-dashboard.png
│   |       ├── profile-page.png
│   |       ├── statics.png
│   |       ├── submit-match.png
│   |       └── tournament.png
│   |
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   └── extensions.py
│   │
│   ├── app.py
│   └── make_admin.py
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/studyandsuccess2027-png/Foosball-Ranking-System.git
cd Foosball-Ranking-System
```

---

## 2. Backend Setup

Move into the server directory:

```bash
cd server
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

> Make sure your backend dependency file is committed before using this command.

---

## 3. Environment Variables

Create:

```text
server/.env
```

Example:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

⚠️ **Never commit your real `.env` file to GitHub.**

Use `.env.example` for sharing required configuration without exposing secrets.

---

## 4. Start the Backend

From the `server` directory:

```bash
python app.py
```

The backend should run at:

```text
http://127.0.0.1:5000
```

---

## 5. Frontend Setup

Open another terminal:

```powershell
cd client
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

---

# 🔌 API Modules

The backend is organized into modular Flask routes.

| Module              | Purpose                             |
| ------------------- | ----------------------------------- |
| `/api/auth`         | Authentication                      |
| `/api/player`       | Player profiles, matches & rankings |
| `/api/statistics`   | Player statistics                   |
| `/api/tournament`   | Tournament management               |
| `/api/team`         | Team management                     |
| `/api/scheduling`   | Match scheduling                    |
| `/api/invitation`   | Player invitations                  |
| `/api/notification` | Notifications                       |
| `/api/admin`        | Administrative operations           |

---

# 📈 Ranking Flow

```text
Player
   │
   ▼
Submit Match
   │
   ▼
Match Result
   │
   ▼
Elo Calculation
   │
   ▼
Player Rating Updated
   │
   ▼
Elo History Recorded
   │
   ▼
Leaderboard Updated
   │
   ▼
Ranking Tier Updated
```

---

# 🔒 Security

This project follows basic security practices including:

* JWT authentication
* Protected API routes
* Role-based authorization
* Environment variables for secrets
* `.gitignore` protection for local databases
* Virtual environment exclusion
* Node modules exclusion
* Python cache exclusion

**Sensitive configuration and local database files should never be committed to the repository.**

---

# 🧪 Development

Before committing changes, check:

```bash
git status
```

Review staged files:

```bash
git diff --cached --name-only
```

Commit changes:

```bash
git add .
git commit -m "Implement ranking, tournaments, player management and UI improvements"
```

Push to GitHub:

```bash
git push
```

---

# 🔮 Future Improvements

Potential future improvements include:

* Real-time match updates
* Live tournament brackets updates
* Advanced player analytics
* Achievement and badge system
* Player matchmaking
* Improved mobile experience
* Cloud database deployment
* Production deployment
* Real-time notifications

---

# 👨‍💻 Author

**Archana**

B.Tech — Computer Science & Engineering

This project was developed as a full-stack application for learning and implementing:

REST API development
React frontend architecture
Flask backend architecture
JWT authentication
SQL database design
Elo rating algorithms
Ranking systems
Tournament management
Team management
Full-stack application development

---

## 📄 License

This project is intended for educational and portfolio purposes.
