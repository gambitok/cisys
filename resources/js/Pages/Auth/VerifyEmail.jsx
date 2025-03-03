import React from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function VerifyEmail(props) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <Guest siteLogo={props.general_settings.site_icon}>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                link we just emailed to you? If you didn't receive the email, we will gladly send you another.
            </div>

            {props.status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

            {props.status === 'verification-link-error' && (
                <div className="mb-4 font-medium text-sm text-red-600">
                    Try again in 2 minutes.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <Button processing={processing}>Resend Verification Email</Button>

                    {/*<Link*/}
                    {/*    href={route('logout')}*/}
                    {/*    method="post"*/}
                    {/*    as="button"*/}
                    {/*    className="underline text-sm text-gray-600 hover:text-gray-900"*/}
                    {/*>*/}
                    {/*    Log Out*/}
                    {/*</Link>*/}
                </div>
            </form>
        </Guest>
    );
}
