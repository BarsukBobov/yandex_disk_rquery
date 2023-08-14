import {LoginState, LoginActionTypes,LoginAction} from "../../types/redux/login";

const initState: LoginState = {
    token: null,
}

export function loginReduce(state: LoginState = initState, action: LoginAction): LoginState {
    switch (action.type) {
        case LoginActionTypes.LOGIN_SUCCESS:
            return { token: action.payload}
        case LoginActionTypes.LOGIN_RESET:
            return {token: null}
        default:
            return state
    }
}