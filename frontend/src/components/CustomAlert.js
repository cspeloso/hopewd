import React from 'react';
import '../css/CustomAlert.css';

const CustomAlert = ({ title, message, showSpinner, onClose, onConfirm, confirmText, cancelText }) => {
    const handleOverlayClick = (e) => {
        if (e.target.className === 'custom-alert-overlay' && onClose) {
            onClose();
        }
    };

    return (
        <div className="custom-alert-overlay" onClick={handleOverlayClick}>
            <div className="custom-alert">
                <h3>{title}</h3>
                <p>{message}</p>
                {showSpinner && <div className="spinner"></div>} {/* Spinner added */}
                {onConfirm && onClose && (
                    <div className="alert-buttons">
                        <button className="alert-button cancel" onClick={onClose}>
                            {cancelText || 'Cancel'}
                        </button>
                        <button className="alert-button confirm" onClick={onConfirm}>
                            {confirmText || 'Confirm'}
                        </button>
                    </div>
                )}
                {!onConfirm && onClose && (
                    <button className="alert-button" onClick={onClose}>
                        OK
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomAlert;