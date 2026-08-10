import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getMyTeams
} from "../../services/teamService";

export default function MyTeams() {

    const [teams, setTeams] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadTeams();

    }, []);

    async function loadTeams() {

        try {

            const response =
                await getMyTeams();

            setTeams(
                response.data.teams || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load teams."
            );

        } finally {

            setLoading(false);

        }
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">
                    Loading teams...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h1 className="text-3xl font-bold">
                                My Teams
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Manage your Foosball teams.
                            </p>

                        </div>

                        <Link
                            to="/teams/create"
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
                        >
                            + Create Team
                        </Link>

                    </div>

                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                            {error}
                        </div>

                    )}

                    {teams.length === 0 ? (

                        <div className="bg-white rounded-xl shadow p-8 text-center">

                            <h2 className="text-xl font-semibold">
                                No teams yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create your first Foosball team.
                            </p>

                            <Link
                                to="/teams/create"
                                className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
                            >
                                Create Team
                            </Link>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {teams.map((team) => (

                                <div
                                    key={team.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >

                                    <h2 className="text-xl font-bold">
                                        {team.name}
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        {team.city || "No city"}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-4">
                                        {team.description ||
                                            "No description"}
                                    </p>

                                    <div className="flex justify-between items-center mt-5">

                                        <span className="text-sm text-gray-500">
                                            {team.member_count} members
                                        </span>

                                        <span className="text-sm font-semibold">
                                            {team.role}
                                        </span>

                                    </div>

                                    <Link
                                        to={`/teams/${team.id}`}
                                        className="block text-center bg-gray-900 text-white py-2 rounded-lg mt-5"
                                    >
                                        View Team
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