import React from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, openCustomizeBoardModal }) => {
    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Settings</h2>

                {/* Manage Boards Section */}
                <div className="settings-section">
                    <h3>Manage Boards</h3>
                    <p>Board management options will go here.</p>
                </div>

                {/* Customize Board Section */}
                <div className="settings-section">
                    <h3>Customize Board</h3>
                    <button onClick={openCustomizeBoardModal}>Customize Columns</button>
                </div>

                {/* Manage Accounts Section */}
                <div className="settings-section">
                    <h3>Manage Account</h3>
                    <p>Account management options (e.g., change password, update profile) will go here.</p>
                </div>

                {/* Close button */}
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;