import api from "./api";


// Overall statistics
export const getMyStatistics = () =>
    api.get("/statistics/me");


// Match statistics
export const getMatchStatistics = () =>
    api.get("/statistics/matches");


// Win / loss chart
export const getWinLossStatistics = () =>
    api.get("/statistics/win-loss");


// Elo history
export const getEloHistory = () =>
    api.get("/statistics/elo-history");