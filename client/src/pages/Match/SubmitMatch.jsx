import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    submitMatch,
    searchPlayers
} from "../../services/playerService";

export default function SubmitMatch() {

    const [players, setPlayers] = useState([]);

    const [player1, setPlayer1] = useState("");

    const [player2, setPlayer2] = useState("");

    const [score1, setScore1] = useState("");

    const [score2, setScore2] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {

        loadPlayers();

    }, []);

    async function loadPlayers() {

        try {

            const response =
                await searchPlayers("");

            setPlayers(
                response.data.players || []
            );

        } catch (error) {

            console.error(error);

        }

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!player1 || !player2) {

            setError(
                "Please select both players."
            );

            return;
        }

        if (player1 === player2) {

            setError(
                "A player cannot play against themselves."
            );

            return;
        }

        if (score1 === "" || score2 === "") {

            setError(
                "Please enter both scores."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await submitMatch({

                player1: Number(player1),

                player2: Number(player2),

                score1: Number(score1),

                score2: Number(score2)

            });

            const ratings =
                response.data.ratings;

            setMessage(

                `Match submitted successfully. ` +

                `Player 1: ${ratings.player1.old_rating} → ${ratings.player1.new_rating}. ` +

                `Player 2: ${ratings.player2.old_rating} → ${ratings.player2.new_rating}.`

            );

            setScore1("");
            setScore2("");

        } catch (error) {

            setError(

                error.response?.data?.message ||
                "Unable to submit match."

            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-xl mx-auto p-6">

                    <div className="bg-white rounded-2xl shadow-lg p-6">

                        <h1 className="text-3xl font-bold mb-2">
                            Submit Match
                        </h1>

                        <p className="text-gray-500 mb-6">
                            Enter the result of your Foosball match.
                        </p>

                        {message && (

                            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">

                                {message}

                            </div>

                        )}

                        {error && (

                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

                                {error}

                            </div>

                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Player 1 */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Player 1
                                </label>

                                <select
                                    value={player1}
                                    onChange={(e) =>
                                        setPlayer1(e.target.value)
                                    }
                                    className="w-full border rounded-lg p-3"
                                >

                                    <option value="">
                                        Select Player 1
                                    </option>

                                    {players.map((player) => (

                                        <option
                                            key={player.id}
                                            value={player.id}
                                        >
                                            {player.full_name}
                                            {" "}
                                            (@{player.username})
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Player 2 */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Player 2
                                </label>

                                <select
                                    value={player2}
                                    onChange={(e) =>
                                        setPlayer2(e.target.value)
                                    }
                                    className="w-full border rounded-lg p-3"
                                >

                                    <option value="">
                                        Select Player 2
                                    </option>

                                    {players.map((player) => (

                                        <option
                                            key={player.id}
                                            value={player.id}
                                        >
                                            {player.full_name}
                                            {" "}
                                            (@{player.username})
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Scores */}

                            <div className="grid grid-cols-2 gap-4">

                                <div>

                                    <label className="block font-medium mb-2">
                                        Player 1 Score
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={score1}
                                        onChange={(e) =>
                                            setScore1(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-3"
                                    />

                                </div>

                                <div>

                                    <label className="block font-medium mb-2">
                                        Player 2 Score
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={score2}
                                        onChange={(e) =>
                                            setScore2(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-3"
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            >

                                {loading
                                    ? "Submitting..."
                                    : "Submit Match"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </main>
        </>
    );
}