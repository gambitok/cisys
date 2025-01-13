import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={
                active
                    ? 'list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out active'
                    : 'list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out'
            }
        >
            {children}
        </Link>
    );
}
