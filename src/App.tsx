import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import YandexDiskPage from "./pages/YandexDiskPage";
import AuthorizePage from "./pages/AuthorizePage";
import "bootstrap/dist/css/bootstrap.min.css";
import RedirectPage from "./pages/RedirectPage";

function App() {

  return (
      <Routes>
        <Route path ="/login" element={<AuthorizePage/>}/>
          <Route path ="/redirect" element={<RedirectPage/>}/>
        <Route path ="/YandexDisk" element={<YandexDiskPage/>}/>
        <Route path="*" element={<AuthorizePage />} />

      </Routes>
  );
}

export default App;
