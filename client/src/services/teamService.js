import api from "./api";

export const createTeam = (data) =>
    api.post("/team/create", data);

export const getMyTeams = () =>
    api.get("/team/my-teams");

export const getTeam = (teamId) =>
    api.get(`/team/${teamId}`);

export const addTeamMember = (teamId, playerId) =>
    api.post(`/team/${teamId}/members`, {
        player_id: Number(playerId)
    });

export const removeTeamMember = (teamId, playerId) =>
    api.delete(`/team/${teamId}/members/${playerId}`);

export const leaveTeam = (teamId) =>
    api.post(`/team/${teamId}/leave`);

export const deleteTeam = (teamId) =>
    api.delete(`/team/${teamId}`);