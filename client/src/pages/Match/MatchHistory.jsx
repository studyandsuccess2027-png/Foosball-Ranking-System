import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getMyMatches
} from "../../services/playerService";

export default function MatchHistory() {

    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadMatches();

    }, []);

    async function loadMatches() {

        try {

            const response =
                await getMyMatches();

            setMatches(
                response.data.matches || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load matches"
            );

        } finally {

            setLoading(false);

        }
    }

    function resultClass(result) {

        if (result === "WIN") {

            return "bg-green-100 text-green-700";

        }

        if (result === "LOSS") {

            return "bg-red-100 text-red-700";

        }

        return "bg-gray-100 text-gray-700";
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">

                    Loading match history...

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Match History
                    </h1>

                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

                            {error}

                        </div>

                    )}

                    {matches.length === 0 ? (

                        <div className="bg-white rounded-xl shadow p-6">

                            <p className="text-gray-500">
                                You haven't played any matches yet.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {matches.map((match) => (

                                <div
                                    key={match.id}
                                    className="bg-white rounded-xl shadow p-5"
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">

                                        {/* Opponent */}

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Opponent
                                            </p>

                                            <h2 className="font-bold text-lg">
                                                {match.opponent.full_name}
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                @{match.opponent.username}
                                            </p>

                                        </div>

                                        {/* Score */}

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Score
                                            </p>

                                            <p className="text-2xl font-bold">
                                                {match.my_score}
                                                {" - "}
                                                {match.opponent_score}
                                            </p>

                                        </div>

                                        {/* Result */}

                                        <div>

                                            <span
                                                className={`px-4 py-2 rounded-full font-semibold ${resultClass(match.result)}`}
                                            >
                                                {match.result}
                                            </span>

                                        </div>

                                        {/* Elo */}

                                        <div className="text-right">

                                            <p className="text-sm text-gray-500">
                                                Elo Change
                                            </p>

                                            <p
                                                className={`text-xl font-bold ${
                                                    match.elo_change > 0
                                                        ? "text-green-600"
                                                        : match.elo_change < 0
                                                        ? "text-red-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {match.elo_change > 0
                                                    ? `+${match.elo_change}`
                                                    : match.elo_change
                                                }
                                            </p>

                                            <p className="text-xs text-gray-500">

                                                {match.old_rating}
                                                {" → "}
                                                {match.new_rating}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}