import React from 'react';
import {Navigate} from "react-router-dom";
import {useTypedSelector} from "../hooks/useTypedSelector";
import config  from "../config.json"
import {useActions} from "../hooks/useActions";



const AuthorizePage: React.FC = () => {
    const {token} = useTypedSelector(state=>state.login)
    const {login} = useActions()

    const authorize = () => {
        // redux debug
        if (config.debug){
            login(config.debug_token)
            return
        }
        window.location.replace(`https://oauth.yandex.ru/authorize?response_type=token&client_id=${config.client_id}`);
    };

    if (token) return(<Navigate to="/YandexDisk"/>)

    return (
        <div id="container">
            <img id="yandexlogo" onClick={authorize} src="https://upload.wikimedia.org/wikipedia/commons/5/58/Yandex_icon.svg"
                 alt={"яндекс логотип"}/>
        </div>
    );
};

export default AuthorizePage;