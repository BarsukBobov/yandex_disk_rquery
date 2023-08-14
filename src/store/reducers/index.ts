import {combineReducers} from "redux";
import {loginReduce} from "./loginReducer";
import {  persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'login',
    storage,
    whitelist: ['token'],
}

export const rootReducer = combineReducers({login:  persistReducer(persistConfig, loginReduce)})

export type  RootState = ReturnType<typeof rootReducer>