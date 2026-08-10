import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    createTournament
} from "../../services/tournamentService";

export default function CreateTournament() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        city: "",
        format: "single_elimination",
        max_participants: 8
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function handleChange(e) {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (!form.name.trim()) {

            setError(
                "Tournament name is required."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await createTournament({

                    ...form,

                    max_participants:
                        Number(
                            form.max_participants
                        )

                });

            navigate(
                `/tournaments/${response.data.tournament.id}`
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to create tournament."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-2xl mx-auto p-6">

                    <div className="bg-white rounded-2xl shadow p-7">

                        <h1 className="text-3xl font-bold">
                            Create Tournament
                        </h1>

                        <p className="text-gray-500 mt-1 mb-7">
                            Organize a new Foosball competition.
                        </p>

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <label className="block font-medium mb-2">
                                    Tournament Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Jhansi Foosball Championship"
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    City
                                </label>

                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Jhansi"
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tournament details..."
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Tournament Format
                                </label>

                                <select
                                    name="format"
                                    value={form.format}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                >

                                    <option value="single_elimination">
                                        Single Elimination
                                    </option>

                                    <option value="round_robin">
                                        Round Robin
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Maximum Participants
                                </label>

                                <select
                                    name="max_participants"
                                    value={form.max_participants}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-3"
                                >

                                    <option value="4">
                                        4
                                    </option>

                                    <option value="8">
                                        8
                                    </option>

                                    <option value="16">
                                        16
                                    </option>

                                    <option value="32">
                                        32
                                    </option>

                                </select>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Tournament"}

                            </button>

                        </form>

                    </div>

                </div>

            </main>
        </>
    );
}