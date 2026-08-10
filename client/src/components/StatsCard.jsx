export default function StatsCard({
    title,
    value,
    subtitle
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 border">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
                {value}
            </h2>

            {subtitle && (
                <p className="text-sm text-gray-500 mt-1">
                    {subtitle}
                </p>
            )}

        </div>
    );
}