import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getMyStatistics,
    getWinLossStatistics,
    getEloHistory,
    getMatchStatistics
} from "../../services/statisticsService";

import {
    getProfile,
    getPlayerRanking
} from "../../services/playerService";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";


export default function Statistics() {

    const [statistics, setStatistics] = useState(null);

    const [winLoss, setWinLoss] = useState([]);

    const [eloHistory, setEloHistory] = useState([]);

    const [matches, setMatches] = useState([]);

    const [ranking, setRanking] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    useEffect(() => {

        loadStatistics();

    }, []);


    async function loadStatistics() {

        try {

            setLoading(true);

            setError("");


            // =================================================
            // LOAD MAIN STATISTICS
            // =================================================

            const [
                statsResponse,
                winLossResponse,
                eloResponse,
                matchesResponse
            ] = await Promise.all([

                getMyStatistics(),

                getWinLossStatistics(),

                getEloHistory(),

                getMatchStatistics()

            ]);


            // =================================================
            // MAIN STATISTICS
            // =================================================

            setStatistics(
                statsResponse.data.statistics
            );


            // =================================================
            // WIN / LOSS
            // =================================================

            const winLossData =
                winLossResponse.data.data;


            setWinLoss([

                {
                    name: "Wins",
                    value: winLossData.wins || 0
                },

                {
                    name: "Losses",
                    value: winLossData.losses || 0
                },

                {
                    name: "Draws",
                    value: winLossData.draws || 0
                }

            ]);


            // =================================================
            // ELO HISTORY
            // =================================================

            setEloHistory(
                eloResponse.data.history || []
            );


            // =================================================
            // MATCHES
            // =================================================

            setMatches(
                matchesResponse.data.matches || []
            );


            // =================================================
            // RANKING
            // =================================================

            try {

                const profileResponse =
                    await getProfile();


                const player =
                    profileResponse.data.player;


                if (player?.id) {

                    const rankingResponse =
                        await getPlayerRanking(
                            player.id
                        );


                    setRanking(
                        rankingResponse.data.ranking
                    );

                }

            } catch (rankingError) {

                console.error(
                    "Unable to load ranking:",
                    rankingError
                );

                // Ranking fail hone par
                // complete statistics page fail nahi hoga.

                setRanking(null);

            }


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load statistics."
            );

        } finally {

            setLoading(false);

        }

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-gray-50 p-6">

                    <div className="max-w-7xl mx-auto">

                        <p className="text-gray-600">
                            Loading statistics...
                        </p>

                    </div>

                </main>
            </>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-gray-50 p-6">

                    <div className="max-w-7xl mx-auto">

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">

                            {error}

                        </div>

                    </div>

                </main>
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

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">

                            My Statistics

                        </h1>

                        <p className="text-gray-500 mt-1">

                            Track your Foosball performance.

                        </p>

                    </div>


                    {/* =================================================
                        RANKING SUMMARY
                    ================================================= */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">


                        {/* GLOBAL RANK */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Global Rank

                            </p>

                            <p className="text-3xl font-bold mt-2">

                                {ranking?.rank
                                    ? `#${ranking.rank}`
                                    : "—"}

                            </p>

                        </div>


                        {/* RANKING TIER */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Ranking Tier

                            </p>

                            <p className="text-3xl font-bold mt-2">

                                {ranking?.tier || "Bronze"}

                            </p>

                        </div>


                        {/* CURRENT STREAK */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Current Streak

                            </p>


                            {ranking?.streak_type === "win" ? (

                                <p className="text-3xl font-bold mt-2 text-orange-600">

                                    🔥 {ranking.streak_count || 0}W

                                </p>

                            ) : ranking?.streak_type === "loss" ? (

                                <p className="text-3xl font-bold mt-2 text-red-600">

                                    {ranking.streak_count || 0}L

                                </p>

                            ) : (

                                <p className="text-3xl font-bold mt-2">

                                    0

                                </p>

                            )}

                        </div>


                        {/* WIN RATE */}

                        <div className="bg-white rounded-xl shadow p-5">

                            <p className="text-sm text-gray-500">

                                Win Rate

                            </p>

                            <p className="text-3xl font-bold mt-2">

                                {ranking?.win_rate ??
                                    statistics?.win_rate ??
                                    0}%

                            </p>

                        </div>


                    </div>


                    {/* =================================================
                        RANKING DETAIL
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow p-6 mb-8">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                            <div>

                                <p className="text-sm text-gray-500">

                                    Current Ranking

                                </p>

                                <h2 className="text-2xl font-bold mt-1">

                                    {ranking?.tier || "Bronze"}

                                </h2>

                                <p className="text-gray-500 mt-1">

                                    Global Rank{" "}

                                    {ranking?.rank
                                        ? `#${ranking.rank}`
                                        : "—"}

                                </p>

                            </div>


                            <div className="text-left md:text-right">

                                <p className="text-sm text-gray-500">

                                    Current Elo

                                </p>

                                <p className="text-3xl font-bold">

                                    {ranking?.elo_rating ??
                                        statistics?.current_elo ??
                                        0}

                                </p>

                            </div>


                        </div>


                        {/* STREAK INFORMATION */}

                        <div className="mt-6 border-t pt-5">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Streak Status

                                    </p>

                                    {ranking?.streak_type === "win" ? (

                                        <p className="font-semibold text-orange-600">

                                            🔥 {ranking.streak_count || 0}
                                            consecutive wins

                                        </p>

                                    ) : ranking?.streak_type === "loss" ? (

                                        <p className="font-semibold text-red-600">

                                            {ranking.streak_count || 0}
                                            consecutive losses

                                        </p>

                                    ) : (

                                        <p className="font-semibold text-gray-600">

                                            No active streak

                                        </p>

                                    )}

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">

                                        Matches Played

                                    </p>

                                    <p className="font-semibold">

                                        {ranking?.matches_played ??
                                            statistics?.total_matches ??
                                            0}

                                    </p>

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">

                                        Wins

                                    </p>

                                    <p className="font-semibold text-green-600">

                                        {ranking?.wins ??
                                            statistics?.wins ??
                                            0}

                                    </p>

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">

                                        Losses

                                    </p>

                                    <p className="font-semibold text-red-600">

                                        {ranking?.losses ??
                                            statistics?.losses ??
                                            0}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">


                        <StatCard
                            title="Current Elo"
                            value={
                                statistics.current_elo
                            }
                        />


                        <StatCard
                            title="Total Matches"
                            value={
                                statistics.total_matches
                            }
                        />


                        <StatCard
                            title="Wins"
                            value={
                                statistics.wins
                            }
                        />


                        <StatCard
                            title="Losses"
                            value={
                                statistics.losses
                            }
                        />


                        <StatCard
                            title="Win Rate"
                            value={
                                `${statistics.win_rate}%`
                            }
                        />


                        <StatCard
                            title="Draws"
                            value={
                                statistics.draws
                            }
                        />


                        <StatCard
                            title="Tournaments"
                            value={
                                statistics.tournaments_played
                            }
                        />


                        <StatCard
                            title="Tournament Wins"
                            value={
                                statistics.tournaments_won
                            }
                        />

                    </div>


                    {/* =================================================
                        CHARTS
                    ================================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


                        {/* =================================================
                            WIN LOSS
                        ================================================= */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-bold mb-5">

                                Win / Loss

                            </h2>


                            <div className="h-[320px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={winLoss}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >

                                            {winLoss.map(
                                                (entry, index) => (

                                                    <Cell
                                                        key={`cell-${index}`}
                                                    />

                                                )
                                            )}

                                        </Pie>


                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        {/* =================================================
                            ELO HISTORY
                        ================================================= */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-bold mb-5">

                                Elo Progress

                            </h2>


                            <div className="h-[320px]">

                                {eloHistory.length === 0 ? (

                                    <div className="h-full flex items-center justify-center text-gray-500">

                                        No Elo history available.

                                    </div>

                                ) : (

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <LineChart
                                            data={eloHistory}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="match_id"
                                            />

                                            <YAxis />

                                            <Tooltip />


                                            <Line
                                                type="monotone"
                                                dataKey="elo"
                                                strokeWidth={3}
                                            />

                                        </LineChart>

                                    </ResponsiveContainer>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PERFORMANCE SUMMARY
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow p-6 mb-8">

                        <h2 className="text-xl font-bold mb-5">

                            Performance Summary

                        </h2>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                            <div className="border rounded-xl p-5">

                                <p className="text-gray-500">

                                    Current Elo

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {statistics.current_elo}

                                </p>

                            </div>


                            <div className="border rounded-xl p-5">

                                <p className="text-gray-500">

                                    Win Rate

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {statistics.win_rate}%

                                </p>

                            </div>


                            <div className="border rounded-xl p-5">

                                <p className="text-gray-500">

                                    Tournament Wins

                                </p>

                                <p className="text-3xl font-bold mt-2">

                                    {statistics.tournaments_won}

                                </p>

                            </div>


                        </div>

                    </div>


                    {/* =================================================
                        MATCH HISTORY
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-xl font-bold mb-5">

                            Recent Matches

                        </h2>


                        {matches.length === 0 ? (

                            <p className="text-gray-500">

                                No matches played yet.

                            </p>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b text-left">

                                            <th className="p-3">
                                                Opponent
                                            </th>

                                            <th className="p-3">
                                                Score
                                            </th>

                                            <th className="p-3">
                                                Result
                                            </th>

                                            <th className="p-3">
                                                Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {matches
                                            .slice(0, 10)
                                            .map(
                                                (match) => (

                                                    <tr
                                                        key={
                                                            match.match_id
                                                        }
                                                        className="border-b"
                                                    >

                                                        <td className="p-3">

                                                            {
                                                                match.opponent?.full_name ||
                                                                match.opponent?.username ||
                                                                "Unknown"
                                                            }

                                                        </td>


                                                        <td className="p-3">

                                                            {
                                                                match.player_score
                                                            }

                                                            {" - "}

                                                            {
                                                                match.opponent_score
                                                            }

                                                        </td>


                                                        <td className="p-3">

                                                            <span
                                                                className={`px-3 py-1 rounded-full text-sm ${
                                                                    match.result ===
                                                                    "win"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : match.result ===
                                                                          "loss"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-gray-100 text-gray-700"
                                                                }`}
                                                            >

                                                                {
                                                                    match.result
                                                                }

                                                            </span>

                                                        </td>


                                                        <td className="p-3 text-gray-500">

                                                            {
                                                                match.date
                                                                    ? new Date(
                                                                          match.date
                                                                      ).toLocaleDateString()
                                                                    : "-"
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>


                </div>

            </main>

        </>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    title,
    value
}) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500 text-sm">

                {title}

            </p>

            <p className="text-3xl font-bold mt-2">

                {value}

            </p>

        </div>

    );

}

