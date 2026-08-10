import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    leaderboard
} from "../../services/playerService";

export default function Leaderboard() {

    const [players, setPlayers] = useState([]);

    const [search, setSearch] = useState("");

    const [tier, setTier] = useState("");

    const [sort, setSort] = useState("elo");

    const [order, setOrder] = useState("desc");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD LEADERBOARD
    // =====================================================

    useEffect(() => {

        loadLeaderboard();

    }, [tier, sort, order]);

    async function loadLeaderboard(
        searchValue = search
    ) {

        try {

            setLoading(true);
            setError("");

            const response = await leaderboard({

                search: searchValue,

                tier: tier,

                sort: sort,

                order: order

            });

            setPlayers(
                response.data.players || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load leaderboard"
            );

        } finally {

            setLoading(false);

        }
    }

    // =====================================================
    // SEARCH
    // =====================================================

    function handleSearch(e) {

        e.preventDefault();

        loadLeaderboard(search);

    }

    // =====================================================
    // RESET FILTERS
    // =====================================================

    function resetFilters() {

        setSearch("");

        setTier("");

        setSort("elo");

        setOrder("desc");

    }

    // =====================================================
    // RANK STYLE
    // =====================================================

    function getRankStyle(rank) {

        if (rank === 1) {

            return "bg-yellow-100 text-yellow-700";

        }

        if (rank === 2) {

            return "bg-gray-200 text-gray-700";

        }

        if (rank === 3) {

            return "bg-orange-100 text-orange-700";

        }

        return "bg-gray-100 text-gray-600";
    }

    // =====================================================
    // TIER STYLE
    // =====================================================

    function getTierStyle(tierName) {

        switch (
        tierName?.toLowerCase()
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

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        Loading leaderboard...

                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto p-6">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-6">

                        <h1 className="text-3xl font-bold">

                            Foosball Leaderboard

                        </h1>

                        <p className="text-gray-500 mt-1">

                            Global player rankings based on Elo rating

                        </p>

                    </div>

                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow p-5 mb-6">

                        <form
                            onSubmit={handleSearch}
                            className="grid md:grid-cols-4 gap-4"
                        >

                            {/* Search */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium mb-2">

                                    Search Player

                                </label>

                                <input
                                    type="text"
                                    placeholder="Name, username or city..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                                />

                            </div>

                            {/* Tier */}

                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Ranking Tier

                                </label>

                                <select
                                    value={tier}
                                    onChange={(e) =>
                                        setTier(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                >

                                    <option value="">
                                        All Tiers
                                    </option>

                                    <option value="bronze">
                                        Bronze
                                    </option>

                                    <option value="silver">
                                        Silver
                                    </option>

                                    <option value="gold">
                                        Gold
                                    </option>

                                    <option value="platinum">
                                        Platinum
                                    </option>

                                    <option value="diamond">
                                        Diamond
                                    </option>

                                </select>

                            </div>

                            {/* Sort */}

                            <div>

                                <label className="block text-sm font-medium mb-2">

                                    Sort By

                                </label>

                                <select
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                >

                                    <option value="elo">
                                        Elo Rating
                                    </option>

                                    <option value="wins">
                                        Wins
                                    </option>

                                    <option value="win_rate">
                                        Win Rate
                                    </option>

                                    <option value="matches">
                                        Matches
                                    </option>

                                    <option value="streak">
                                        Streak
                                    </option>

                                </select>

                            </div>

                            {/* Buttons */}

                            <div className="md:col-span-4 flex flex-wrap gap-3">

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                                >
                                    Search
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                                >
                                    Reset
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOrder(
                                            order === "desc"
                                                ? "asc"
                                                : "desc"
                                        )
                                    }
                                    className="border px-6 py-3 rounded-lg font-semibold"
                                >
                                    {order === "desc"
                                        ? "Highest → Lowest"
                                        : "Lowest → Highest"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

                            {error}

                        </div>

                    )}

                    {/* =================================================
                        RESULT COUNT
                    ================================================= */}

                    <div className="mb-4 text-gray-600">

                        Showing{" "}

                        <strong>
                            {players.length}
                        </strong>

                        {" "}players

                    </div>

                    {/* =================================================
                        LEADERBOARD
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="text-left p-4">
                                            Rank
                                        </th>

                                        <th className="text-left p-4">
                                            Player
                                        </th>

                                        <th className="text-left p-4">
                                            Tier
                                        </th>

                                        <th className="text-left p-4">
                                            Elo
                                        </th>

                                        <th className="text-left p-4">
                                            Matches
                                        </th>

                                        <th className="text-left p-4">
                                            Wins
                                        </th>

                                        <th className="text-left p-4">
                                            Losses
                                        </th>

                                        <th className="text-left p-4">
                                            Win Rate
                                        </th>

                                        <th className="text-left p-4">
                                            Streak
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {players.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="p-8 text-center text-gray-500"
                                            >

                                                No players found.

                                            </td>

                                        </tr>

                                    ) : (

                                        players.map(
                                            (player) => (

                                                <tr
                                                    key={player.id}
                                                    className="border-t hover:bg-gray-50"
                                                >

                                                    {/* Rank */}

                                                    <td className="p-4">

                                                        <span
                                                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getRankStyle(player.rank)}`}
                                                        >

                                                            {player.rank}

                                                        </span>

                                                    </td>

                                                    {/* Player */}

                                                    <td className="p-4">

                                                        <div>

                                                            <p className="font-semibold">

                                                                {player.full_name}

                                                            </p>

                                                            <p className="text-sm text-gray-500">

                                                                @{player.username}

                                                            </p>

                                                            {player.city && (

                                                                <p className="text-xs text-gray-400">

                                                                    {player.city}

                                                                </p>

                                                            )}

                                                        </div>

                                                    </td>

                                                    {/* Tier */}

                                                    <td className="p-4">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierStyle(player.tier)}`}
                                                        >

                                                            {player.tier}

                                                        </span>

                                                    </td>

                                                    {/* Elo */}

                                                    <td className="p-4">

                                                        <span className="font-bold text-lg">

                                                            {player.elo_rating}

                                                        </span>

                                                    </td>

                                                    {/* Matches */}

                                                    <td className="p-4">

                                                        {player.matches_played}

                                                    </td>

                                                    {/* Wins */}

                                                    <td className="p-4 text-green-600 font-semibold">

                                                        {player.wins}

                                                    </td>

                                                    {/* Losses */}

                                                    <td className="p-4 text-red-600 font-semibold">

                                                        {player.losses}

                                                    </td>

                                                    {/* Win Rate */}

                                                    <td className="p-4">

                                                        <span className="font-semibold">

                                                            {player.win_rate}%

                                                        </span>

                                                    </td>

                                                    {/* Streak */}

                                                    <td className="p-4">

                                                        {player.streak_type === "win" ? (

                                                            <span className="text-orange-600 font-semibold">

                                                                🔥 {player.streak_count}W

                                                            </span>

                                                        ) : player.streak_type === "loss" ? (

                                                            <span className="text-red-600 font-semibold">

                                                                {player.streak_count}L

                                                            </span>

                                                        ) : (

                                                            <span className="text-gray-400">

                                                                —

                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
}