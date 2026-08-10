import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import StatsCard from "../../components/StatsCard";
import EloRatingCard from "../../components/EloRatingCard";

import {
    getProfile,
    getMyMatches,
    getPlayerRanking
} from "../../services/playerService";

export default function Dashboard() {

    const [player, setPlayer] = useState(null);

    const [ranking, setRanking] = useState(null);

    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            setLoading(true);

            setError("");

            // -------------------------------------------------
            // Profile
            // -------------------------------------------------

            const profileResponse =
                await getProfile();

            const profile =
                profileResponse.data.player;

            setPlayer(profile);

            // -------------------------------------------------
            // Ranking
            // -------------------------------------------------

            if (profile?.id) {

                try {

                    const rankingResponse =
                        await getPlayerRanking(
                            profile.id
                        );

                    setRanking(
                        rankingResponse.data.ranking
                    );

                } catch (rankingError) {

                    console.error(
                        "Ranking error:",
                        rankingError
                    );

                }

            }

            // -------------------------------------------------
            // Matches
            // -------------------------------------------------

            const matchesResponse =
                await getMyMatches();

            setMatches(
                matchesResponse.data.matches || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard"
            );

        } finally {

            setLoading(false);

        }

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

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">

                    <p>
                        Loading dashboard...
                    </p>

                </div>
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

                <div className="max-w-6xl mx-auto p-6">

                    <div className="bg-red-100 text-red-700 p-4 rounded-lg">

                        {error}

                    </div>

                </div>
            </>
        );
    }

    // =====================================================
    // NO PROFILE
    // =====================================================

    if (!player) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">

                    <h1 className="text-2xl font-bold">

                        Create your player profile first.

                    </h1>

                </div>
            </>
        );
    }

    // =====================================================
    // WIN RATE
    // =====================================================

    const winRate =
        player.matches_played > 0
            ? (
                (player.wins /
                    player.matches_played) *
                100
            ).toFixed(1)
            : 0;

    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-6xl mx-auto p-6">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">

                            Welcome, {player.full_name}

                        </h1>

                        <p className="text-gray-500 mt-1">

                            Track your Foosball performance
                            and ranking.

                        </p>

                    </div>

                    {/* =================================================
                        RANKING SUMMARY
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                        {/* Rank */}

                        <div className="bg-white rounded-xl shadow-md p-6">

                            <p className="text-sm text-gray-500">

                                Global Rank

                            </p>

                            <div className="flex items-center gap-3 mt-2">

                                <span className="text-4xl font-bold">

                                    {ranking?.rank
                                        ? `#${ranking.rank}`
                                        : "—"
                                    }

                                </span>

                                <span className="text-gray-400">

                                    worldwide

                                </span>

                            </div>

                        </div>

                        {/* Tier */}

                        <div className="bg-white rounded-xl shadow-md p-6">

                            <p className="text-sm text-gray-500">

                                Ranking Tier

                            </p>

                            <div className="mt-3">

                                <span
                                    className={`inline-block px-4 py-2 rounded-full font-bold ${getTierStyle(
                                        ranking?.tier
                                    )}`}
                                >

                                    {ranking?.tier || "Bronze"}

                                </span>

                            </div>

                        </div>

                        {/* Streak */}

                        <div className="bg-white rounded-xl shadow-md p-6">

                            <p className="text-sm text-gray-500">

                                Current Streak

                            </p>

                            <div className="mt-2">

                                {ranking?.streak_type ===
                                "win" ? (

                                    <div>

                                        <p className="text-3xl font-bold text-orange-600">

                                            🔥{" "}
                                            {
                                                ranking.streak_count
                                            }

                                        </p>

                                        <p className="text-sm text-gray-500">

                                            consecutive wins

                                        </p>

                                    </div>

                                ) : ranking?.streak_type ===
                                  "loss" ? (

                                    <div>

                                        <p className="text-3xl font-bold text-red-600">

                                            {
                                                ranking.streak_count
                                            }

                                        </p>

                                        <p className="text-sm text-gray-500">

                                            consecutive losses

                                        </p>

                                    </div>

                                ) : (

                                    <div>

                                        <p className="text-3xl font-bold">

                                            0

                                        </p>

                                        <p className="text-sm text-gray-500">

                                            No active streak

                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ELO
                    ================================================= */}

                    <div className="mb-6">

                        <EloRatingCard
                            player={player}
                        />

                    </div>

                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        <StatsCard
                            title="Elo Rating"
                            value={player.elo_rating}
                            subtitle="Current rating"
                        />

                        <StatsCard
                            title="Matches"
                            value={player.matches_played}
                            subtitle="Total matches"
                        />

                        <StatsCard
                            title="Wins"
                            value={player.wins}
                            subtitle="Matches won"
                        />

                        <StatsCard
                            title="Win Rate"
                            value={`${winRate}%`}
                            subtitle="Overall performance"
                        />

                    </div>

                    {/* =================================================
                        RECENT MATCHES
                    ================================================= */}

                    <div className="bg-white rounded-xl shadow-md mt-8 p-6">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-xl font-bold">

                                Recent Matches

                            </h2>

                            <span className="text-sm text-gray-500">

                                {matches.length} matches

                            </span>

                        </div>

                        {matches.length === 0 ? (

                            <p className="text-gray-500">

                                No matches played yet.

                            </p>

                        ) : (

                            <div className="space-y-3">

                                {matches
                                    .slice(0, 5)
                                    .map((match) => (

                                        <div
                                            key={match.id}
                                            className="border rounded-lg p-4"
                                        >

                                            <div className="flex justify-between">

                                                <div>

                                                    <p className="font-semibold">

                                                        Match #{match.id}

                                                    </p>

                                                    <p className="text-sm text-gray-500">

                                                        Player{" "}
                                                        {match.player1_id}

                                                        {" "}vs{" "}

                                                        Player{" "}
                                                        {match.player2_id}

                                                    </p>

                                                </div>

                                                <div className="font-bold">

                                                    {match.player1_score}

                                                    {" - "}

                                                    {match.player2_score}

                                                </div>

                                            </div>

                                        </div>

                                    ))
                                }

                            </div>

                        )}

                    </div>

                </div>

            </main>
        </>
    );
}