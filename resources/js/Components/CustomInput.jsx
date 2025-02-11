import { forwardRef, useEffect, useRef } from 'react';
import './CustomInput.css'; // Importing the CSS file for custom styles

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={`input-box ${className}`} // Applying the custom input-box class
            ref={input}
        />
    );
});
