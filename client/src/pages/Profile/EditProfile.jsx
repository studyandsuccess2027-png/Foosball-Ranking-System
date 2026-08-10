import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile
} from "../../services/playerService";

export default function EditProfile() {

    const [player, setPlayer] = useState(null);

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        const res = await getProfile();

        setPlayer(res.data.player);

    };

    const save = async () => {

        await updateProfile(player);

        alert("Updated");

    };

    if (!player) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <input

                value={player.full_name}

                onChange={(e) =>
                    setPlayer({
                        ...player,
                        full_name: e.target.value
                    })
                }

            />

            <textarea

                value={player.bio}

                onChange={(e) =>
                    setPlayer({
                        ...player,
                        bio: e.target.value
                    })
                }

            />

            <button onClick={save}>

                Update

            </button>

        </div>

    );

}