import React, { KeyboardEvent } from 'react';
import { Send, Upload } from 'lucide-react'; // Using standard icons we already have
import styles from './AnimatedInput.module.css';

interface AnimatedInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    disabled?: boolean;
    placeholder?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Search..."
}) => {

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !disabled && value.trim()) {
            onSend();
        }
    };

    return (
        <div className={styles.container}>
            {/* The background layers */}
            <div className={styles.glow} />
            <div className={styles.darkBorderBg} />
            <div className={styles.darkBorderBg} />
            <div className={styles.darkBorderBg} />
            <div className={styles.white} />
            <div className={styles.border} />

            <div className={styles.main}>
                <input
                    placeholder={placeholder}
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className={styles.input}
                />

                {/* Masks */}
                <div className={styles.inputMask} />
                <div className={styles.pinkMask} />

                {/* Search Icon (Left) */}
                <div className={styles.searchIcon}>
                    {/* Using our Upload/Scan icon looks generic, let's stick to the SVG from request or use Lucide? 
                        The request had a specific SVG with gradients. Let's use that for fidelity. */}
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={24} fill="none" className="feather feather-search">
                        <circle stroke="url(#search)" r={8} cy={11} cx={11} />
                        <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
                        <defs>
                            <linearGradient gradientTransform="rotate(50)" id="search">
                                <stop stopColor="#f8e7f8" offset="0%" />
                                <stop stopColor="#b6a9b7" offset="50%" />
                            </linearGradient>
                            <linearGradient id="searchl">
                                <stop stopColor="#b6a9b7" offset="0%" />
                                <stop stopColor="#837484" offset="50%" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Filter/Send Icon (Right) */}
                <div className={styles.filterBorder} />

                <div
                    id="filter-icon"
                    className={styles.filterIcon}
                    onClick={() => !disabled && value.trim() && onSend()}
                >
                    {/* Using the Send icon here instead of the filter icon from the snippet, as this is a chat input */}
                    <Send className="w-5 h-5 text-gray-300" />
                </div>
            </div>
        </div>
    );
};

export default AnimatedInput;
