import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminDashboard,
    getAdminPlayers,
    getAdminMatches,
    getAdminTournaments
} from "../../services/adminService";


export default function AdminDashboard() {

    const [stats, setStats] = useState(null);

    const [players, setPlayers] = useState([]);

    const [matches, setMatches] = useState([]);

    const [tournaments, setTournaments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadAdminData();

    }, []);


    async function loadAdminData() {

        try {

            setLoading(true);

            const [
                dashboardResponse,
                playersResponse,
                matchesResponse,
                tournamentsResponse
            ] = await Promise.all([

                getAdminDashboard(),

                getAdminPlayers(),

                getAdminMatches(),

                getAdminTournaments()

            ]);


            setStats(
                dashboardResponse.data.statistics
            );

            setPlayers(
                playersResponse.data.players || []
            );

            setMatches(
                matchesResponse.data.matches || []
            );

            setTournaments(
                tournamentsResponse.data.tournaments || []
            );


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);

        }

    }


    if (loading) {

        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-gray-50 p-6">

                    Loading admin dashboard...

                </main>
            </>
        );

    }


    if (error) {

        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-gray-50 p-6">

                    <div className="max-w-7xl mx-auto">

                        <div className="bg-red-100 text-red-700 p-4 rounded-xl">

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


                    {/* HEADER */}

                    <div className="mb-8">

                        <p className="text-blue-600 font-semibold">
                            ADMIN PANEL
                        </p>

                        <h1 className="text-3xl font-bold mt-1">
                            Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage your Foosball Ranking System.
                        </p>

                    </div>


                    {/* STATISTICS */}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-8">


                        <AdminCard
                            title="Users"
                            value={stats.total_users}
                        />


                        <AdminCard
                            title="Players"
                            value={stats.total_players}
                        />


                        <AdminCard
                            title="Teams"
                            value={stats.total_teams}
                        />


                        <AdminCard
                            title="Matches"
                            value={stats.total_matches}
                        />


                        <AdminCard
                            title="Tournaments"
                            value={stats.total_tournaments}
                        />

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="grid md:grid-cols-4 gap-5 mb-8">


                        <AdminAction
                            title="Manage Players"
                            link="/admin/players"
                        />


                        <AdminAction
                            title="Manage Teams"
                            link="/admin/teams"
                        />


                        <AdminAction
                            title="Manage Matches"
                            link="/admin/matches"
                        />


                        <AdminAction
                            title="Manage Tournaments"
                            link="/admin/tournaments"
                        />

                    </div>


                    {/* PLAYERS */}

                    <div className="bg-white rounded-2xl shadow p-6 mb-8">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="text-xl font-bold">
                                Top Players
                            </h2>

                            <a
                                href="/admin/players"
                                className="text-blue-600 font-medium"
                            >
                                View All
                            </a>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b text-left">

                                        <th className="p-3">
                                            Player
                                        </th>

                                        <th className="p-3">
                                            Elo
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {players
                                        .slice(0, 5)
                                        .map(
                                            (player) => (

                                                <tr
                                                    key={player.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-3 font-medium">

                                                        {player.full_name ||
                                                            player.username}

                                                    </td>

                                                    <td className="p-3 font-bold">

                                                        {player.elo_rating}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* RECENT MATCHES */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-xl font-bold mb-5">

                            Recent Matches

                        </h2>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b text-left">

                                        <th className="p-3">
                                            Match ID
                                        </th>

                                        <th className="p-3">
                                            Player 1
                                        </th>

                                        <th className="p-3">
                                            Player 2
                                        </th>

                                        <th className="p-3">
                                            Score
                                        </th>

                                        <th className="p-3">
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {matches
                                        .slice(0, 10)
                                        .map(
                                            (match) => (

                                                <tr
                                                    key={match.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-3">
                                                        #{match.id}
                                                    </td>

                                                    <td className="p-3">
                                                        #{match.player1_id}
                                                    </td>

                                                    <td className="p-3">
                                                        #{match.player2_id}
                                                    </td>

                                                    <td className="p-3 font-bold">

                                                        {match.player1_score}
                                                        {" - "}
                                                        {match.player2_score}

                                                    </td>

                                                    <td className="p-3">

                                                        {match.status}

                                                    </td>

                                                </tr>

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


/* =====================================================
   ADMIN CARD
===================================================== */

function AdminCard({
    title,
    value
}) {

    return (

        <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500 text-sm">
                {title}
            </p>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

        </div>

    );
}


/* =====================================================
   ADMIN ACTION
===================================================== */

function AdminAction({
    title,
    link
}) {

    return (

        <a
            href={link}
            className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
        >

            <p className="font-semibold">
                {title}
            </p>

            <p className="text-blue-600 text-sm mt-2">
                Open →
            </p>

        </a>

    );
}