import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminTeams
} from "../../services/adminService";


export default function AdminTeams() {

    const [teams, setTeams] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadTeams();

    }, []);


    async function loadTeams() {

        try {

            const response =
                await getAdminTeams();

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


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-7xl mx-auto">

                    <div className="mb-6">

                        <p className="text-blue-600 font-semibold">
                            ADMIN PANEL
                        </p>

                        <h1 className="text-3xl font-bold">
                            Manage Teams
                        </h1>

                    </div>


                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5">

                            {error}

                        </div>

                    )}


                    <div className="bg-white rounded-2xl shadow overflow-hidden">

                        {loading ? (

                            <div className="p-6">
                                Loading teams...
                            </div>

                        ) : teams.length === 0 ? (

                            <div className="p-6 text-gray-500">
                                No teams found.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="bg-gray-50 border-b text-left">

                                            <th className="p-4">
                                                ID
                                            </th>

                                            <th className="p-4">
                                                Team Name
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {teams.map(
                                            team => (

                                                <tr
                                                    key={team.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-4">
                                                        #{team.id}
                                                    </td>

                                                    <td className="p-4 font-semibold">
                                                        {team.name}
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