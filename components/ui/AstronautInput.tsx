import React, { KeyboardEvent } from 'react';
import styles from './AstronautInput.module.css';

interface AstronautInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    disabled?: boolean;
    placeholder?: string;
}

const AstronautInput: React.FC<AstronautInputProps> = ({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Awaiting command..."
}) => {

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !disabled && value.trim()) {
            onSend();
        }
    };

    return (
        <div className={styles.InputContainer}>
            <input
                placeholder={placeholder}
                id="input"
                className={styles.input}
                name="text"
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                autoComplete="off"
            />
        </div>
    );
};

export default AstronautInput;
