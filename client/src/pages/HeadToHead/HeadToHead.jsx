import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getHeadToHead,
    searchPlayers
} from "../../services/playerService";

export default function HeadToHead() {

    const [players, setPlayers] = useState([]);

    const [player1, setPlayer1] = useState("");

    const [player2, setPlayer2] = useState("");

    const [player1Search, setPlayer1Search] = useState("");

    const [player2Search, setPlayer2Search] = useState("");

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [searching, setSearching] = useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD PLAYERS
    // =====================================================

    useEffect(() => {

        loadPlayers();

    }, []);

    async function loadPlayers() {

        try {

            const response = await searchPlayers("");

            setPlayers(
                response.data.players ||
                response.data ||
                []
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load players"
            );

        }

    }

    // =====================================================
    // SEARCH PLAYERS
    // =====================================================

    async function handlePlayerSearch(
        value,
        setSearch
    ) {

        setSearch(value);

        if (!value.trim()) {

            loadPlayers();

            return;

        }

        try {

            setSearching(true);

            const response =
                await searchPlayers(value);

            setPlayers(
                response.data.players ||
                response.data ||
                []
            );

        } catch (error) {

            console.error(error);

        } finally {

            setSearching(false);

        }

    }

    // =====================================================
    // LOAD H2H
    // =====================================================

    async function handleCompare(e) {

        e.preventDefault();

        setError("");

        setResult(null);

        if (!player1 || !player2) {

            setError(
                "Please select both players."
            );

            return;

        }

        if (player1 === player2) {

            setError(
                "Please select two different players."
            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await getHeadToHead(
                    player1,
                    player2
                );

            setResult(
                response.data
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load head-to-head data"
            );

        } finally {

            setLoading(false);

        }

    }

    // =====================================================
    // RESET
    // =====================================================

    function resetComparison() {

        setPlayer1("");

        setPlayer2("");

        setPlayer1Search("");

        setPlayer2Search("");

        setResult(null);

        setError("");

    }

    // =====================================================
    // TIER STYLE
    // =====================================================

    function getTierStyle(tier) {

        switch (
        tier?.toLowerCase()
        ) {

            case "diamond":
                return "bg-purple-100 text-purple-700";

            case "platinum":
                return "bg-blue-100 text-blue-700";

            case "gold":
                return "bg-yellow-100 text-yellow-700";

            case "silver":
                return "bg-gray-200 text-gray-700";

            case "bronze":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-600";

        }

    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">

                            Head-to-Head

                        </h1>

                        <p className="text-gray-500 mt-1">

                            Compare two players and see their complete
                            rivalry statistics.

                        </p>

                    </div>

                    {/* =================================================
                        SELECT PLAYERS
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow p-6 mb-8">

                        <form
                            onSubmit={handleCompare}
                        >

                            <div className="grid md:grid-cols-2 gap-6">

                                {/* PLAYER 1 */}

                                <div>

                                    <label className="block font-semibold mb-2">

                                        Player 1

                                    </label>

                                    <input
                                        type="text"
                                        value={player1Search}
                                        onChange={(e) =>
                                            handlePlayerSearch(
                                                e.target.value,
                                                setPlayer1Search
                                            )
                                        }
                                        placeholder="Search player..."
                                        className="w-full border rounded-lg px-4 py-3 mb-3"
                                    />

                                    <select
                                        value={player1}
                                        onChange={(e) =>
                                            setPlayer1(e.target.value)
                                        }
                                        className="w-full border rounded-lg px-4 py-3"
                                    >

                                        <option value="">
                                            Select Player 1
                                        </option>

                                        {players.map(
                                            (player) => (

                                                <option
                                                    key={player.id}
                                                    value={player.id}
                                                >

                                                    {player.full_name ||
                                                        player.username}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                {/* PLAYER 2 */}

                                <div>

                                    <label className="block font-semibold mb-2">

                                        Player 2

                                    </label>

                                    <input
                                        type="text"
                                        value={player2Search}
                                        onChange={(e) =>
                                            handlePlayerSearch(
                                                e.target.value,
                                                setPlayer2Search
                                            )
                                        }
                                        placeholder="Search player..."
                                        className="w-full border rounded-lg px-4 py-3 mb-3"
                                    />

                                    <select
                                        value={player2}
                                        onChange={(e) =>
                                            setPlayer2(e.target.value)
                                        }
                                        className="w-full border rounded-lg px-4 py-3"
                                    >

                                        <option value="">
                                            Select Player 2
                                        </option>

                                        {players.map(
                                            (player) => (

                                                <option
                                                    key={player.id}
                                                    value={player.id}
                                                >

                                                    {player.full_name ||
                                                        player.username}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="flex gap-3 mt-6">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                                >

                                    {loading
                                        ? "Comparing..."
                                        : "Compare Players"
                                    }

                                </button>

                                <button
                                    type="button"
                                    onClick={resetComparison}
                                    className="bg-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                                >

                                    Reset

                                </button>

                            </div>

                        </form>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">

                            {error}

                        </div>

                    )}

                    {/* =================================================
                        RESULT
                    ================================================= */}

                    {result && (

                        <div>

                            {/* =========================================
                                PLAYER HEADER
                            ========================================= */}

                            <div className="grid md:grid-cols-2 gap-6 mb-6">

                                {/* PLAYER 1 */}

                                <div className="bg-white rounded-xl shadow p-6 text-center">

                                    <h2 className="text-2xl font-bold">

                                        {
                                            result.players.player1.full_name ||
                                            result.players.player1.username
                                        }

                                    </h2>

                                    <p className="text-gray-500">

                                        @
                                        {result.players.player1.username}

                                    </p>

                                    <div className="flex justify-center gap-3 mt-4">

                                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">

                                            Elo{" "}
                                            {result.players.player1.elo_rating}

                                        </span>

                                        <span
                                            className={`px-4 py-2 rounded-full font-bold ${getTierStyle(
                                                result.players.player1.tier
                                            )}`}
                                        >

                                            {
                                                result.players.player1.tier
                                            }

                                        </span>

                                    </div>

                                </div>

                                {/* PLAYER 2 */}

                                <div className="bg-white rounded-xl shadow p-6 text-center">

                                    <h2 className="text-2xl font-bold">

                                        {
                                            result.players.player2.full_name ||
                                            result.players.player2.username
                                        }

                                    </h2>

                                    <p className="text-gray-500">

                                        @
                                        {result.players.player2.username}

                                    </p>

                                    <div className="flex justify-center gap-3 mt-4">

                                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">

                                            Elo{" "}
                                            {result.players.player2.elo_rating}

                                        </span>

                                        <span
                                            className={`px-4 py-2 rounded-full font-bold ${getTierStyle(
                                                result.players.player2.tier
                                            )}`}
                                        >

                                            {
                                                result.players.player2.tier
                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* =========================================
                                MAIN STATISTICS
                            ========================================= */}

                            <div className="bg-white rounded-xl shadow p-6 mb-6">

                                <h2 className="text-xl font-bold mb-6">

                                    Head-to-Head Statistics

                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                                    <div className="text-center p-4 bg-gray-50 rounded-lg">

                                        <p className="text-gray-500 text-sm">

                                            Matches

                                        </p>

                                        <p className="text-2xl font-bold">

                                            {
                                                result.statistics
                                                    .matches_played
                                            }

                                        </p>

                                    </div>

                                    <div className="text-center p-4 bg-green-50 rounded-lg">

                                        <p className="text-gray-500 text-sm">

                                            Player 1 Wins

                                        </p>

                                        <p className="text-2xl font-bold text-green-600">

                                            {
                                                result.statistics
                                                    .player1_wins
                                            }

                                        </p>

                                    </div>

                                    <div className="text-center p-4 bg-red-50 rounded-lg">

                                        <p className="text-gray-500 text-sm">

                                            Player 2 Wins

                                        </p>

                                        <p className="text-2xl font-bold text-red-600">

                                            {
                                                result.statistics
                                                    .player2_wins
                                            }

                                        </p>

                                    </div>

                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">

                                        <p className="text-gray-500 text-sm">

                                            Draws

                                        </p>

                                        <p className="text-2xl font-bold">

                                            {
                                                result.statistics
                                                    .draws
                                            }

                                        </p>

                                    </div>

                                    <div className="text-center p-4 bg-blue-50 rounded-lg">

                                        <p className="text-gray-500 text-sm">

                                            P1 Win Rate

                                        </p>

                                        <p className="text-2xl font-bold text-blue-600">

                                            {
                                                result.statistics
                                                    .player1_win_rate
                                            }%

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* =========================================
                                SCORE COMPARISON
                            ========================================= */}

                            <div className="bg-white rounded-xl shadow p-6 mb-6">

                                <h2 className="text-xl font-bold mb-5">

                                    Score Comparison

                                </h2>

                                <div className="grid grid-cols-2 gap-6">

                                    <div className="text-center">

                                        <p className="text-gray-500">

                                            {
                                                result.players.player1
                                                    .username
                                            }

                                        </p>

                                        <p className="text-4xl font-bold text-blue-600">

                                            {
                                                result.statistics
                                                    .player1_score
                                            }

                                        </p>

                                    </div>

                                    <div className="text-center">

                                        <p className="text-gray-500">

                                            {
                                                result.players.player2
                                                    .username
                                            }

                                        </p>

                                        <p className="text-4xl font-bold text-purple-600">

                                            {
                                                result.statistics
                                                    .player2_score
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* =========================================
                                H2H STREAK
                            ========================================= */}

                            <div className="bg-white rounded-xl shadow p-6 mb-6">

                                <h2 className="text-xl font-bold mb-4">

                                    🔥 Current H2H Streak

                                </h2>

                                {result.streak.type === "none" ? (

                                    <p className="text-gray-500">

                                        No current streak.

                                    </p>

                                ) : (

                                    <div className="flex items-center gap-4">

                                        <span className="text-4xl">

                                            🔥

                                        </span>

                                        <div>

                                            <p className="text-2xl font-bold">

                                                {
                                                    result.streak.count
                                                }{" "}

                                                {
                                                    result.streak.type ===
                                                        "player1"
                                                        ? result.players.player1.username
                                                        : result.players.player2.username
                                                }

                                            </p>

                                            <p className="text-gray-500">

                                                consecutive wins

                                            </p>

                                        </div>

                                    </div>

                                )}

                            </div>

                            {/* =========================================
                                LAST 5 MATCHES
                            ========================================= */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <h2 className="text-xl font-bold mb-5">

                                    Last 5 Matches

                                </h2>

                                {result.last_five_matches.length ===
                                    0 ? (

                                    <p className="text-gray-500">

                                        No matches played yet.

                                    </p>

                                ) : (

                                    <div className="space-y-3">

                                        {result.last_five_matches.map(
                                            (match) => (

                                                <div
                                                    key={match.id}
                                                    className="flex items-center justify-between border rounded-lg p-4"
                                                >

                                                    <div>

                                                        <p className="font-semibold">

                                                            {
                                                                match.player1_score
                                                            }

                                                            {" - "}

                                                            {
                                                                match.player2_score
                                                            }

                                                        </p>

                                                        <p className="text-sm text-gray-500">

                                                            {
                                                                match.created_at
                                                                    ? new Date(
                                                                        match.created_at
                                                                    ).toLocaleDateString()
                                                                    : "Unknown date"
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        {match.result_for_player1 ===
                                                            "win" ? (

                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                                                                Player 1 Won

                                                            </span>

                                                        ) : match.result_for_player1 ===
                                                            "loss" ? (

                                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">

                                                                Player 2 Won

                                                            </span>

                                                        ) : (

                                                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">

                                                                Draw

                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}