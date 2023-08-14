import React, {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";






const AuthorizePage: React.FC = () => {
    const [show, setShow] = useState(false);
    useEffect(()=>{
        document.documentElement.setAttribute('data-bs-theme','light')
        // @ts-ignore
        window.YaAuthSuggest.init({
                client_id: 'f0f2d84e89454126a95f1c5ee8e908a4',
                response_type: 'token',
                redirect_uri: 'https://yaroscosh.ru/redirect'
            },
            'https://yaroscosh.ru',
            {
                view: 'button',
                parentId: 'container',
                buttonSize: 'xxl',
                buttonView: 'additional',
                buttonTheme: 'dark',
                buttonBorderRadius: "24",
                buttonIcon: 'ya',
            }
        )
            .then(function(result: any) {
                return result.handler()
            })
            .then(function(data: any) {
                console.log('Сообщение с токеном: ', data.access_token);
                setShow(true)
            })
            .catch(function(error: any) {
                console.log('Что-то пошло не так: ', error);
                document.body.innerHTML += `Что-то пошло не так: ${JSON.stringify(error)}. Обновите страницу`;
            });

    },[])


    if (show) return (<Navigate to="/YandexDisk"/>);
    return (
        <div id="container">
        </div>
    );
};

export default AuthorizePage;