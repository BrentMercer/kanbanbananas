import React, {Component, useState, useEffect} from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import './App.css';


const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to manage settings modal

  return (
      <div className="app-container">
          <div className="header-section">
              <h1>Easy Kanban</h1>
              <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
                  Settings
              </button>
              <Board />
              {isSettingsOpen && (
                  <SettingsModal onClose={() => setIsSettingsOpen(false)} />
              )}
          </div>
      </div>
  );
};

export default App;
