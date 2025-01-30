import React, { useEffect, useRef } from 'react';
import Button from '@/Components/Button';
import Checkbox from '@/Components/Checkbox';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import ReCAPTCHA from "react-google-recaptcha";
import config from '../../config';

export default function Login(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
        'g-recaptcha-response': '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const captcha = useRef(null);

    const submit = (e) => {
        if (captcha.current) {
            captcha.current.reset();
        }
        e.preventDefault();
        post(route('login'));
    };

    const onChangeRecaptcha = (value) => {
        setData({
            ...data,
            'g-recaptcha-response': value,
        });
    };

    const isLocal = process.env.NODE_ENV === 'development';

    return (
        <Guest siteLogo={props.general_settings.site_icon}>
            <Head title="LOG IN" />

            {props.status && <div className="mb-4 font-medium text-sm text-green-600">{props.status}</div>}

            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <a href={route('authlogin')} className="underline text-sm text-gray-600 hover:text-gray-900">
                    <img src='/social-login-google.png' style={{width: '50%',margin: '10px auto'}} />
                </a>

                <hr />

                <div style={{marginTop: "15px"}}>
                    <Label forInput="email" value="Email" />
                    <Input
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label forInput="password" value="Password" />
                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        handleChange={onHandleChange}
                    />
                </div>

                <div className="flex items-center justify-center mt-4">
                    <div className="block">
                        <label className="flex items-center">
                            <Checkbox name="remember" value={data.remember} handleChange={onHandleChange} />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;
                    {props.canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                {!isLocal && (
                    <div className='mt-3' style={{textAlign: "-webkit-center"}}>
                        <ReCAPTCHA
                            sitekey={config.RECAPTCHA_SITEKEY}
                            ref={captcha}
                            onChange={onChangeRecaptcha}
                        />
                    </div>
                )}

                <div className="flex items-center justify-center mt-3 mb-3">
                    <Button className="mx-4 bg-success" processing={processing} >
                        Sign in
                    </Button>
                    <Link
                        href={route('register')}
                        className={'inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 transition ease-in-out duration-150 false'}
                        style={{textDecoration: "none"}}
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </Guest>
    );
}

