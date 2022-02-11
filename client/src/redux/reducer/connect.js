import {
    SHOW_CONNECT_MODAL,
    HIDE_CONNECT_MODAL,
    SET_TOGGLE_STICKY,
    REMOVE_TOGGLE_STICKY,
    SET_WALLET_ADDRESS,
    SET_CHAIN_ID,
    SET_CONNECTED,
    SET_ACCOUNT_BALANCE,
    SET_TOKEN_PRICE,
    SET_PENDING
} from '../types';

const initialState = {
    show_modal: false,
    toggle_sticky: true,
    walletAddress: null,
    chainId: 0,
    connected: false,
    accountBalance: '',
    tokenPrice: 0,
    pending: false
};

function connectReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_CONNECT_MODAL:
            return {
                ...state,
                show_modal: true
            }

        case HIDE_CONNECT_MODAL:
            return {
                ...state,
                show_modal: false
            }

        case SET_TOGGLE_STICKY:
            return {
                ...state,
                toggle_sticky: true
            }

        case REMOVE_TOGGLE_STICKY:
            return {
                ...state,
                toggle_sticky: false
            }

        case SET_WALLET_ADDRESS:
            return {
                ...state,
                walletAddress: action.payload
            }
        case SET_CHAIN_ID:
            return {
                ...state,
                chainId: action.payload
            }
        case SET_CONNECTED:
            return {
                ...state,
                connected: action.payload
            }
        case SET_ACCOUNT_BALANCE:
            return {
                ...state,
                accountBalance: action.payload
            }
        case SET_TOKEN_PRICE:
            return {
                ...state,
                tokenPrice: action.payload
            }
        case SET_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        default:
            return state;
    }
}

export default connectReducer;