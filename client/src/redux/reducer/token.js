import { GET_GOLFPUNKS } from '../types';

const initialState = {
    tokens: [],
    token: {}
};

function tokenReducer (state = initialState, action) {
    switch (action.type) {
        case GET_GOLFPUNKS:
            return {
                ...state,
                tokens: action.payload
            }
        default:
            return state;
    }
}

export default tokenReducer;