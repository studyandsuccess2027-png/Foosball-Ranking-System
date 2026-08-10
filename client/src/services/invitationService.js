import api from "./api";


// =====================================================
// SEND INVITATION
// =====================================================

export const sendInvitation = async (data) => {

    const response = await api.post(
        "/invitations",
        data
    );

    return response.data;
};


// =====================================================
// RECEIVED INVITATIONS
// =====================================================

export const getReceivedInvitations = async (
    status = ""
) => {

    const url = status
        ? `/invitations/received?status=${encodeURIComponent(status)}`
        : "/invitations/received";

    const response = await api.get(url);

    return response.data;
};


// =====================================================
// SENT INVITATIONS
// =====================================================

export const getSentInvitations = async (
    status = ""
) => {

    const url = status
        ? `/invitations/sent?status=${encodeURIComponent(status)}`
        : "/invitations/sent";

    const response = await api.get(url);

    return response.data;
};


// =====================================================
// ACCEPT INVITATION
// =====================================================

export const acceptInvitation = async (
    invitationId
) => {

    const response = await api.put(
        `/invitations/${invitationId}/accept`
    );

    return response.data;
};


// =====================================================
// DECLINE INVITATION
// =====================================================

export const declineInvitation = async (
    invitationId
) => {

    const response = await api.put(
        `/invitations/${invitationId}/decline`
    );

    return response.data;
};