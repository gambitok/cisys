import React,{ useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, usePage, Link, useForm } from '@inertiajs/inertia-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function Edit(props) {
    
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };
    
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Profile'}
            headtitle={'Edit Profile'}
        >

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="p-4 sm:p-8 bg-gray-50 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={props.mustVerifyEmail}
                            status={props.status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        {/* <UpdatePasswordForm 
                        mustVerifyEmail={props.mustVerifyEmail}
                        status={props.status}
                        className="max-w-xl" /> */}


                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                            </header>

                            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="current_password" value="Current Password" />

                                    <TextInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                    />

                                    <InputError message={errors.current_password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="New Password" />

                                    <TextInput
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                                    <TextInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />

                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>

                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg" style={{display:"none"}}>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
