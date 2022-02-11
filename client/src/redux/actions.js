import axios from "axios";
import {
    GET_HISTORY,
    GET_USER_DATA,
    GET_LISTED_DATA,
    GET_MADE_OFFERS,
    GET_ACTIVITY,
    GET_RECEIVED_OFFERS
} from './types';

export const connectUser = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "users", data)
        .then(res => {
            dispatch({
                type: GET_USER_DATA,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const updateProfile = (data) => dispatch => {
    axios.put(process.env.REACT_APP_API_URL + "users", data)
        .then(res => {
            dispatch({
                type: GET_USER_DATA,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getUserData = (address) => dispatch => {
    axios.get(process.env.REACT_APP_API_URL + `users/${address}`)
        .then(res => {
            dispatch({
                type: GET_USER_DATA,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const setHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "history", data)
        .then(res => {
            // console.log(res.data)
            dispatch({
                type: GET_HISTORY,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const setMintHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "history/mint", data)
        .then(res => {
            console.log("Minted")
        })
        .catch(err => console.log(err.response.data))
}

export const getHistory = (tokenId, network) => dispatch => {
    axios.get(process.env.REACT_APP_API_URL + `history/${tokenId}/${network}`)
        .then(res => {
            dispatch({
                type: GET_HISTORY,
                payload: res.data.allHistory
            })
            dispatch({
                type: GET_LISTED_DATA,
                payload: res.data.list
            })
        })
        .catch(err => {
            console.log(err.response.data)
            dispatch({
                type: GET_HISTORY,
                payload: []
            })
        })
}

export const setListedToken = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + 'lists', data)
        .then(res => {
            dispatch({
                type: GET_LISTED_DATA,
                payload: res.data.listHistory
            })
            dispatch({
                type: GET_HISTORY,
                payload: res.data.histories
            })
        })
        .catch(err => console.log(err.response.data))
}

export const updateListHistory = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + 'lists/update', data)
        .then(res => {
            dispatch({
                type: GET_LISTED_DATA,
                payload: res.data.listHistory
            })
            dispatch({
                type: GET_HISTORY,
                payload: res.data.histories
            })
        })
        .catch(err => {
            dispatch({
                type: GET_LISTED_DATA,
                payload: []
            })
        })
}

export const cancelOffers = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "offers/cancel", data)
        .then(res => {

        })
        .catch(err => console.log(err.response.data))
}

export const cancelOtherOffers = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "history/canceloffers", data)
        .then(res => {
            dispatch({
                type: GET_HISTORY,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getActivity = (addr) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + `history/activity`, { address: addr })
        .then(res => {
            dispatch({
                type: GET_ACTIVITY,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getListings = (addr) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + `history/listings`, { address: addr })
        .then(res => {
            dispatch({
                type: GET_LISTED_DATA,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const setOffer = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "offers", data)
        .then(res => {
            console.log("offer success")
        })
        .catch(err => console.log(err.response.data))
}

export const getMadeOffers = (address) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + `offers/made_offers`, { address: address })
        .then(res => {
            dispatch({
                type: GET_MADE_OFFERS,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const updateOfferStatus = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "offers/update_status", data)
        .then(res => {
            dispatch({
                type: GET_MADE_OFFERS,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const getReceivedOffers = (address) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + `offers/received_offers`, { address: address })
        .then(res => {
            dispatch({
                type: GET_RECEIVED_OFFERS,
                payload: res.data
            })
        })
        .catch(err => console.log(err.response.data))
}

export const cancelOffersWhenApprove = (data) => dispatch => {
    axios.post(process.env.REACT_APP_API_URL + "offers/cancel_when_approve", data)
        .then(res => {

        })
        .catch(err => console.log(err.response.data))
}