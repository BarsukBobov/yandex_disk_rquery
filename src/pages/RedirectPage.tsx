import React from 'react';


const RedirectPage = () => {
    window.onload = function() {
        // @ts-ignore
        window.YaSendSuggestToken("https://yaroscosh.ru", {
            flag: true
        });
    };

    return(<div></div>)
};

export default RedirectPage;