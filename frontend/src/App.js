import React, { useEffect, useState } from "react";
import Board from './components/Board';
import SettingsModal from "./components/SettingsModal";
import CustomizeColumnsModal from "./components/CustomizeColumnsModal";
import './App.css';
import { jsPDF } from 'jspdf';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = useState(false);
    const [columns, setColumns] = useState([]);
    const [timeForRefresh, setTimeForRefresh] = useState(0);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleModalClose = () => {
        setIsCustomizeColumnsOpen(false);
        setTimeForRefresh(prevKey => prevKey + 1);
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
            doc.text(`${column.title}`, 10, yPosition);
            yPosition += 10;

            column.tasks.forEach((task, index) => {
                doc.setFontSize(12);
                doc.text(`${index + 1}. ${task.title}`, 10, yPosition);
                yPosition += 5;
                doc.text(`   ${task.details}`, 10, yPosition);
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
                    <SettingsModal
                        onClose={() => setIsSettingsOpen(false)}
                        openCustomizeBoardModal={() => setIsCustomizeColumnsOpen(true)}
                    />
                )}
                {isCustomizeColumnsOpen && (
                    <CustomizeColumnsModal
                        columns={columns}
                        setColumns={setColumns}
                        onClose={handleModalClose}
                    />
                )}
            </header>

            <Board searchText={searchText} onColumnsFetched={setColumns} />
        </div>
    );
};

export default App;
