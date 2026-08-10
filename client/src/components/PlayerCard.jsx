export default function PlayerCard({ player, rank }) {

    function getTierStyle(tier) {

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
    }

    function getRankStyle(rank) {

        if (rank === 1) {
            return "bg-yellow-100 text-yellow-700";
        }

        if (rank === 2) {
            return "bg-gray-200 text-gray-700";
        }

        if (rank === 3) {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-gray-100 text-gray-600";
    }

    return (

        <div className="border rounded-xl p-5 shadow-md bg-white mb-4">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex justify-between items-start gap-4">

                {/* Player */}

                <div className="flex items-center gap-4">

                    <span
                        className={`inline-flex items-center justify-center w-11 h-11 rounded-full font-bold ${getRankStyle(
                            rank
                        )}`}
                    >
                        #{rank}
                    </span>

                    <div>

                        <h2 className="text-xl font-bold">

                            {player.full_name}

                        </h2>

                        <p className="text-gray-500">

                            @{player.username}

                        </p>

                        {(player.city ||
                            player.country) && (

                            <p className="text-sm text-gray-400">

                                {player.city}

                                {player.city &&
                                player.country
                                    ? ", "
                                    : ""}

                                {player.country}

                            </p>

                        )}

                    </div>

                </div>


                {/* Elo */}

                <div className="text-right">

                    <p className="text-3xl font-bold">

                        {player.elo_rating}

                    </p>

                    <p className="text-sm text-gray-500">

                        ELO

                    </p>

                </div>

            </div>


            {/* =================================================
                TIER + STREAK
            ================================================= */}

            <div className="flex flex-wrap gap-3 mt-5">

                {player.tier && (

                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierStyle(
                            player.tier
                        )}`}
                    >

                        🏅 {player.tier}

                    </span>

                )}

                {player.streak_type === "win" && (

                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">

                        🔥 {player.streak_count}W Streak

                    </span>

                )}

                {player.streak_type === "loss" && (

                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">

                        {player.streak_count}L Streak

                    </span>

                )}

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500">

                        Matches

                    </p>

                    <p className="text-lg font-bold">

                        {player.matches_played ?? 0}

                    </p>

                </div>


                <div className="bg-green-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500">

                        Wins

                    </p>

                    <p className="text-lg font-bold text-green-600">

                        {player.wins ?? 0}

                    </p>

                </div>


                <div className="bg-red-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500">

                        Losses

                    </p>

                    <p className="text-lg font-bold text-red-600">

                        {player.losses ?? 0}

                    </p>

                </div>


                <div className="bg-blue-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500">

                        Win Rate

                    </p>

                    <p className="text-lg font-bold text-blue-600">

                        {player.win_rate ?? 0}%

                    </p>

                </div>

            </div>

        </div>
    );
}