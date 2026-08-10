import api from "./api";

// =====================================================
// CREATE SCHEDULED MATCH
// =====================================================

export const createScheduledMatch = async (data) => {

    const response = await api.post(
        "/scheduled-matches",
        data
    );

    return response.data;
};


// =====================================================
// GET MY SCHEDULED MATCHES
// =====================================================

export const getScheduledMatches = async (status = "") => {

    const url = status
        ? `/scheduled-matches?status=${encodeURIComponent(status)}`
        : "/scheduled-matches";

    const response = await api.get(url);

    return response.data;
};


// =====================================================
// GET SINGLE SCHEDULED MATCH
// =====================================================

export const getScheduledMatch = async (scheduleId) => {

    const response = await api.get(
        `/scheduled-matches/${scheduleId}`
    );

    return response.data;
};


// =====================================================
// CANCEL SCHEDULED MATCH
// =====================================================

export const cancelScheduledMatch = async (scheduleId) => {

    const response = await api.put(
        `/scheduled-matches/${scheduleId}/cancel`
    );

    return response.data;
};