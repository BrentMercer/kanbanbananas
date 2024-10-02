import React, {Component, useState, useEffect} from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import './App.css';


const App = () => {
    const [searchText, setSearchText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>Kanban Board</h1>
                <div className="search-settings">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />

                    <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
                        Settings
                    </button>
                </div>

                {isSettingsOpen && (
                    <SettingsModal onClose={() => setIsSettingsOpen(false)} />
                )}
            </header>

            <Board searchText={searchText} />
        </div>
    );
};

export default App;
