import React, { useEffect,useRef } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import ReCAPTCHA from "react-google-recaptcha";
import config from '../../config';
import Checkbox from '@/Components/Checkbox';

export default function Register(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        work_email: '',
        password: '',
        password_confirmation: '',
        privacy_policy: '',
        'g-recaptcha-response': '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const captcha = useRef(null);

    const submit = (e) => {
        captcha.current.reset();
        e.preventDefault();
        post(route('register'));
    };

    const onChangeRecaptcha = (value) => {
        setData({
            ...data,
            'g-recaptcha-response': value,
        });
    }

    return (
        <Guest siteLogo={props.general_settings.site_icon}>
            <Head title="Register" />

            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <div>
                    <Label forInput="name" value="Username" required />

                    <Input
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="email" value="Personal Email" required />

                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="work_email" value="Work Email" />

                    <Input
                        type="email"
                        name="work_email"
                        value={data.work_email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value="Password" required />

                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={onHandleChange}

                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password_confirmation" value="Confirm Password" required />

                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <label className="flex items-center">
                        <Checkbox name="privacy_policy" value={data.privacy_policy} handleChange={onHandleChange} />

                        <span className="ml-2 text-sm text-gray-600">I have read and agree to the Privacy Policy</span>
                    </label>
                </div>

                <div className='mt-3' style={{textAlign: "-webkit-center"}}>
                    <ReCAPTCHA
                        sitekey={config.RECAPTCHA_SITEKEY}
                        ref={captcha}
                        onChange={onChangeRecaptcha}
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900">
                        Already registered?
                    </Link>

                    <Button className="ml-4" processing={processing}>
                        Register
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
