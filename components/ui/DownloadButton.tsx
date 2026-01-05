import React, { useState } from 'react';
import styles from './DownloadButton.module.css';
import { Check } from 'lucide-react';

interface DownloadButtonProps {
    onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default label behavior if any
        if (!isChecked) {
            setIsChecked(true);
            onClick();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.label} onClick={handleClick}>
                <input
                    type="checkbox"
                    className={styles.input}
                    checked={isChecked}
                    readOnly
                />

                <span className={styles.circle}>
                    <svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V5m0 14-4-4m4 4 4-4" />
                    </svg>
                </span>

                <div className={styles.square}>
                    <Check className="w-5 h-5" />
                </div>

                <p className={styles.title}>Download</p>
            </div>
        </div>
    );
};

export default DownloadButton;
