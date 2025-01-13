import React,{useRef} from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, useForm } from '@inertiajs/inertia-react';
import ReCAPTCHA from "react-google-recaptcha"; 
import config from '../../config';

export default function ForgotPassword(props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        'g-recaptcha-response': '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const captcha = useRef(null);

    const submit = (e) => {
        captcha.current.reset();

        e.preventDefault();

        post(route('password.email'));
    };

    const onChangeRecaptcha = (value) => {
        setData({
            ...data,
            'g-recaptcha-response': value,
        });
    }

    return (
        <Guest siteLogo={props.general_settings.site_icon}>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-500 leading-normal">
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
            </div>

            {props.status && <div className="mb-4 font-medium text-sm text-green-600">{props.status}</div>}

            <ValidationErrors errors={errors} />

            <form onSubmit={submit}>
                <Input
                    type="text"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    handleChange={onHandleChange}
                />

                <div className='mt-3' style={{textAlign: "-webkit-center"}}>
                    <ReCAPTCHA
                        sitekey={config.RECAPTCHA_SITEKEY}
                        ref={captcha}
                        onChange={onChangeRecaptcha}
                    />
                </div>

                <div className="flex items-center justify-center mt-4">
                    <Button processing={processing}>
                        Email Password Reset Link
                    </Button>
                </div>
            </form>
        </Guest>
    );
}
