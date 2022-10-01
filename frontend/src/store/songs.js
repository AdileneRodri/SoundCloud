import { csrfFetch } from "./csrf";

const initialState = {};

const GET_ALL_SONGS = '/songs';

// regular action creator
const loadAllSongs = (songs) => {
    return {
        type: GET_ALL_SONGS,
        songs
    };
};



// thunk action creator
export const getAllSongs = () => async(dispatch) => {
    const res = await csrfFetch('/api/songs');
    const data = await res.json();
    res.data = data;
    
    if (res.ok) {
        dispatch(loadAllSongs(data.Songs));
        return data;
    } else {
        throw res.data
    }
}

// reducer
const songReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case GET_ALL_SONGS:
          newState = {...state};
          action.songs.forEach((song) => (newState[song.id] = song));
          return newState;
        default:
          return state;
      }
};

export default songReducer;