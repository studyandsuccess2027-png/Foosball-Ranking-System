import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import NotificationBell
    from "./Notifications/NotificationBell";
export default function Navbar() {

    const role = localStorage.getItem("role");

    const { logout } = useAuth();

    return (

        <nav className="bg-white shadow">

            <div className="max-w-6xl mx-auto px-6 py-4">

                <div className="flex flex-wrap items-center gap-5">

                    {/* Logo */}

                    <Link
                        to="/dashboard"
                        className="font-bold text-xl"
                    >
                        Foosball Elo
                    </Link>


                    {/* Dashboard */}

                    <Link to="/dashboard">
                        Dashboard
                    </Link>


                    {/* Profile */}

                    <Link to="/profile">
                        Profile
                    </Link>


                    {/* Leaderboard */}

                    <Link to="/leaderboard">
                        Leaderboard
                    </Link>


                    {/* Submit Match */}

                    <Link to="/match">
                        Submit Match
                    </Link>


                    {/* Matches */}

                    <Link to="/matches">
                        Matches
                    </Link>


                    {/* Elo History */}

                    <Link to="/elo-history">
                        Elo History
                    </Link>


                    {/* Head To Head */}

                    <Link to="/head-to-head">
                        Head-to-Head
                    </Link>


                    {/* Teams */}

                    <Link to="/teams">
                        My Teams
                    </Link>


                    {/* Tournaments */}

                    <Link to="/tournaments">
                        Tournaments
                    </Link>


                    {/* Statistics */}

                    <Link to="/statistics">
                        Statistics
                    </Link>
                    {/* Match Scheduling */}

                    <Link to="/scheduling">
                        Scheduling
                    </Link>
                    <Link to="/invitations">
                        Invitations
                    </Link>
                    <NotificationBell />
                    {/* ADMIN PANEL */}

                    {role === "admin" && (

                        <Link
                            to="/admin"
                            className="font-semibold text-red-600"
                        >
                            Admin Panel
                        </Link>

                    )}


                    {/* Logout */}

                    <button
                        onClick={logout}
                        className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}