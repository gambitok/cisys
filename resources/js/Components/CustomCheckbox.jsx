import React from 'react';

export default function Checkbox({ name, value, onChange, checked, disabled }) {
    return (
        <input
            type="checkbox"
            name={name}
            value={value}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={onChange}
            checked={checked}
            disabled={disabled}
        />
    );
}
