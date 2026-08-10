import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
export default function EloChart({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                    Elo Rating History
                </h2>
                <p className="text-gray-500">
                    No Elo history available yet.
                </p>
            </div>
        );
    }
    const data = history.map(
        (item, index) => ({
            match: index + 1,
            rating: item.new_rating
        })
    );
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-6">
                Elo Rating History
            </h2>
            <div className="w-full h-80">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="match"
                            label={{
                                value: "Match",
                                position: "insideBottom",
                                offset: -5
                            }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="rating"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}