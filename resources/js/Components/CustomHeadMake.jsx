import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';

export default function CustomHeadMake({ auth, title }) {
    console.log()
    return (
        <Head title={(auth.user.name+ ' - ' +title).toUpperCase()} />
    );
}
