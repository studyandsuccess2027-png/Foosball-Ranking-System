import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import SubmitMatch from "../pages/Match/SubmitMatch";
import MatchHistory from "../pages/Match/MatchHistory";
import EloHistory from "../pages/Profile/EloHistory";
import ProtectedRoute from "../components/ProtectedRoute";
import HeadToHead from "../pages/HeadToHead/HeadToHead";
import MyTeams from "../pages/Team/MyTeams";
import CreateTeam from "../pages/Team/CreateTeam";
import TeamDetails from "../pages/Team/TeamDetails";
import Invitations
    from "../pages/Invitations/Invitations";
import Scheduling
    from "../pages/Scheduling/Scheduling";
import Statistics
    from "../pages/Statistics/Statistics";
import Tournaments
    from "../pages/Tournament/Tournaments";

import CreateTournament
    from "../pages/Tournament/CreateTournament";

import TournamentDetails
    from "../pages/Tournament/TournamentDetails";
import AdminRoute from "./AdminRoute";
import AdminDashboard
    from "../pages/Admin/AdminDashboard";

import AdminPlayers
    from "../pages/Admin/AdminPlayers";
import AdminUsers
    from "../pages/Admin/AdminUsers";

import AdminTeams
    from "../pages/Admin/AdminTeams";

import AdminMatches
    from "../pages/Admin/AdminMatches";

import AdminTournaments
    from "../pages/Admin/AdminTournaments";
export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/match"
                    element={
                        <ProtectedRoute>
                            <SubmitMatch />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/matches"
                    element={
                        <ProtectedRoute>
                            <MatchHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/elo-history"
                    element={
                        <ProtectedRoute>
                            <EloHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/head-to-head"
                    element={
                        <ProtectedRoute>
                            <HeadToHead />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <ProtectedRoute>
                            <MyTeams />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams/create"
                    element={
                        <ProtectedRoute>
                            <CreateTeam />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams/:teamId"
                    element={
                        <ProtectedRoute>
                            <TeamDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tournaments"
                    element={
                        <ProtectedRoute>
                            <Tournaments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tournaments/create"
                    element={
                        <ProtectedRoute>
                            <CreateTournament />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tournaments/:tournamentId"
                    element={
                        <ProtectedRoute>
                            <TournamentDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/statistics"
                    element={
                        <ProtectedRoute>
                            <Statistics />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/scheduling"
                    element={
                        <ProtectedRoute>
                            <Scheduling />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/invitations"
                    element={
                        <ProtectedRoute>
                            <Invitations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/players"
                    element={
                        <ProtectedRoute>
                            <AdminPlayers />
                        </ProtectedRoute>
                    }
                />
                <Route element={<AdminRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<AdminUsers />}
                    />

                    <Route
                        path="/admin/players"
                        element={<AdminPlayers />}
                    />

                    <Route
                        path="/admin/teams"
                        element={<AdminTeams />}
                    />

                    <Route
                        path="/admin/matches"
                        element={<AdminMatches />}
                    />

                    <Route
                        path="/admin/tournaments"
                        element={<AdminTournaments />}
                    />

                </Route>
            </Routes>

        </BrowserRouter>

    );

}