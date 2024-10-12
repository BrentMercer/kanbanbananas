import React from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, openCustomizeBoardModal }) => {
    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Settings</h2>

                <div className="settings-section">
                    <h3>Customize Board</h3>
                    <button onClick={openCustomizeBoardModal}>Customize Columns</button>
                </div>

                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
