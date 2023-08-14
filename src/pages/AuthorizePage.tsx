import React from 'react';
import {Navigate} from "react-router-dom";
import {useTypedSelector} from "../hooks/useTypedSelector";



const AuthorizePage: React.FC = () => {
    const {token} = useTypedSelector(state=>state.login)

    if (token) return(<Navigate to="/YandexDisk"/>)

    // // redux debug
    // const {login} = useActions()
    // login("y0_AgAAAAA8SCcyAApUowAAAADqKAR5x-xDGh_gRQihNmZQW56Mifyy1AI")

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authorize = () => {
        window.location.replace('https://oauth.yandex.ru/authorize?response_type=token&client_id=f0f2d84e89454126a95f1c5ee8e908a4');
    };

    return (
        <div id="container">
            <img id="yandexlogo" onClick={authorize} src="https://upload.wikimedia.org/wikipedia/commons/5/58/Yandex_icon.svg"  alt={"яндекс логотип"}/>
        </div>
    );
};

export default AuthorizePage;