import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminPlayers,
    deleteAdminPlayer
} from "../../services/adminService";


export default function AdminPlayers() {

    const [players, setPlayers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadPlayers();

    }, []);


    async function loadPlayers() {

        try {

            const response =
                await getAdminPlayers();

            setPlayers(
                response.data.players || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load players."
            );

        } finally {

            setLoading(false);

        }

    }


    async function handleDelete(
        playerId
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this player?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminPlayer(
                playerId
            );

            setPlayers(
                previous =>
                    previous.filter(
                        player =>
                            player.id !== playerId
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete player."
            );

        }

    }


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-7xl mx-auto">

                    <h1 className="text-3xl font-bold mb-6">
                        Manage Players
                    </h1>


                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">

                            {error}

                        </div>

                    )}


                    <div className="bg-white rounded-2xl shadow overflow-hidden">

                        {loading ? (

                            <div className="p-6">
                                Loading players...
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b bg-gray-50 text-left">

                                            <th className="p-4">
                                                ID
                                            </th>

                                            <th className="p-4">
                                                Player
                                            </th>

                                            <th className="p-4">
                                                Username
                                            </th>

                                            <th className="p-4">
                                                Elo
                                            </th>

                                            <th className="p-4">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {players.map(
                                            (player) => (

                                                <tr
                                                    key={player.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-4">
                                                        #{player.id}
                                                    </td>

                                                    <td className="p-4 font-semibold">

                                                        {player.full_name ||
                                                            "N/A"}

                                                    </td>

                                                    <td className="p-4">

                                                        @{player.username}

                                                    </td>

                                                    <td className="p-4 font-bold">

                                                        {player.elo_rating}

                                                    </td>

                                                    <td className="p-4">

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    player.id
                                                                )
                                                            }
                                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
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