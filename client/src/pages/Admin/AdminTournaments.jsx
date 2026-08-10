import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminTournaments
} from "../../services/adminService";


export default function AdminTournaments() {

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
                await getAdminTournaments();

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

            <main className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-7xl mx-auto">

                    <div className="mb-6">

                        <p className="text-blue-600 font-semibold">
                            ADMIN PANEL
                        </p>

                        <h1 className="text-3xl font-bold">
                            Manage Tournaments
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
                                Loading tournaments...
                            </div>

                        ) : tournaments.length === 0 ? (

                            <div className="p-6 text-gray-500">
                                No tournaments found.
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
                                                Tournament
                                            </th>

                                            <th className="p-4">
                                                Format
                                            </th>

                                            <th className="p-4">
                                                Participants
                                            </th>

                                            <th className="p-4">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {tournaments.map(
                                            tournament => (

                                                <tr
                                                    key={tournament.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-4">
                                                        #{tournament.id}
                                                    </td>

                                                    <td className="p-4 font-semibold">
                                                        {tournament.name}
                                                    </td>

                                                    <td className="p-4">
                                                        {tournament.format}
                                                    </td>

                                                    <td className="p-4">
                                                        {tournament.max_participants}
                                                    </td>

                                                    <td className="p-4">

                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">

                                                            {tournament.status}

                                                        </span>

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