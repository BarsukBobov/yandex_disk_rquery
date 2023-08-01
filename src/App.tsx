import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import YandexDiskPage from "./pages/YandexDiskPage";
import AuthorizePage from "./pages/AuthorizePage";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {

  return (
      <Routes>
        <Route path ="/" element={<HomePage />} />
        <Route path ="/login" element={<AuthorizePage/>}/>
        <Route path ="/private" element={<YandexDiskPage/>}/>
        <Route path="*" element={<HomePage />} />
      </Routes>
  );
}

export default App;
