import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    getTournament,
    joinTournament,
    leaveTournament,
    startTournament,
    generateBracket,
    submitMatchResult,
    getStandings,
} from "../../services/tournamentService";

export default function TournamentDetails() {
    const { tournamentId } = useParams();

    const [tournament, setTournament] = useState(null);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadTournament();
    }, [tournamentId]);

    async function loadTournament() {
        try {
            setLoading(true);
            setError("");

            const response = await getTournament(tournamentId);
            setTournament(response.data.tournament);
            await loadStandings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load tournament."
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadStandings() {
        try {
            const response = await getStandings(tournamentId);
            setStandings(response.data.standings || []);
        } catch (error) {
            console.error(error);
        }
    }

    async function runAction(action, successMessage) {
        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            const response = await action();

            if (response?.data?.elo) {
                setMessage(
                    `${successMessage} Tournament Elo updated successfully.`
                );
            } else if (response?.data?.tournament_completed) {
                setMessage(
                    `${successMessage} Tournament completed.`
                );
            } else {
                setMessage(successMessage);
            }

            await loadTournament();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Action failed."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleSubmitResult(match) {
        const player1Score = window.prompt(
            `Score for ${
                match.player1?.full_name || "Player 1"
            }`
        );

        if (player1Score === null) return;

        const player2Score = window.prompt(
            `Score for ${
                match.player2?.full_name || "Player 2"
            }`
        );

        if (player2Score === null) return;

        const score1 = Number(player1Score);
        const score2 = Number(player2Score);

        if (
            !Number.isInteger(score1) ||
            !Number.isInteger(score2) ||
            score1 < 0 ||
            score2 < 0
        ) {
            setError("Please enter valid non-negative scores.");
            return;
        }

        if (score1 === score2) {
            setError(
                "Tournament elimination matches cannot be draws."
            );
            return;
        }

        await runAction(
            () =>
                submitMatchResult(match.id, {
                    player1_score: score1,
                    player2_score: score2,
                }),
            "Match result submitted."
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-6xl mx-auto p-6">
                    Loading tournament...
                </div>
            </>
        );
    }

    if (!tournament) {
        return (
            <>
                <Navbar />
                <div className="max-w-6xl mx-auto p-6">
                    Tournament not found.
                </div>
            </>
        );
    }

    const rounds = {};

    tournament.matches?.forEach((match) => {
        if (!rounds[match.round_number]) {
            rounds[match.round_number] = [];
        }
        rounds[match.round_number].push(match);
    });

    const sortedRounds = Object.entries(rounds).sort(
        ([a], [b]) => Number(a) - Number(b)
    );

    const isCompleted = tournament.status === "completed";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-6">

                    <div className="bg-white rounded-2xl shadow p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:justify-between gap-5">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-bold">
                                        {tournament.name}
                                    </h1>

                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm capitalize">
                                        {tournament.status}
                                    </span>
                                </div>

                                <p className="text-gray-500 mt-2">
                                    {tournament.city ||
                                        "Location not specified"}
                                </p>

                                {tournament.description && (
                                    <p className="text-gray-600 mt-4">
                                        {tournament.description}
                                    </p>
                                )}

                                {isCompleted && tournament.winner && (
                                    <div className="mt-5 inline-flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                                        <span className="text-2xl">🏆</span>
                                        <div>
                                            <p className="text-sm text-yellow-700">
                                                Tournament Winner
                                            </p>
                                            <p className="font-bold text-yellow-900">
                                                {tournament.winner.full_name ||
                                                    tournament.winner.username}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="text-gray-500">
                                    Participants
                                </p>
                                <p className="text-4xl font-bold">
                                    {tournament.participant_count}/
                                    {tournament.max_participants}
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

                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <div className="flex flex-wrap gap-3">

                            {tournament.status === "upcoming" && (
                                <>
                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            runAction(
                                                () => joinTournament(tournamentId),
                                                "Joined tournament."
                                            )
                                        }
                                        className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        Join Tournament
                                    </button>

                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            runAction(
                                                () => leaveTournament(tournamentId),
                                                "Left tournament."
                                            )
                                        }
                                        className="border border-red-500 text-red-600 px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        Leave Tournament
                                    </button>

                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            runAction(
                                                () => startTournament(tournamentId),
                                                "Tournament started."
                                            )
                                        }
                                        className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        Start Tournament
                                    </button>
                                </>
                            )}

                            {tournament.status === "active" &&
                                tournament.matches?.length === 0 && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            runAction(
                                                () => generateBracket(tournamentId),
                                                "Bracket generated."
                                            )
                                        }
                                        className="bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        Generate Bracket
                                    </button>
                                )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-bold mb-5">
                                Participants
                            </h2>

                            <div className="space-y-3">
                                {tournament.participants?.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className="border rounded-lg p-3"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {participant.player?.full_name ||
                                                        participant.player?.username ||
                                                        "Player"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {participant.player?.username
                                                        ? `@${participant.player.username}`
                                                        : ""}
                                                </p>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                #{participant.seed || "-"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="xl:col-span-2 bg-white rounded-xl shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    Tournament Bracket
                                </h2>

                                {tournament.matches?.length > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {tournament.matches.length} matches
                                    </span>
                                )}
                            </div>

                            {sortedRounds.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    Bracket has not been generated yet.
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {sortedRounds.map(([round, matches]) => (
                                        <div key={round}>
                                            <h3 className="font-bold text-lg mb-4">
                                                {Number(round) === sortedRounds.length
                                                    ? "Final"
                                                    : `Round ${round}`}
                                            </h3>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {matches.map((match) => {
                                                    const player1Won =
                                                        match.winner_id === match.player1_id;
                                                    const player2Won =
                                                        match.winner_id === match.player2_id;

                                                    return (
                                                        <div
                                                            key={match.id}
                                                            className={`border rounded-xl p-4 ${
                                                                match.status === "completed"
                                                                    ? "bg-gray-50"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-center gap-3">
                                                                <span
                                                                    className={
                                                                        player1Won
                                                                            ? "font-bold text-green-700"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {match.player1?.full_name ||
                                                                        "TBD"}
                                                                </span>

                                                                <span className="font-bold">
                                                                    {match.player1_score ?? "-"}
                                                                </span>
                                                            </div>

                                                            <div className="border-t my-3" />

                                                            <div className="flex justify-between items-center gap-3">
                                                                <span
                                                                    className={
                                                                        player2Won
                                                                            ? "font-bold text-green-700"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {match.player2?.full_name ||
                                                                        "TBD"}
                                                                </span>

                                                                <span className="font-bold">
                                                                    {match.player2_score ?? "-"}
                                                                </span>
                                                            </div>

                                                            <div className="mt-4 flex justify-between items-center gap-3">
                                                                <span className="text-sm text-gray-500 capitalize">
                                                                    {match.status}
                                                                </span>

                                                                {match.status === "scheduled" &&
                                                                    match.player1 &&
                                                                    match.player2 && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleSubmitResult(match)
                                                                            }
                                                                            disabled={actionLoading}
                                                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                                                                        >
                                                                            Result
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {isCompleted && tournament.winner && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-yellow-900">
                                🏆 Tournament Completed
                            </h2>
                            <p className="mt-2 text-yellow-800">
                                Winner:{" "}
                                <strong>
                                    {tournament.winner.full_name ||
                                        tournament.winner.username}
                                </strong>
                            </p>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow p-6 mt-6">
                        <h2 className="text-xl font-bold mb-5">
                            Standings
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-3">Rank</th>
                                        <th className="p-3">Player</th>
                                        <th className="p-3">Wins</th>
                                        <th className="p-3">Losses</th>
                                        <th className="p-3">Points</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {standings.map((row) => (
                                        <tr key={row.id} className="border-b">
                                            <td className="p-3 font-bold">
                                                #{row.rank}
                                            </td>
                                            <td className="p-3">
                                                {row.player?.full_name ||
                                                    row.player?.username}
                                            </td>
                                            <td className="p-3">{row.wins}</td>
                                            <td className="p-3">{row.losses}</td>
                                            <td className="p-3 font-bold">
                                                {row.points}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}