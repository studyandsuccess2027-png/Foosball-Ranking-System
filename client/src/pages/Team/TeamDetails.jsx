import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getTeam,
    addTeamMember,
    removeTeamMember,
    leaveTeam,
    deleteTeam
} from "../../services/teamService";

import {
    searchPlayers
} from "../../services/playerService";

export default function TeamDetails() {

    const { teamId } = useParams();

    const navigate = useNavigate();

    const [team, setTeam] = useState(null);

    const [players, setPlayers] = useState([]);

    const [selectedPlayer, setSelectedPlayer] =
        useState("");

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {

        loadTeam();

        loadPlayers();

    }, [teamId]);

    async function loadTeam() {

        try {

            const response =
                await getTeam(teamId);

            setTeam(
                response.data.team
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load team."
            );

        } finally {

            setLoading(false);

        }
    }

    async function loadPlayers() {

        try {

            const response =
                await searchPlayers("");

            setPlayers(
                response.data.players || []
            );

        } catch (error) {

            console.error(error);

        }
    }

    async function handleAddMember() {

        if (!selectedPlayer) {

            setError(
                "Please select a player."
            );

            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setMessage("");

            await addTeamMember(
                teamId,
                selectedPlayer
            );

            setSelectedPlayer("");

            setMessage(
                "Player added successfully."
            );

            await loadTeam();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to add player."
            );

        } finally {

            setActionLoading(false);

        }
    }

    async function handleRemoveMember(
        playerId
    ) {

        if (
            !window.confirm(
                "Remove this player from the team?"
            )
        ) {

            return;
        }

        try {

            setActionLoading(true);

            await removeTeamMember(
                teamId,
                playerId
            );

            await loadTeam();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to remove player."
            );

        } finally {

            setActionLoading(false);

        }
    }

    async function handleLeaveTeam() {

        if (
            !window.confirm(
                "Are you sure you want to leave this team?"
            )
        ) {

            return;
        }

        try {

            setActionLoading(true);

            await leaveTeam(teamId);

            navigate("/teams");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to leave team."
            );

        } finally {

            setActionLoading(false);

        }
    }

    async function handleDeleteTeam() {

        if (
            !window.confirm(
                "Delete this team permanently?"
            )
        ) {

            return;
        }

        try {

            setActionLoading(true);

            await deleteTeam(teamId);

            navigate("/teams");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete team."
            );

        } finally {

            setActionLoading(false);

        }
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">
                    Loading team...
                </div>
            </>
        );
    }

    if (!team) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">
                    Team not found.
                </div>
            </>
        );
    }

    const teamPlayerIds =
        team.members.map(
            (member) => member.player_id
        );

    const availablePlayers =
        players.filter(
            (player) =>
                !teamPlayerIds.includes(player.id)
        );

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    {/* Team Header */}

                    <div className="bg-white rounded-2xl shadow p-6 mb-6">

                        <div className="flex flex-col md:flex-row md:justify-between gap-4">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    {team.name}
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    {team.city || "No city"}
                                </p>

                                <p className="text-gray-600 mt-4">
                                    {team.description ||
                                        "No description"}
                                </p>

                            </div>

                            <div className="text-right">

                                <p className="text-sm text-gray-500">
                                    Members
                                </p>

                                <p className="text-4xl font-bold">
                                    {team.member_count}
                                </p>

                            </div>

                        </div>

                    </div>

                    {error && (

                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                            {error}
                        </div>

                    )}

                    {message && (

                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">
                            {message}
                        </div>

                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Members */}

                        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">

                            <h2 className="text-xl font-bold mb-5">
                                Team Members
                            </h2>

                            <div className="space-y-3">

                                {team.members.map(
                                    (member) => (

                                        <div
                                            key={member.id}
                                            className="border rounded-lg p-4 flex justify-between items-center"
                                        >

                                            <div>

                                                <p className="font-semibold">
                                                    {member.player.full_name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    @{member.player.username}
                                                </p>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                                                    {member.role}
                                                </span>

                                                {member.role !==
                                                    "owner" && (

                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() =>
                                                            handleRemoveMember(
                                                                member.player_id
                                                            )
                                                        }
                                                        className="text-red-600 text-sm font-semibold"
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        {/* Management */}

                        <div className="space-y-6">

                            {/* Add Member */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <h2 className="text-lg font-bold mb-4">
                                    Add Player
                                </h2>

                                <select
                                    value={selectedPlayer}
                                    onChange={(e) =>
                                        setSelectedPlayer(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-lg p-3"
                                >

                                    <option value="">
                                        Select player
                                    </option>

                                    {availablePlayers.map(
                                        (player) => (

                                            <option
                                                key={player.id}
                                                value={player.id}
                                            >
                                                {player.full_name}
                                                {" "}
                                                (@{player.username})
                                            </option>

                                        )
                                    )}

                                </select>

                                <button
                                    disabled={actionLoading}
                                    onClick={handleAddMember}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 font-semibold disabled:opacity-50"
                                >
                                    Add Player
                                </button>

                            </div>

                            {/* Team Actions */}

                            <div className="bg-white rounded-xl shadow p-6">

                                <h2 className="text-lg font-bold mb-4">
                                    Team Actions
                                </h2>

                                <button
                                    disabled={actionLoading}
                                    onClick={handleLeaveTeam}
                                    className="w-full border border-red-500 text-red-600 py-3 rounded-lg font-semibold"
                                >
                                    Leave Team
                                </button>

                                <button
                                    disabled={actionLoading}
                                    onClick={handleDeleteTeam}
                                    className="w-full bg-red-600 text-white py-3 rounded-lg mt-3 font-semibold"
                                >
                                    Delete Team
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
}