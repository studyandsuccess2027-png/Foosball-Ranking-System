import { useEffect, useState } from "react";
import SendInvitation
    from "./SendInvitation";
import {
    getReceivedInvitations,
    acceptInvitation,
    declineInvitation
} from "../../services/invitationService";


export default function Invitations() {

    const [invitations, setInvitations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [processingId, setProcessingId] = useState(null);


    // =====================================================
    // LOAD RECEIVED INVITATIONS
    // =====================================================

    const loadInvitations = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getReceivedInvitations();

            setInvitations(
                response.invitations || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load invitations"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadInvitations();

    }, []);


    // =====================================================
    // ACCEPT
    // =====================================================

    const handleAccept = async (invitationId) => {

        try {

            setProcessingId(invitationId);
            setError("");

            await acceptInvitation(invitationId);

            await loadInvitations();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to accept invitation"
            );

        } finally {

            setProcessingId(null);
        }
    };


    // =====================================================
    // DECLINE
    // =====================================================

    const handleDecline = async (invitationId) => {

        const confirmed = window.confirm(
            "Are you sure you want to decline this invitation?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingId(invitationId);
            setError("");

            await declineInvitation(invitationId);

            await loadInvitations();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to decline invitation"
            );

        } finally {

            setProcessingId(null);
        }
    };


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "No date specified";
        }

        return new Date(
            date
        ).toLocaleString();
    };


    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-5xl">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Match Invitations
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage invitations from other players.
                    </p>

                </div>

                {/* SEND INVITATION */}

                <div className="mb-8">

                    <SendInvitation />

                </div>
                {/* ERROR */}

                {error && (

                    <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="rounded-xl bg-white p-8 text-center shadow">

                        Loading invitations...

                    </div>

                ) : invitations.length === 0 ? (

                    <div className="rounded-xl bg-white p-10 text-center shadow">

                        <div className="mb-3 text-4xl">
                            📭
                        </div>

                        <h2 className="text-xl font-semibold">
                            No invitations
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You don't have any match invitations right now.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {invitations.map((invitation) => (

                            <div
                                key={invitation.id}
                                className="rounded-xl bg-white p-6 shadow"
                            >

                                {/* HEADER */}

                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                                    <div>

                                        <h2 className="text-xl font-bold">

                                            {invitation.sender?.full_name ||
                                                invitation.sender?.username ||
                                                "Player"}

                                        </h2>

                                        {invitation.sender?.username && (
                                            <p className="text-sm text-gray-500">
                                                @{invitation.sender.username}
                                            </p>
                                        )}

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${invitation.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : invitation.status === "accepted"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {invitation.status}
                                    </span>

                                </div>


                                {/* DETAILS */}

                                <div className="mt-5 space-y-2 text-gray-600">

                                    {invitation.scheduled_at && (

                                        <p>
                                            📅{" "}
                                            {formatDate(
                                                invitation.scheduled_at
                                            )}
                                        </p>

                                    )}


                                    {invitation.duration_minutes && (

                                        <p>
                                            ⏱️{" "}
                                            {invitation.duration_minutes}
                                            {" minutes"}
                                        </p>

                                    )}


                                    {invitation.location && (

                                        <p>
                                            📍{" "}
                                            {invitation.location}
                                        </p>

                                    )}


                                    {invitation.message && (

                                        <div className="mt-3 rounded-lg bg-gray-50 p-3">

                                            <p className="text-sm text-gray-500">
                                                Message
                                            </p>

                                            <p className="mt-1 text-gray-700">
                                                {invitation.message}
                                            </p>

                                        </div>

                                    )}

                                </div>


                                {/* ACTIONS */}

                                {invitation.status === "pending" && (

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                                        <button
                                            onClick={() =>
                                                handleAccept(
                                                    invitation.id
                                                )
                                            }
                                            disabled={
                                                processingId ===
                                                invitation.id
                                            }
                                            className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {processingId ===
                                                invitation.id
                                                ? "Processing..."
                                                : "Accept"}

                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDecline(
                                                    invitation.id
                                                )
                                            }
                                            disabled={
                                                processingId ===
                                                invitation.id
                                            }
                                            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            Decline

                                        </button>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}