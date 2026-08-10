import api from "./api";


// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

export const getNotifications = async () => {

    const response = await api.get(
        "/notifications"
    );

    return response.data;
};


// =====================================================
// GET UNREAD NOTIFICATIONS
// =====================================================

export const getUnreadNotifications = async () => {

    const response = await api.get(
        "/notifications/unread"
    );

    return response.data;
};


// =====================================================
// MARK SINGLE NOTIFICATION READ
// =====================================================

export const markNotificationRead = async (
    notificationId
) => {

    const response = await api.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};


// =====================================================
// MARK ALL READ
// =====================================================

export const markAllNotificationsRead = async () => {

    const response = await api.put(
        "/notifications/read-all"
    );

    return response.data;
};