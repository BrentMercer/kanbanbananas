import React, { useState } from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import './App.css';
import { jsPDF } from 'jspdf';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [columns, setColumns] = useState([]);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const generateReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Task Report', 10, 10);

        const date = new Date();
        doc.setFontSize(12);
        doc.text(`Generated on: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 10, 20);

        let yPosition = 30;

        columns.forEach((column) => {
            doc.setFontSize(14);
            doc.text(`Column: ${column.title}`, 10, yPosition);
            yPosition += 10;

            column.tasks.forEach((task, index) => {
                doc.setFontSize(12);
                doc.text(`${index + 1}. Title: ${task.title}`, 10, yPosition);
                yPosition += 5;
                doc.text(`   Details: ${task.details}`, 10, yPosition);
                yPosition += 10;
            });

            yPosition += 10;
        });

        doc.save('task_report.pdf');
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

                    <button className="reports-button" onClick={generateReport}>
                        Generate Report
                    </button>
                </div>

                {isSettingsOpen && (
                    <SettingsModal onClose={() => setIsSettingsOpen(false)} />
                )}
            </header>

            <Board searchText={searchText} onColumnsFetched={setColumns} />
        </div>
    );
};

export default App;
