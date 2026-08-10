import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();

    // Backend authentication function — SAME as before
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // IMPORTANT:
            // Do NOT change this.
            // This is your existing backend connection.
            await register(
                form.name,
                form.email,
                form.password
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">

            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

            </div>


            {/* Main Card */}
            <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-slate-900/80 border border-slate-700/70 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">


                {/* =========================
                    LEFT SIDE
                ========================== */}

                <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-600/20 border-r border-slate-700/60">

                    <div>

                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">

                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                                ⚽
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    Foosball
                                    <span className="text-blue-400">
                                        Arena
                                    </span>
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Rank. Play. Compete.
                                </p>
                            </div>

                        </div>


                        {/* Heading */}
                        <h1 className="text-4xl font-extrabold leading-tight">

                            Build your
                            <span className="text-blue-400">
                                {" "}Foosball
                            </span>

                            <br />

                            journey.

                        </h1>


                        <p className="text-slate-400 mt-5 leading-relaxed max-w-md">
                            Create your account and start competing
                            with players, teams and tournaments.
                        </p>


                        {/* Features */}
                        <div className="mt-10 space-y-5">

                            <Feature
                                icon="🏆"
                                title="Join Tournaments"
                                description="Compete against other players."
                            />

                            <Feature
                                icon="📈"
                                title="Improve Your Elo"
                                description="Track your progress and climb rankings."
                            />

                            <Feature
                                icon="👥"
                                title="Build Your Team"
                                description="Play together and compete as a squad."
                            />

                        </div>

                    </div>


                    <p className="text-sm text-slate-500 mt-10">
                        © 2026 Foosball Arena
                    </p>

                </div>


                {/* =========================
                    RIGHT SIDE
                ========================== */}

                <div className="p-7 sm:p-10 lg:p-12">

                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center justify-center gap-3 mb-8">

                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                            ⚽
                        </div>

                        <div>
                            <h2 className="text-lg font-bold">
                                Foosball
                                <span className="text-blue-400">
                                    Arena
                                </span>
                            </h2>

                            <p className="text-xs text-slate-400">
                                Rank. Play. Compete.
                            </p>
                        </div>

                    </div>


                    {/* Heading */}
                    <div className="text-center mb-8">

                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 mb-5">
                            👤
                        </div>

                        <h1 className="text-3xl font-bold">
                            Create Account
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Join the Foosball Arena community
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}

                        <div>

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Full Name
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    👤
                                </span>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    className="w-full bg-slate-950/70 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    ✉️
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="w-full bg-slate-950/70 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full bg-slate-950/70 border border-slate-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* Confirm Password */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    🔐
                                </span>

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className={`w-full bg-slate-950/70 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                                        form.confirmPassword &&
                                        form.password !==
                                            form.confirmPassword
                                            ? "border-red-500 focus:ring-red-500/20"
                                            : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                >
                                    {showConfirmPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>


                            {/* Password mismatch */}

                            {form.confirmPassword &&
                                form.password !==
                                    form.confirmPassword && (

                                    <p className="text-red-400 text-xs mt-2">
                                        Passwords do not match.
                                    </p>

                                )}

                        </div>


                        {/* Terms */}

                        <div className="flex items-start gap-3">

                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 accent-blue-600"
                            />

                            <p className="text-xs text-slate-400 leading-relaxed">

                                I agree to the{" "}

                                <span className="text-blue-400">
                                    Terms of Service
                                </span>

                                {" "}and{" "}

                                <span className="text-blue-400">
                                    Privacy Policy
                                </span>

                            </p>

                        </div>


                        {/* Register Button */}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                form.password !==
                                    form.confirmPassword
                            }
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >

                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span className="text-lg">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Login */}

                    <div className="flex items-center gap-3 my-7">

                        <div className="h-px bg-slate-700 flex-1" />

                        <span className="text-xs text-slate-500">
                            OR
                        </span>

                        <div className="h-px bg-slate-700 flex-1" />

                    </div>


                    <p className="text-center text-sm text-slate-400">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-semibold transition"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}


/* =========================================
   FEATURE COMPONENT
========================================= */

function Feature({
    icon,
    title,
    description
}) {
    return (
        <div className="flex items-center gap-4">

            <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
                {icon}
            </div>

            <div>

                <h3 className="font-semibold">
                    {title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                    {description}
                </p>

            </div>

        </div>
    );
}

 