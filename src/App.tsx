import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import './assets/_scss.scss';
import NotFound from "./pages/NotFound.js";
import Hybrid from "./Hybrid.js";
// import Explore from "./pages/Explore.js";
import Header from "./components/Header.js";

function App() {
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '');

  useEffect(() => {
    const pageDiv = document.getElementById('page');
    if (pageDiv && currentPath) {
      pageDiv.classList.add(currentPath);
    }

    return () => {
      if (pageDiv && currentPath) {
        pageDiv.classList.remove(currentPath);
      } 
    };
  }, [currentPath]);

  return (
    <div className="App">
      <div id="page">
      <Header/>
      <div id="middle-loading-container">
        <div className='l'></div>
        <div className='r'></div>
      </div>
      <Routes>
          <Route path="/" element={<Hybrid />} />
          {/* <Route path="/explore" element={<Explore />} /> */}
          <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
