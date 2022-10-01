import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSongs } from "../../store/songs";

const SongList = () => {
    const dispatch = useDispatch();
    const songList = useSelector((state) => Object.values(state.songs));
    console.log(songList);

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    return (
        <>
        <div>
            <h1>Songs:</h1>
            Recently Played
        </div>
            {songList?.map(({ id, title }) => (
                <p key={id}>{title}</p>
            ))}
        </>
    )
}

export default SongList