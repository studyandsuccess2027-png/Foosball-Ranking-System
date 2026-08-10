import { useState } from "react";

export default function SearchBar({ onSearch }) {

    const [keyword, setKeyword] = useState("");

    const search = () => {

        onSearch(keyword);

    };

    return (

        <div className="flex gap-3 mb-5">

            <input

                className="border p-2 rounded w-full"

                placeholder="Search player..."

                value={keyword}

                onChange={(e)=>setKeyword(e.target.value)}

            />

            <button

                className="bg-blue-600 text-white px-5 rounded"

                onClick={search}

            >

                Search

            </button>

        </div>

    );

}