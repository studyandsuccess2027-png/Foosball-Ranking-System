import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getTournaments
} from "../../services/tournamentService";

export default function Tournaments() {

    const [tournaments, setTournaments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadTournaments();
    }, []);

    async function loadTournaments() {

        try {

            const response =
                await getTournaments();

            setTournaments(
                response.data.tournaments || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load tournaments."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    <div className="flex justify-between items-center mb-8">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Tournaments
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Compete, win matches and climb the rankings.
                            </p>

                        </div>

                        <Link
                            to="/tournaments/create"
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
                        >
                            + Create Tournament
                        </Link>

                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {loading ? (

                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            Loading tournaments...
                        </div>

                    ) : tournaments.length === 0 ? (

                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <h2 className="text-xl font-semibold">
                                No tournaments found
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create the first tournament.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {tournaments.map((tournament) => (

                                <div
                                    key={tournament.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >

                                    <div className="flex justify-between items-start">

                                        <h2 className="text-xl font-bold">
                                            {tournament.name}
                                        </h2>

                                        <span
                                            className={`text-xs px-3 py-1 rounded-full ${
                                                tournament.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {tournament.status}
                                        </span>

                                    </div>

                                    <p className="text-gray-500 mt-2">
                                        {tournament.city ||
                                            "Location not specified"}
                                    </p>

                                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                                        {tournament.description ||
                                            "No description available."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mt-5">

                                        <div className="bg-gray-50 rounded-lg p-3">

                                            <p className="text-xs text-gray-500">
                                                Format
                                            </p>

                                            <p className="font-semibold text-sm mt-1">
                                                {tournament.format ===
                                                "single_elimination"
                                                    ? "Knockout"
                                                    : "Round Robin"}
                                            </p>

                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3">

                                            <p className="text-xs text-gray-500">
                                                Max Players
                                            </p>

                                            <p className="font-semibold mt-1">
                                                {tournament.max_participants}
                                            </p>

                                        </div>

                                    </div>

                                    <Link
                                        to={`/tournaments/${tournament.id}`}
                                        className="block text-center bg-gray-900 text-white py-3 rounded-lg mt-5 font-semibold"
                                    >
                                        View Tournament
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}