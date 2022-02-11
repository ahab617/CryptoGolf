import { GET_ACTIVITY, GET_MADE_OFFERS, GET_RECEIVED_OFFERS } from "../types";

const initialState = {
    activities: [],
    madeOffers: [],
    receivedOffers: []
};

function accountReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVITY:
            return {
                ...state,
                activities: action.payload
            }
        case GET_MADE_OFFERS:
            return {
                ...state,
                madeOffers: action.payload
            }
        case GET_RECEIVED_OFFERS:
            return {
                ...state,
                receivedOffers: action.payload
            }
        default:
            return state;
    }
}

export default accountReducer;