import React from 'react';
import axios from "axios";

const AuthorizePage: React.FC = () => {
    console.log("pages")
    // async function authorize(){
    //     const response = await axios.get("https://oauth.yandex.ru/authorize?response_type=token&client_id=f1359fcaa1904779a36ea60f3820fc04")
    //     console.log(response)
    // }
    const authorize = () => {
        window.location.replace('https://oauth.yandex.ru/authorize?response_type=token&client_id=f1359fcaa1904779a36ea60f3820fc04');
    };
    return (
        <div>
            <button onClick={authorize}>authorize</button>
        </div>
    );
};

export default AuthorizePage;