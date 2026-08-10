import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Trophy,
    BarChart3,
    Users,
    ArrowRight,
    Gamepad2
} from "lucide-react";

export default function Login() {

    const navigate = useNavigate();

    // EXISTING BACKEND AUTH CONNECTION
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        // Clear previous error while typing
        if (error) {
            setError("");
        }
    };


    // =========================================================
    // HANDLE LOGIN
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Basic frontend validation
        if (!form.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!form.password) {
            setError("Please enter your password.");
            return;
        }

        try {

            setLoading(true);

            /*
             * IMPORTANT:
             *
             * This is your EXISTING backend authentication.
             *
             * The login() function from AuthContext
             * should call your Flask backend and handle
             * the JWT/token storage.
             */

            const user = await login(
                form.email,
                form.password
            );


            // =================================================
            // ROLE BASED REDIRECT
            // =================================================

            if (user?.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/dashboard");

            }


        } catch (error) {

            /*
             * Show backend error message if available.
             *
             * Example:
             * {
             *   "message": "Invalid email or password"
             * }
             */

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Login failed. Please check your email and password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-[#050b18] text-white overflow-hidden">

            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div className="absolute inset-0 overflow-hidden">

                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />

                <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-purple-600/10 rounded-full blur-3xl" />

            </div>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="relative min-h-screen flex flex-col">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="w-full px-6 md:px-10 py-6">

                    <div className="max-w-7xl mx-auto flex justify-between items-center">

                        {/* LOGO */}

                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >

                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center shadow-lg shadow-blue-500/20">

                                <Gamepad2
                                    size={25}
                                    className="text-white"
                                />

                            </div>


                            <div>

                                <h1 className="text-xl md:text-2xl font-bold">

                                    Foosball
                                    <span className="text-red-500">
                                        Arena
                                    </span>

                                </h1>

                                <p className="text-xs text-gray-400">
                                    Rank. Play. Compete.
                                </p>

                            </div>

                        </Link>


                        {/* STATUS */}

                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">

                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                            Tournament Arena

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="flex-1 flex items-center px-6 py-8">

                    <div className="max-w-7xl w-full mx-auto">

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">


                            {/* =================================================
                                LEFT SIDE
                            ================================================= */}

                            <section className="hidden lg:block">

                                <div className="max-w-xl">

                                    <p className="uppercase tracking-[0.25em] text-sm text-blue-400 font-semibold mb-5">

                                        Welcome Back

                                    </p>


                                    <h2 className="text-5xl xl:text-6xl font-extrabold leading-tight">

                                        Ready to

                                        <span className="text-red-500">
                                            {" "}Play?
                                        </span>

                                        <br />

                                        <span className="text-white">
                                            Your arena awaits.
                                        </span>

                                    </h2>


                                    <p className="text-gray-400 text-lg mt-6 max-w-lg leading-relaxed">

                                        Log in to compete against players,
                                        improve your Elo rating, join teams
                                        and climb the Foosball rankings.

                                    </p>


                                    {/* FEATURES */}

                                    <div className="mt-10 space-y-5">


                                        {/* FEATURE 1 */}

                                        <div className="flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">

                                                <Trophy
                                                    className="text-red-400"
                                                    size={23}
                                                />

                                            </div>


                                            <div>

                                                <h3 className="font-semibold text-lg">
                                                    Compete
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    Join tournaments and win matches
                                                </p>

                                            </div>

                                        </div>


                                        {/* FEATURE 2 */}

                                        <div className="flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                                                <BarChart3
                                                    className="text-blue-400"
                                                    size={23}
                                                />

                                            </div>


                                            <div>

                                                <h3 className="font-semibold text-lg">
                                                    Climb Rankings
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    Improve your Elo rating
                                                </p>

                                            </div>

                                        </div>


                                        {/* FEATURE 3 */}

                                        <div className="flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">

                                                <Users
                                                    className="text-green-400"
                                                    size={23}
                                                />

                                            </div>


                                            <div>

                                                <h3 className="font-semibold text-lg">
                                                    Build Teams
                                                </h3>

                                                <p className="text-gray-500 text-sm">
                                                    Play with your squad
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ELO BADGE */}

                                    <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10">

                                        <div className="w-2 h-2 bg-blue-400 rounded-full" />

                                        <span className="text-sm text-gray-300">
                                            Track your performance with Elo Rating
                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                LOGIN CARD
                            ================================================= */}

                            <section>

                                <div className="w-full max-w-lg mx-auto">

                                    <div className="relative rounded-3xl border border-white/10 bg-[#101827]/90 backdrop-blur-xl shadow-2xl shadow-black/40 p-7 sm:p-9">


                                        {/* CARD GLOW */}

                                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-red-500/20 pointer-events-none" />


                                        <div className="relative">


                                            {/* ICON */}

                                            <div className="flex justify-center mb-5">

                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 p-[2px]">

                                                    <div className="w-full h-full rounded-full bg-[#101827] flex items-center justify-center">

                                                        <Gamepad2
                                                            size={30}
                                                            className="text-white"
                                                        />

                                                    </div>

                                                </div>

                                            </div>


                                            {/* TITLE */}

                                            <div className="text-center mb-8">

                                                <h2 className="text-3xl sm:text-4xl font-bold">

                                                    Login

                                                </h2>

                                                <p className="text-gray-400 mt-2">

                                                    Enter your credentials to
                                                    access your account

                                                </p>

                                            </div>


                                            {/* =================================================
                                                ERROR MESSAGE
                                            ================================================= */}

                                            {error && (

                                                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">

                                                    <p className="text-sm text-red-300">

                                                        {error}

                                                    </p>

                                                </div>

                                            )}


                                            {/* =================================================
                                                LOGIN FORM
                                            ================================================= */}

                                            <form
                                                onSubmit={handleSubmit}
                                                className="space-y-5"
                                            >


                                                {/* EMAIL */}

                                                <div>

                                                    <label className="block text-sm font-semibold mb-2">

                                                        Email

                                                    </label>


                                                    <div className="relative">

                                                        <Mail
                                                            size={20}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                                        />


                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Enter your email"
                                                            value={form.email}
                                                            onChange={handleChange}
                                                            required
                                                            autoComplete="email"
                                                            disabled={loading}
                                                            className="w-full h-14 rounded-xl border border-slate-600/70 bg-slate-900/60 pl-12 pr-4 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                                                        />

                                                    </div>

                                                </div>


                                                {/* PASSWORD */}

                                                <div>

                                                    <label className="block text-sm font-semibold mb-2">

                                                        Password

                                                    </label>


                                                    <div className="relative">

                                                        <Lock
                                                            size={20}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                                        />


                                                        <input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="password"
                                                            placeholder="Enter your password"
                                                            value={form.password}
                                                            onChange={handleChange}
                                                            required
                                                            autoComplete="current-password"
                                                            disabled={loading}
                                                            className="w-full h-14 rounded-xl border border-slate-600/70 bg-slate-900/60 pl-12 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                                                        />


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                            disabled={loading}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition disabled:opacity-50"
                                                            aria-label={
                                                                showPassword
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >

                                                            {showPassword ? (
                                                                <EyeOff size={20} />
                                                            ) : (
                                                                <Eye size={20} />
                                                            )}

                                                        </button>

                                                    </div>

                                                </div>


                                                {/* REMEMBER / FORGOT */}

                                                <div className="flex items-center justify-between text-sm">

                                                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">

                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 accent-blue-500"
                                                        />

                                                        Remember me

                                                    </label>


                                                    <button
                                                        type="button"
                                                        className="text-blue-400 hover:text-blue-300 transition"
                                                    >

                                                        Forgot password?

                                                    </button>

                                                </div>


                                                {/* =================================================
                                                    LOGIN BUTTON
                                                ================================================= */}

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="group w-full h-14 rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-blue-600 hover:from-red-600 hover:via-pink-600 hover:to-blue-700 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                                >

                                                    {loading ? (

                                                        <>
                                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                                            Logging in...
                                                        </>

                                                    ) : (

                                                        <>
                                                            Login

                                                            <ArrowRight
                                                                size={21}
                                                                className="group-hover:translate-x-1 transition-transform"
                                                            />
                                                        </>

                                                    )}

                                                </button>

                                            </form>


                                            {/* REGISTER */}

                                            <div className="flex items-center gap-4 my-7">

                                                <div className="h-px bg-white/10 flex-1" />

                                                <span className="text-gray-500 text-sm">
                                                    or
                                                </span>

                                                <div className="h-px bg-white/10 flex-1" />

                                            </div>


                                            <p className="text-center text-gray-400">

                                                Don't have an account?

                                                <Link
                                                    to="/register"
                                                    className="ml-2 text-blue-400 font-semibold hover:text-blue-300 transition"
                                                >
                                                    Register
                                                </Link>

                                            </p>

                                        </div>

                                    </div>


                                    {/* FOOTER */}

                                    <p className="text-center text-gray-600 text-sm mt-6">

                                        © 2026 Foosball Arena. All rights reserved.

                                    </p>

                                </div>

                            </section>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

