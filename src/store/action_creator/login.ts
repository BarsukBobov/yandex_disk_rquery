import {LoginAction, LoginActionTypes} from "../../types/redux/login";
import {Dispatch} from "redux";


export function login(token: string) {
    return (dispatch: Dispatch<LoginAction>)=>dispatch({type: LoginActionTypes.LOGIN_SUCCESS, payload: token})
}

export function logout(){
    return (dispatch: Dispatch<LoginAction>)=>dispatch({type: LoginActionTypes.LOGIN_RESET})
}