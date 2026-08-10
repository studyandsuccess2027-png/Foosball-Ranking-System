import api from "./api";

// Profile
export const createProfile = (data) =>
    api.post("/player/create", data);

export const getProfile = () =>
    api.get("/player/me");

export const updateProfile = (data) =>
    api.put("/player/update", data);

export const deleteProfile = () =>
    api.delete("/player/delete");

export const leaderboard = ({
    search = "",
    tier = "",
    sort = "elo",
    order = "desc"
} = {}) =>
    api.get("/player/leaderboard", {
        params: {
            search,
            tier,
            sort,
            order
        }
    });

export const searchPlayers = (keyword) =>
    api.get(`/player/search?q=${encodeURIComponent(keyword)}`);

// Ranking
export const getPlayerRanking = (playerId) =>
    api.get(`/player/ranking/${playerId}`);
// Matches
export const submitMatch = (data) =>
    api.post("/player/submit-match", data);

export const getMyMatches = () =>
    api.get("/player/my-matches");

export const getAllMatches = () =>
    api.get("/player/matches");

// Elo
export const getEloHistory = () =>
    api.get("/player/elo-history");

export const getHeadToHead = (
    player1,
    player2
) =>
    api.get(
        `/player/head-to-head?player1=${player1}&player2=${player2}`
    );