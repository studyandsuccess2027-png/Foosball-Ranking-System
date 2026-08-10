import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import {
    createTeam
} from "../../services/teamService";

export default function CreateTeam() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (!name.trim()) {

            setError("Team name is required.");

            return;
        }

        try {

            setLoading(true);

            const response = await createTeam({

                name: name.trim(),

                description: description.trim(),

                city: city.trim()

            });

            const team =
                response.data.team;

            navigate(`/teams/${team.id}`);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to create team."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-xl mx-auto p-6">

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h1 className="text-3xl font-bold">
                            Create Team
                        </h1>

                        <p className="text-gray-500 mt-1 mb-6">
                            Create your Foosball team.
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
                                    Team Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Foosball Warriors"
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    City
                                </label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                    placeholder="Jhansi"
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Tell something about your team..."
                                    rows="4"
                                    className="w-full border rounded-lg p-3"
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Team"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </main>
        </>
    );
}