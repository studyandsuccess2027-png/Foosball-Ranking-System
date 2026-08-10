import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import {
    getAdminUsers,
    deleteAdminUser
} from "../../services/adminService";


export default function AdminUsers() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadUsers();

    }, []);


    async function loadUsers() {

        try {

            const response =
                await getAdminUsers();

            setUsers(
                response.data.users || []
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }

    }


    async function handleDelete(userId) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteAdminUser(userId);

            setUsers(
                previous =>
                    previous.filter(
                        user =>
                            user.id !== userId
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete user."
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
                            Manage Users
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
                                Loading users...
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
                                                Username
                                            </th>

                                            <th className="p-4">
                                                Email
                                            </th>

                                            <th className="p-4">
                                                Role
                                            </th>

                                            <th className="p-4">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {users.map(
                                            user => (

                                                <tr
                                                    key={user.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-4">
                                                        #{user.id}
                                                    </td>

                                                    <td className="p-4 font-medium">
                                                        {user.username}
                                                    </td>

                                                    <td className="p-4">
                                                        {user.email}
                                                    </td>

                                                    <td className="p-4">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm ${
                                                                user.role === "admin"
                                                                    ? "bg-purple-100 text-purple-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            {user.role}
                                                        </span>

                                                    </td>

                                                    <td className="p-4">

                                                        {user.role !== "admin" && (

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id
                                                                    )
                                                                }
                                                                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                                                            >
                                                                Delete
                                                            </button>

                                                        )}

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