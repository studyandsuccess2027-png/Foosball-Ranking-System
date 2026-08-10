import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminMatches,
    deleteAdminMatch
} from "../../services/adminService";


export default function AdminMatches() {

    const [matches, setMatches] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadMatches();

    }, []);


    async function loadMatches() {

        try {

            const response =
                await getAdminMatches();

            setMatches(
                response.data.matches || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load matches."
            );

        } finally {

            setLoading(false);

        }

    }


    async function handleDelete(matchId) {

        const confirmed =
            window.confirm(
                "Delete this match?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminMatch(matchId);

            setMatches(
                previous =>
                    previous.filter(
                        match =>
                            match.id !== matchId
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete match."
            );

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
                            Manage Matches
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
                                Loading matches...
                            </div>

                        ) : matches.length === 0 ? (

                            <div className="p-6 text-gray-500">
                                No matches found.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="bg-gray-50 border-b text-left">

                                            <th className="p-4">
                                                Match
                                            </th>

                                            <th className="p-4">
                                                Player 1
                                            </th>

                                            <th className="p-4">
                                                Player 2
                                            </th>

                                            <th className="p-4">
                                                Score
                                            </th>

                                            <th className="p-4">
                                                Winner
                                            </th>

                                            <th className="p-4">
                                                Status
                                            </th>

                                            <th className="p-4">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {matches.map(
                                            match => (

                                                <tr
                                                    key={match.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-4 font-medium">
                                                        #{match.id}
                                                    </td>

                                                    <td className="p-4">
                                                        #{match.player1_id}
                                                    </td>

                                                    <td className="p-4">
                                                        #{match.player2_id}
                                                    </td>

                                                    <td className="p-4 font-bold">

                                                        {match.player1_score}
                                                        {" - "}
                                                        {match.player2_score}

                                                    </td>

                                                    <td className="p-4">
                                                        {match.winner_id
                                                            ? `#${match.winner_id}`
                                                            : "Draw"}
                                                    </td>

                                                    <td className="p-4">
                                                        {match.status}
                                                    </td>

                                                    <td className="p-4">

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    match.id
                                                                )
                                                            }
                                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                                                        >
                                                            Delete
                                                        </button>

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