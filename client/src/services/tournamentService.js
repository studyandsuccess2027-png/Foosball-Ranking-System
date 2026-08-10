import api from "./api";

// Get all tournaments
export const getTournaments = () =>
    api.get("/tournaments");

// Get tournament details
export const getTournament = (tournamentId) =>
    api.get(`/tournaments/${tournamentId}`);

// Create tournament
export const createTournament = (data) =>
    api.post("/tournaments/create", data);

// Join tournament
export const joinTournament = (tournamentId) =>
    api.post(`/tournaments/${tournamentId}/join`);

// Leave tournament
export const leaveTournament = (tournamentId) =>
    api.post(`/tournaments/${tournamentId}/leave`);

// Start tournament
export const startTournament = (tournamentId) =>
    api.post(`/tournaments/${tournamentId}/start`);

// Generate complete tournament bracket
export const generateBracket = (tournamentId) =>
    api.post(
        `/tournaments/${tournamentId}/generate-bracket`
    );

// Submit tournament match result
export const submitMatchResult = (
    matchId,
    data
) =>
    api.post(
        `/tournaments/matches/${matchId}/result`,
        data
    );

// Get tournament standings
export const getStandings = (tournamentId) =>
    api.get(
        `/tournaments/${tournamentId}/standings`
    );