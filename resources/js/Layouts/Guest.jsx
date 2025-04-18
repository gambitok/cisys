import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/inertia-react';

export default function Guest({ children, siteLogo }) {
    return (
        <div className="min-h-screen login-img flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100" style={{padding: "40px 0px"}}>
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" siteLogo={siteLogo} />
                </Link>
            </div>

            <div className="guest-form w-full sm:max-w-md mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
