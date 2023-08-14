import React, {useEffect, useState} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {Navigate} from "react-router-dom";
import {useActions} from "../hooks/useActions";

const RedirectPage = () => {
    const [error, SetError]=useState(false)
    const {token} = useTypedSelector(state=>state.login)
    const {login} = useActions()

    useEffect(()=> {
        console.log(token)
        const hash=window.location.hash
        if (!hash) {
            SetError(true)
            return
        }
        const f_i=hash.indexOf("=")
        const s_i=hash.indexOf("&")
        let url_token=hash.slice(f_i+1, s_i)
        login(url_token)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    if (token) return(<Navigate to="/YandexDisk"/>)
    if (error) return(<Navigate to="/login"/>)


    return(<div></div>)
};

export default RedirectPage;