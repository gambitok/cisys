import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function NavDropdownLink({ onClick, active, children, open }) {
    
    return (
        <a
            onClick={onClick}
            className={
                active
                    ? 'list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out dropdownCustomLink active'
                    : 'list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out dropdownCustomLink'
            }
        >
            {children}
            <span className='caretIcon'>
                {open == false &&
                    <i className="bi bi-caret-right-fill"></i>
                }
                {open == true &&
                    <i className="bi bi-caret-down-fill"></i>
                }
            </span>
        </a>
    );
}
