import React from 'react';
import {Navigate} from 'react-router-dom'
import AuthorizePage from "./AuthorizePage";
const HomePage = () => {
    return(<Navigate to="/login"/>)
};

export default HomePage;