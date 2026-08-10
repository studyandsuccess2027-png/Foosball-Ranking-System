import { useEffect, useState } from "react";

import {
    getScheduledMatches,
    cancelScheduledMatch
} from "../../services/scheduledMatchService";

import ScheduleMatchForm
    from "./ScheduleMatchForm";


export default function Scheduling() {

    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD MATCHES
    // =====================================================

    const loadMatches = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getScheduledMatches();

            setMatches(
                data.scheduled_matches || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load scheduled matches"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadMatches();

    }, []);


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this match?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await cancelScheduledMatch(id);

            await loadMatches();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to cancel match"
            );
        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not specified";
        }

        return new Date(
            date
        ).toLocaleString();
    };


    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-6xl">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Match Scheduling
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Schedule and manage your foosball matches.
                    </p>

                </div>


                {/* Schedule Form */}

                <div className="mb-8">

                    <ScheduleMatchForm
                        onScheduled={loadMatches}
                    />

                </div>


                {/* Error */}

                {error && (

                    <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>

                )}


                {/* Scheduled Matches */}

                <div>

                    <h2 className="mb-4 text-2xl font-bold">
                        My Scheduled Matches
                    </h2>


                    {loading ? (

                        <div className="rounded-xl bg-white p-8 shadow">

                            <p>
                                Loading scheduled matches...
                            </p>

                        </div>

                    ) : matches.length === 0 ? (

                        <div className="rounded-xl bg-white p-8 text-center shadow">

                            <p className="text-gray-500">
                                No scheduled matches found.
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-4">

                            {matches.map((match) => (

                                <div
                                    key={match.id}
                                    className="rounded-xl bg-white p-6 shadow"
                                >

                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <h3 className="text-xl font-semibold">

                                                {match.player1?.full_name ||
                                                    match.player1?.username ||
                                                    "Player 1"}

                                                {" vs "}

                                                {match.player2?.full_name ||
                                                    match.player2?.username ||
                                                    "Player 2"}

                                            </h3>


                                            <div className="mt-3 space-y-2 text-gray-600">

                                                <p>
                                                    📅{" "}
                                                    {formatDate(
                                                        match.scheduled_at
                                                    )}
                                                </p>


                                                {match.duration_minutes && (

                                                    <p>
                                                        ⏱️{" "}
                                                        {match.duration_minutes}
                                                        {" minutes"}
                                                    </p>

                                                )}


                                                {match.location && (

                                                    <p>
                                                        📍{" "}
                                                        {match.location}
                                                    </p>

                                                )}


                                                {match.notes && (

                                                    <p>
                                                        📝{" "}
                                                        {match.notes}
                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        <div className="flex items-center gap-3">

                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                    match.status === "scheduled"
                                                        ? "bg-green-100 text-green-700"
                                                        : match.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {match.status}
                                            </span>


                                            {match.status === "scheduled" && (

                                                <button
                                                    onClick={() =>
                                                        handleCancel(
                                                            match.id
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                >
                                                    Cancel
                                                </button>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}