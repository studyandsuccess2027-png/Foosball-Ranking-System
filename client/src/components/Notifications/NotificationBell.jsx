import { useEffect, useState } from "react";

import {
    getUnreadNotifications,
    markNotificationRead
} from "../../services/notificationService";


export default function NotificationBell() {

    const [notifications, setNotifications] =
        useState([]);

    const [open, setOpen] =
        useState(false);


    // =====================================================
    // LOAD UNREAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {

        try {

            const response =
                await getUnreadNotifications();

            setNotifications(
                response.notifications || []
            );

        } catch (err) {

            console.error(
                "Notification error:",
                err
            );

        }
    };


    // =====================================================
    // INITIAL + PERIODIC REFRESH
    // =====================================================

    useEffect(() => {

        loadNotifications();


        const interval = setInterval(
            loadNotifications,
            30000
        );


        return () => {
            clearInterval(interval);
        };

    }, []);


    // =====================================================
    // MARK READ
    // =====================================================

    const handleNotificationClick = async (
        notification
    ) => {

        try {

            await markNotificationRead(
                notification.id
            );

            setNotifications((current) =>
                current.filter(
                    (item) =>
                        item.id !== notification.id
                )
            );

        } catch (err) {

            console.error(
                "Failed to mark notification:",
                err
            );
        }
    };


    return (

        <div className="relative">

            {/* =================================================
                BELL BUTTON
            ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen(!open)
                }
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100"
                aria-label="Notifications"
            >

                <span className="text-xl">
                    🔔
                </span>


                {/* BADGE */}

                {notifications.length > 0 && (

                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">

                        {notifications.length > 99
                            ? "99+"
                            : notifications.length}

                    </span>

                )}

            </button>


            {/* =================================================
                DROPDOWN
            ================================================= */}

            {open && (

                <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-white shadow-xl">

                    <div className="flex items-center justify-between border-b p-4">

                        <h3 className="font-semibold">
                            Notifications
                        </h3>

                        <span className="text-sm text-gray-500">
                            {notifications.length}
                        </span>

                    </div>


                    {notifications.length === 0 ? (

                        <div className="p-6 text-center text-gray-500">

                            No new notifications.

                        </div>

                    ) : (

                        <div className="max-h-96 overflow-y-auto">

                            {notifications.map(
                                (notification) => (

                                    <button
                                        key={
                                            notification.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                        className="w-full border-b p-4 text-left hover:bg-gray-50"
                                    >

                                        <p className="font-medium">

                                            {notification.title}

                                        </p>


                                        <p className="mt-1 text-sm text-gray-600">

                                            {notification.message}

                                        </p>


                                        <p className="mt-2 text-xs text-gray-400">

                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}

                                        </p>

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}