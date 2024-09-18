import React, {Component, useState, useEffect} from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import './App.css';

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to manage settings modal

  return (
      <div className="app-container">
          <h1>Easy Kanban</h1>

        {/* Settings Button at the top right */}
        <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
          Settings
        </button>

        {/* Main Board */}
        <Board />

        {/* Render the Settings modal when it is open */}
        {isSettingsOpen && (
            <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
      </div>
  );
};

export default App;
