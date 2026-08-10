import { useEffect, useState } from "react";
import {
    createProfile,
    getProfile,
    getPlayerRanking
} from "../../services/playerService";

export default function Profile() {

    const [form, setForm] = useState({
        username: "",
        full_name: "",
        city: "",
        country: "",
        bio: ""
    });

    const [profile, setProfile] = useState(null);
    const [ranking, setRanking] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getProfile();

            const player = response.data.player;

            setProfile(player);

            setForm({
                username: player.username || "",
                full_name: player.full_name || "",
                city: player.city || "",
                country: player.country || "",
                bio: player.bio || ""
            });

            // -------------------------------------------------
            // Load ranking
            // -------------------------------------------------

            if (player.id) {

                try {

                    const rankingResponse =
                    await getPlayerRanking(player.id);

                    setRanking(
                        rankingResponse.data.ranking
                    );

                } catch (rankingError) {

                    console.error(
                        "Ranking error:",
                        rankingError
                    );

                }
            }

        } catch (err) {

            // Profile does not exist yet
            if (err.response?.status === 404) {

                setProfile(null);

            } else {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load profile"
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    // =====================================================
    // CREATE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            await createProfile(form);

            alert("Profile Created Successfully");

            await loadProfile();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create profile"
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // TIER STYLE
    // =====================================================

    const getTierStyle = (tier) => {

        switch (tier?.toLowerCase()) {

            case "diamond":
                return "bg-purple-100 text-purple-700";

            case "platinum":
                return "bg-blue-100 text-blue-700";

            case "gold":
                return "bg-yellow-100 text-yellow-700";

            case "silver":
                return "bg-gray-200 text-gray-700";

            case "bronze":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <p className="text-gray-600">
                    Loading profile...
                </p>

            </div>
        );
    }

    // =====================================================
    // CREATE PROFILE SCREEN
    // =====================================================

    if (!profile) {

        return (

            <div className="min-h-screen bg-gray-50 p-6">

                <div className="max-w-2xl mx-auto">

                    <div className="bg-white rounded-xl shadow p-8">

                        <h1 className="text-3xl font-bold mb-2">
                            Create Player Profile
                        </h1>

                        <p className="text-gray-500 mb-6">
                            Create your profile to start building
                            your Foosball ranking.
                        </p>

                        {error && (

                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                                {error}
                            </div>

                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <label className="block font-medium mb-2">
                                    Username
                                </label>

                                <input
                                    name="username"
                                    value={form.username}
                                    placeholder="Enter username"
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Full Name
                                </label>

                                <input
                                    name="full_name"
                                    value={form.full_name}
                                    placeholder="Enter full name"
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>

                                    <label className="block font-medium mb-2">
                                        City
                                    </label>

                                    <input
                                        name="city"
                                        value={form.city}
                                        placeholder="City"
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    />

                                </div>

                                <div>

                                    <label className="block font-medium mb-2">
                                        Country
                                    </label>

                                    <input
                                        name="country"
                                        value={form.country}
                                        placeholder="Country"
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    />

                                </div>

                            </div>

                            <div>

                                <label className="block font-medium mb-2">
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={form.bio}
                                    placeholder="Tell something about yourself..."
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border rounded-lg px-4 py-3"
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >

                                {saving
                                    ? "Creating Profile..."
                                    : "Save Profile"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // CALCULATE WIN RATE
    // =====================================================

    const winRate =
        ranking?.matches_played > 0
            ? (
                ranking.wins /
                ranking.matches_played *
                100
            ).toFixed(1)
            : 0;

    // =====================================================
    // EXISTING PROFILE
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-5xl mx-auto">

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="bg-white rounded-xl shadow p-8 mb-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <h1 className="text-3xl font-bold">
                                {profile.full_name}
                            </h1>

                            <p className="text-gray-500 mt-1">
                                @{profile.username}
                            </p>

                            <p className="text-gray-500 mt-1">
                                {profile.city}
                                {profile.city && profile.country
                                    ? ", "
                                    : ""}
                                {profile.country}
                            </p>

                        </div>

                        {ranking?.tier && (

                            <span
                                className={`px-5 py-2 rounded-full font-bold text-lg ${getTierStyle(
                                    ranking.tier
                                )}`}
                            >
                                {ranking.tier}
                            </span>

                        )}

                    </div>

                    {profile.bio && (

                        <p className="mt-5 text-gray-600">
                            {profile.bio}
                        </p>

                    )}

                </div>

                {/* =================================================
                    RANKING
                ================================================= */}

                <div className="grid md:grid-cols-4 gap-5 mb-6">

                    {/* Rank */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500 text-sm">
                            Global Rank
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {ranking?.rank
                                ? `#${ranking.rank}`
                                : "—"}
                        </p>

                    </div>

                    {/* Elo */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500 text-sm">
                            Elo Rating
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {ranking?.elo_rating ||
                                profile.elo_rating ||
                                1000}
                        </p>

                    </div>

                    {/* Win Rate */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500 text-sm">
                            Win Rate
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {ranking?.win_rate ??
                                winRate}%
                        </p>

                    </div>

                    {/* Streak */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500 text-sm">
                            Current Streak
                        </p>

                        {ranking?.streak_type === "win" ? (

                            <p className="text-3xl font-bold mt-2 text-orange-600">
                                🔥 {ranking.streak_count}W
                            </p>

                        ) : ranking?.streak_type === "loss" ? (

                            <p className="text-3xl font-bold mt-2 text-red-600">
                                {ranking.streak_count}L
                            </p>

                        ) : (

                            <p className="text-3xl font-bold mt-2">
                                0
                            </p>

                        )}

                    </div>

                </div>

                {/* =================================================
                    MATCH STATISTICS
                ================================================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-5">
                        Player Statistics
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                        <div className="bg-gray-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Matches
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {ranking?.matches_played ??
                                    profile.matches_played ??
                                    0}
                            </p>

                        </div>

                        <div className="bg-green-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Wins
                            </p>

                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {ranking?.wins ??
                                    profile.wins ??
                                    0}
                            </p>

                        </div>

                        <div className="bg-red-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Losses
                            </p>

                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {ranking?.losses ??
                                    profile.losses ??
                                    0}
                            </p>

                        </div>

                        <div className="bg-blue-50 rounded-lg p-5">

                            <p className="text-gray-500">
                                Tier
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {ranking?.tier || "Bronze"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}