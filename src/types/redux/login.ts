export interface LoginState {
    token: null | string,
}

export enum LoginActionTypes {
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_ERROR = "LOGIN_ERROR",
    LOGIN_RESET="LOGIN_RESET"
}


interface LoginSuccessAction {
    type: LoginActionTypes.LOGIN_SUCCESS,
    payload: string
}

interface LoginResetAction {
    type: LoginActionTypes.LOGIN_RESET,
}


export type LoginAction = LoginSuccessAction|LoginResetAction
