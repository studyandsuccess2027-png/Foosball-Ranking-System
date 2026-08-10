import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import EloChart from "../../components/EloChart";

import {
    getEloHistory
} from "../../services/playerService";

export default function EloHistory() {

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHistory();

    }, []);

    async function loadHistory() {

        try {

            const response =
                await getEloHistory();

            setHistory(
                response.data.history || []
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="max-w-6xl mx-auto p-6">
                    Loading Elo history...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-6xl mx-auto p-6">

                    <EloChart
                        history={history}
                    />

                    {/* History Table */}

                    <div className="bg-white rounded-xl shadow p-6 mt-6">

                        <h2 className="text-xl font-bold mb-4">
                            Rating Changes
                        </h2>

                        {history.length === 0 ? (

                            <p className="text-gray-500">
                                No matches played yet.
                            </p>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b">

                                            <th className="text-left p-3">
                                                Match
                                            </th>

                                            <th className="text-left p-3">
                                                Previous
                                            </th>

                                            <th className="text-left p-3">
                                                Change
                                            </th>

                                            <th className="text-left p-3">
                                                New Rating
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {history
                                            .slice()
                                            .reverse()
                                            .map((item) => (

                                                <tr
                                                    key={item.id}
                                                    className="border-b"
                                                >

                                                    <td className="p-3">
                                                        #{item.match_id}
                                                    </td>

                                                    <td className="p-3">
                                                        {item.old_rating}
                                                    </td>

                                                    <td
                                                        className={`
                                                            p-3 font-semibold
                                                            ${
                                                                item.rating_change > 0
                                                                    ? "text-green-600"
                                                                    : item.rating_change < 0
                                                                    ? "text-red-600"
                                                                    : "text-gray-500"
                                                            }
                                                        `}
                                                    >
                                                        {item.rating_change > 0
                                                            ? `+${item.rating_change}`
                                                            : item.rating_change
                                                        }
                                                    </td>

                                                    <td className="p-3 font-bold">
                                                        {item.new_rating}
                                                    </td>

                                                </tr>

                                            ))
                                        }

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