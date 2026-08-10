import api from "./api";


// Dashboard statistics
export const getAdminDashboard = () =>
    api.get("/admin/dashboard");


// Users
export const getAdminUsers = () =>
    api.get("/admin/users");

export const deleteAdminUser = (userId) =>
    api.delete(`/admin/users/${userId}`);


// Players
export const getAdminPlayers = () =>
    api.get("/admin/players");

export const deleteAdminPlayer = (playerId) =>
    api.delete(`/admin/players/${playerId}`);


// Teams
export const getAdminTeams = () =>
    api.get("/admin/teams");


// Matches
export const getAdminMatches = () =>
    api.get("/admin/matches");

export const deleteAdminMatch = (matchId) =>
    api.delete(`/admin/matches/${matchId}`);


// Tournaments
export const getAdminTournaments = () =>
    api.get("/admin/tournaments");