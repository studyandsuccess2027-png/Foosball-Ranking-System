import { useEffect, useState } from "react";

import {
    createScheduledMatch
} from "../../services/scheduledMatchService";

import {
    searchPlayers
} from "../../services/playerService";


export default function ScheduleMatchForm({
    onScheduled
}) {

    const [players, setPlayers] = useState([]);

    const [player2Id, setPlayer2Id] = useState("");

    const [scheduledAt, setScheduledAt] = useState("");

    const [duration, setDuration] = useState("60");

    const [location, setLocation] = useState("");

    const [notes, setNotes] = useState("");

    const [search, setSearch] = useState("");

    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // SEARCH PLAYERS
    // =====================================================

    useEffect(() => {

        const loadPlayers = async () => {

            if (!search.trim()) {

                setPlayers([]);

                return;
            }

            try {

                setLoadingPlayers(true);

                setError("");

                const response =
                    await searchPlayers(search.trim());

                const data = response.data;

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

                setLoadingPlayers(false);
            }
        };


        const timer = setTimeout(
            loadPlayers,
            400
        );


        return () => clearTimeout(timer);

    }, [search]);


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!player2Id) {

            setError(
                "Please select an opponent."
            );

            return;
        }


        if (!scheduledAt) {

            setError(
                "Please select date and time."
            );

            return;
        }


        try {

            setSubmitting(true);


            await createScheduledMatch({

                player2_id: Number(player2Id),

                scheduled_at:
                    new Date(
                        scheduledAt
                    ).toISOString(),

                duration_minutes:
                    Number(duration),

                location:
                    location.trim() || null,

                notes:
                    notes.trim() || null

            });


            setSuccess(
                "Match scheduled successfully!"
            );


            // Reset form

            setSearch("");

            setPlayers([]);

            setPlayer2Id("");

            setScheduledAt("");

            setDuration("60");

            setLocation("");

            setNotes("");


            if (onScheduled) {
                await onScheduled();
            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to schedule match"
            );

        } finally {

            setSubmitting(false);
        }
    };


    return (

        <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="mb-6 text-2xl font-bold">
                Schedule a Match
            </h2>


            {/* Error */}

            {error && (

                <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </div>

            )}


            {/* Success */}

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
                    SEARCH OPPONENT
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Search Opponent
                    </label>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {

                            setSearch(e.target.value);

                            setPlayer2Id("");

                        }}
                        placeholder="Search player by username..."
                        className="w-full rounded-lg border p-3"
                    />

                </div>


                {/* =================================================
                    PLAYER RESULTS
                ================================================= */}

                {search.trim() && (

                    <div className="rounded-lg border bg-gray-50">

                        {loadingPlayers ? (

                            <div className="p-4 text-gray-500">
                                Searching players...
                            </div>

                        ) : players.length === 0 ? (

                            <div className="p-4 text-gray-500">
                                No players found.
                            </div>

                        ) : (

                            <div className="max-h-60 overflow-y-auto">

                                {players.map((player) => (

                                    <button
                                        type="button"
                                        key={player.id}
                                        onClick={() => {

                                            setPlayer2Id(
                                                String(player.id)
                                            );

                                            setSearch(
                                                player.full_name ||
                                                player.username ||
                                                ""
                                            );

                                        }}
                                        className={`block w-full border-b p-3 text-left hover:bg-gray-100 ${
                                            String(player.id) ===
                                            String(player2Id)
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
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

                {player2Id && (

                    <div className="rounded-lg bg-blue-50 p-3 text-blue-700">

                        Opponent selected successfully.

                    </div>

                )}


                {/* =================================================
                    DATE & TIME
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Date & Time
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
                    NOTES
                ================================================= */}

                <div>

                    <label className="mb-2 block font-medium">
                        Notes
                    </label>

                    <textarea
                        value={notes}
                        onChange={(e) =>
                            setNotes(
                                e.target.value
                            )
                        }
                        placeholder="Optional message..."
                        rows="3"
                        className="w-full rounded-lg border p-3"
                    />

                </div>


                {/* =================================================
                    SUBMIT
                ================================================= */}

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        !player2Id
                    }
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    {submitting
                        ? "Scheduling..."
                        : "Schedule Match"}

                </button>

            </form>

        </div>
    );
}