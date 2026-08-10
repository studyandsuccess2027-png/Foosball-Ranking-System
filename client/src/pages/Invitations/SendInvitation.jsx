import { useEffect, useState } from "react";

import {
    searchPlayers
} from "../../services/playerService";

import {
    sendInvitation
} from "../../services/invitationService";


export default function SendInvitation({
    onSent
}) {

    const [search, setSearch] = useState("");

    const [players, setPlayers] = useState([]);

    const [selectedPlayer, setSelectedPlayer] =
        useState(null);

    const [scheduledAt, setScheduledAt] =
        useState("");

    const [duration, setDuration] =
        useState("60");

    const [location, setLocation] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // SEARCH PLAYERS
    // =====================================================

    useEffect(() => {

        if (!search.trim()) {

            setPlayers([]);

            return;
        }


        const timer = setTimeout(
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const response =
                        await searchPlayers(
                            search.trim()
                        );

                    const data =
                        response.data;

                    setPlayers(
                        data.players ||
                        data.results ||
                        data ||
                        []
                    );

                } catch (err) {

                    console.error(err);

                    setError(
                        err.response?.data?.message ||
                        "Failed to search players"
                    );

                    setPlayers([]);

                } finally {

                    setLoading(false);
                }

            },
            400
        );


        return () =>
            clearTimeout(timer);

    }, [search]);


    // =====================================================
    // SELECT PLAYER
    // =====================================================

    const handleSelectPlayer = (player) => {

        setSelectedPlayer(player);

        setSearch(
            player.full_name ||
            player.username ||
            ""
        );

        setPlayers([]);

        setError("");

    };


    // =====================================================
    // SEND INVITATION
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!selectedPlayer) {

            setError(
                "Please select a player."
            );

            return;
        }


        try {

            setSending(true);


            const invitationData = {

                receiver_id:
                    Number(selectedPlayer.id),

                scheduled_at:
                    scheduledAt
                        ? new Date(
                            scheduledAt
                        ).toISOString()
                        : null,

                duration_minutes:
                    Number(duration),

                location:
                    location.trim() || null,

                message:
                    message.trim() || null

            };


            await sendInvitation(
                invitationData
            );


            setSuccess(
                `Invitation sent to ${
                    selectedPlayer.full_name ||
                    selectedPlayer.username ||
                    "player"
                }!`
            );


            // Reset

            setSelectedPlayer(null);

            setSearch("");

            setScheduledAt("");

            setDuration("60");

            setLocation("");

            setMessage("");


            if (onSent) {
                await onSent();
            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to send invitation"
            );

        } finally {

            setSending(false);
        }
    };


    return (

        <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-2 text-2xl font-bold">
                Send Match Invitation
            </h2>

            <p className="mb-6 text-gray-600">
                Invite another player to play a match.
            </p>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
                    {success}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* =================================================
                    SEARCH PLAYER
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Search Player
                    </label>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {

                            setSearch(
                                e.target.value
                            );

                            setSelectedPlayer(null);

                        }}
                        placeholder="Search by username..."
                        className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                    />

                </div>


                {/* =================================================
                    SEARCH RESULTS
                ================================================= */}

                {search.trim() &&
                    !selectedPlayer && (

                    <div className="rounded-lg border bg-gray-50">

                        {loading ? (

                            <div className="p-4 text-gray-500">
                                Searching players...
                            </div>

                        ) : players.length === 0 ? (

                            <div className="p-4 text-gray-500">
                                No players found.
                            </div>

                        ) : (

                            <div className="max-h-60 overflow-y-auto">

                                {players.map(
                                    (player) => (

                                    <button
                                        key={player.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectPlayer(
                                                player
                                            )
                                        }
                                        className="w-full border-b p-3 text-left hover:bg-gray-100"
                                    >

                                        <div className="font-medium">

                                            {player.full_name ||
                                                player.username ||
                                                `Player #${player.id}`}

                                        </div>


                                        {player.username &&
                                            player.full_name && (

                                            <div className="text-sm text-gray-500">

                                                @{player.username}

                                            </div>

                                        )}

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                    SELECTED PLAYER
                ================================================= */}

                {selectedPlayer && (

                    <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">

                        <div>

                            <p className="text-sm text-blue-600">
                                Inviting
                            </p>

                            <p className="font-semibold text-blue-900">

                                {selectedPlayer.full_name ||
                                    selectedPlayer.username ||
                                    `Player #${selectedPlayer.id}`}

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => {

                                setSelectedPlayer(null);

                                setSearch("");

                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                            Change
                        </button>

                    </div>

                )}


                {/* =================================================
                    DATE & TIME
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Match Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) =>
                            setScheduledAt(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border p-3"
                    />

                </div>


                {/* =================================================
                    DURATION
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Duration
                    </label>

                    <select
                        value={duration}
                        onChange={(e) =>
                            setDuration(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border p-3"
                    >

                        <option value="30">
                            30 minutes
                        </option>

                        <option value="60">
                            60 minutes
                        </option>

                        <option value="90">
                            90 minutes
                        </option>

                        <option value="120">
                            2 hours
                        </option>

                    </select>

                </div>


                {/* =================================================
                    LOCATION
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Location
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(e) =>
                            setLocation(
                                e.target.value
                            )
                        }
                        placeholder="e.g. Foosball Club"
                        className="w-full rounded-lg border p-3"
                    />

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Message
                    </label>

                    <textarea
                        value={message}
                        onChange={(e) =>
                            setMessage(
                                e.target.value
                            )
                        }
                        placeholder="Write an optional message..."
                        rows="3"
                        className="w-full rounded-lg border p-3"
                    />

                </div>


                {/* =================================================
                    SEND BUTTON
                ================================================= */}

                <button
                    type="submit"
                    disabled={
                        sending ||
                        !selectedPlayer
                    }
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {sending
                        ? "Sending Invitation..."
                        : "Send Invitation"}

                </button>

            </form>

        </div>
    );
}