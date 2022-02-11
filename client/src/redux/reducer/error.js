import { GET_ERRORS, CLEAR_ERRORS } from '../types';

const initialState = {};

function errorReducer (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return action.payload;

        case CLEAR_ERRORS:
            return initialState;

        default:
            return state;
    }
}

export default errorReducer;