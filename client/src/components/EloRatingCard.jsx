export default function EloRatingCard({ player }) {
    if (!player) {
        return null;
    }
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        Current Elo Rating
                    </p>
                    <h1 className="text-5xl font-bold mt-2">
                        {player.elo_rating}
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Player
                    </p>
                    <h2 className="text-xl font-semibold">
                        {player.full_name}
                    </h2>
                    <p className="text-gray-500">
                        @{player.username}
                    </p>
                </div>
            </div>
        </div>
    );
}