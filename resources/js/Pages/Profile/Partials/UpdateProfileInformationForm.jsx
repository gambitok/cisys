import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const { flash } = usePage().props;
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        id: user.id,
        api_key: user.api_key,
        name: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        work_email: user.work_email,
        username: user.username,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    function checkRequestPeddingVeryfiy(type,email_track) {
        var email_track = JSON.parse(email_track);

        if (email_track != null && type in email_track){
            if ((Date.now() /1000 |0) > email_track[type].before_verify) {
                return 'This request change email has been expired '+email_track[type].email+'!';
            } else {
                return 'Can you check email '+email_track[type].email+' verify after change in profile this mail is valid only 24 hours!';
            }
        } else {
            return '';
        }
    }

    function copyGenreateKey(){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(data.api_key).select();
        document.execCommand("copy");
        $temp.remove();
        $("#genreate-key-success").html('Copyed Clipboard PAT!');
        $("#genreate-key-success").show();
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                <div className="flex items-center">
                    {flash?.status && (
                        <p className="text-sm text-green-600">{flash.status}</p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        autoComplete="name"
                        readOnly={true}
                        style={{backgroundColor: "#dcdcdc"}}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="firstname" value="Firstname" />

                    <TextInput
                        id="firstname"
                        className="mt-1 block w-full"
                        value={data.firstname}
                        onChange={(e) => setData('firstname', e.target.value)}
                        required
                        isFocused
                        autoComplete="firstname"
                    />

                    <InputError className="mt-2" message={errors.firstname} />
                </div>

                <div>
                    <InputLabel htmlFor="lastname" value="Lastname" />

                    <TextInput
                        id="lastname"
                        className="mt-1 block w-full"
                        value={data.lastname}
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                        isFocused
                        autoComplete="lastname"
                    />

                    <InputError className="mt-2" message={errors.lastname} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Personal Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                    {checkRequestPeddingVeryfiy('email',user.email_track)}
                </div>

                <div>
                    <InputLabel htmlFor="work_email" value="Work Email" />

                    <TextInput
                        id="work_email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.work_email}
                        onChange={(e) => setData('work_email', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.work_email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {data.id > 0 &&
                    (
                        <div className="mb-3">
                            <InputLabel htmlFor="genreate-key" value="Personal Access Token (PAT)" />
                            <TextInput
                                id="genreate-key"
                                value={data.api_key}
                                type="text"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                style={{ background: '#8080802b'}}
                                disabled
                            />
                            <div
                                className="btn btn-primary waves-effect waves-light"
                                onClick={copyGenreateKey}
                                style={{marginTop:"10px"}}
                            >
                                <i className='bi bi-clipboard2-pulse fs-6'></i> Copy PAT
                            </div>
                            <div className='alert alert-light' id='genreate-key-success' style={{display:"none"}}></div>

                        </div>
                    )
                }

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
    );
}
