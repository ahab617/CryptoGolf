import { GET_HISTORY, GET_LISTED_DATA } from '../types';

const initialState = {
    histories: [],
    history: {},
    lists: [],
};

function historyReducer(state = initialState, action) {
    switch (action.type) {
        case GET_HISTORY:
            return {
                ...state,
                histories: action.payload
            }
        case GET_LISTED_DATA:
            return {
                ...state,
                lists: action.payload
            }
        default:
            return state;
    }
}

export default historyReducer;