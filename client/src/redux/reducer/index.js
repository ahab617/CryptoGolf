import { combineReducers } from 'redux';
import errorReducer from './error';
import tokenReducer from './token';
import connectReducer from './connect';
import historyReducer from './history';
import userReducer from './user';
import accountReducer from './account';

export default combineReducers({
    error: errorReducer,
    token: tokenReducer,
    connect: connectReducer,
    history: historyReducer,
    user: userReducer,
    account: accountReducer
});
