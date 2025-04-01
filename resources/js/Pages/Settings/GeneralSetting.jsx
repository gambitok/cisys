import React,{useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Toggle from 'react-bootstrap-toggle';

export default function Create(props) {

    const [tab, setTab] = useState('nav-tab-gen');

    const { data, setData, errors, post } = useForm({
        "company_name": props.company_name?.value || "",
        "application_name": props.application_name?.value || "",
        "format_date": props.format_date?.value || "",
        "currency": props.currency?.value || "",
        "site_icon": props.site_icon?.value || "",
        "site_logo": props.site_logo?.value || "",
        "fav_icon": props.fav_icon?.value || "",
        "stripe_status": props.stripe_status?.value || "",
        "stripe_env": props.stripe_env?.value || "",
        "test_publickey": props.test_publickey?.value || "",
        "test_secretkey": props.test_secretkey?.value || "",
        "live_publickey": props.live_publickey?.value || "",
        "live_secretkey": props.live_secretkey?.value || "",
        "paypal_status": props.paypal_status?.value || "",
        "paypal_env": props.paypal_env?.value || "",
        "test_publickey_paypal": props.test_publickey_paypal?.value || "",
        "test_secretkey_paypal": props.test_secretkey_paypal?.value || "",
        "live_publickey_paypal": props.live_publickey_paypal?.value || "",
        "live_secretkey_paypal": props.live_secretkey_paypal?.value || "",
        "header_script": props.header_script?.value || "",
        "footer_script": props.footer_script?.value || "",
    });

    const optionChanged = value => {
        setData("format_date",value.value);
    };

    const optionChangedstripe = value => {
        setData("stripe_env",value.value);
    };

    const optionChangedpaypal = value => {
        setData("paypal_env",value.value);
    };

    // const typevalstripe = props.stripe_env.find(obj => {
    //     return obj.value === data.stripe_env;
    // });
    const typeval = props.formates.find(obj => {
        return obj.value === data.format_date;
    });
    // const typevalpaypal = props.paypal_env.find(obj => {
    //     return obj.value === data.paypal_env;
    // });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("setting.general.store"));
    }

    function screenCick(data){
        setTab(data);
    }

    function onToggle() {
        setData("stripe_status",!data.stripe_status);
    }

    function onTogglestr() {
        setData("stripe_env",!data.stripe_env);
    }

    function onTogglepay() {
        setData("paypal_status",!data.paypal_status);
    }
    function onTogglepayenv() {
        setData("paypal_env",!data.paypal_env);
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'General setting'}
            headtitle={'General setting'}
        >

            <form name="createForm" onSubmit={handleSubmit}>

                <div className='row g-3 my-2'>
                    <div className='col-md-12'>
                        <nav>
                            {window.innerWidth < 768 ? (
                                <select className="form-select" onChange={(e) => screenCick(e.target.value)}>
                                    <option value="nav-tab-gen">▼ General</option>
                                    <option value="nav-tab-stripe">▼ Stripe Payment Gateway</option>
                                    <option value="nav-tab-paypal">▼ Paypal Payment Gateway</option>
                                    <option value="nav-tab-scripts">▼ Scripts</option>
                                </select>
                            ) : (
                                <div className="nav nav-tabs tab-buttons" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-tab-gen" data-bs-toggle="tab" type="button" onClick={() => screenCick('nav-tab-gen')}>
                                        General
                                    </button>
                                    <button className="nav-link" id="nav-tab-stripe" data-bs-toggle="tab" type="button" onClick={() => screenCick('nav-tab-stripe')}>
                                        Stripe Payment Gateway
                                    </button>
                                    <button className="nav-link" id="nav-tab-paypal" data-bs-toggle="tab" type="button" onClick={() => screenCick('nav-tab-paypal')}>
                                        Paypal Payment Gateway
                                    </button>
                                    <button className="nav-link" id="nav-tab-scripts" data-bs-toggle="tab" type="button" onClick={() => screenCick('nav-tab-scripts')}>
                                        Scripts
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>

                    <div style={{display: tab=='nav-tab-gen' ? "":"none"}}>
                        <div className='row g-3 my-2'>
                            <div className='col-md-3'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="company_name" value="Company name" />
                                    <TextInput
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Company name"
                                    />
                                    <InputError message={errors.company_name} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="application_name" value="Application name" />
                                    <TextInput
                                        id="application_name"
                                        value={data.application_name}
                                        onChange={(e) => setData('application_name', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Application name"
                                    />
                                    <InputError message={errors.application_name} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="currency" value="Currency" />
                                    <TextInput
                                        id="currency"
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Currency"
                                    />
                                    <InputError message={errors.currency} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <div className="mb-3">
                                    <InputLabel value="Date Format" />
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={typeval}
                                        name="format_date"
                                        options={props.formates}
                                        onChange={optionChanged}
                                        styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                                    />
                                    <InputError message={errors.date_format} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className='row g-3 my-2'>
                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="site_icon" value="Site icon" />

                                    <TextInput
                                        id="site_icon"
                                        onChange={(e) =>
                                            setData("site_icon", e.target.files[0])
                                        }
                                        type="file"
                                        name="site_icon"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder=""
                                        label="File"
                                    />

                                    <img src={data.site_icon} style={{ width: '100px', marginTop : '10px' }} alt="" srcset="" />

                                    <InputError message={errors.site_icon} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="site_logo" value="Site logo" />

                                    <TextInput
                                        id="site_logo"
                                        onChange={(e) =>
                                            setData("site_logo", e.target.files[0])
                                        }
                                        type="file"
                                        name="site_logo"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder=""
                                        label="File"
                                    />

                                    <img src={data.site_logo} style={{ width: '100px', marginTop: '10px' }} alt="" srcset="" />

                                    <InputError message={errors.site_logo} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="fav_icon" value="Fav icon" />

                                    <TextInput
                                        id="fav_icon"
                                        onChange={(e) =>
                                            setData("fav_icon", e.target.files[0])
                                        }
                                        type="file"
                                        name="fav_icon"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder=""
                                        label="File"
                                    />

                                    <img src={data.fav_icon} style={{ width: '100px', marginTop: '10px' }} alt="" srcset="" />

                                    <InputError message={errors.fav_icon} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{display: tab=='nav-tab-stripe' ? "":"none"}}>
                        <div className='row g-3 my-2'>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel value="Active" />

                                    <Toggle
                                        onClick={onToggle}
                                        on={<span>Yes</span>}
                                        off={<span>No</span>}
                                        size="xs"
                                        offstyle="danger"
                                        active={data.stripe_status}
                                        width="80px"
                                        height="40px"
                                    />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel value="Environment" />
                                    {/* <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={typevalstripe}
                                        name="stripe_env"
                                        options={props.stripe_env}
                                        onChange={optionChangedstripe}
                                        /> */}
                                        <Toggle
                                        onClick={onTogglestr}
                                        on={<span>Test</span>}
                                        off={<span>Live</span>}
                                        size="xs"
                                        offstyle="danger"
                                        active={data.stripe_env}
                                        width="80px"
                                        height="40px"
                                    />
                                    <InputError message={errors.stripe_env} className="mt-2" />
                                </div>
                            </div>

                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="test_publickey" value="Test Public Key" />
                                    <TextInput
                                        id="test_publickey"
                                        value={data.test_publickey}
                                        onChange={(e) => setData('test_publickey', e.target.value)}
                                        type="text"
                                        name="test_publickey"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Test Public Key"
                                    />
                                    <InputError message={errors.test_publickey} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="test_secretkey" value="Test Secret Key" />
                                    <TextInput
                                        id="test_secretkey"
                                        value={data.test_secretkey}
                                        onChange={(e) => setData('test_secretkey', e.target.value)}
                                        type="text"
                                        name="test_secretkey"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Test Secret Key"
                                    />
                                    <InputError message={errors.test_secretkey} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="live_publickey" value="Live Public Key" />
                                    <TextInput
                                        id="live_publickey"
                                        value={data.live_publickey}
                                        onChange={(e) => setData('live_publickey', e.target.value)}
                                        type="text"
                                        name="live_publickey"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Live Public Key"
                                    />
                                    <InputError message={errors.live_publickey} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="live_secretkey" value="Live Secret Key" />
                                    <TextInput
                                        id="live_secretkey"
                                        value={data.live_secretkey}
                                        onChange={(e) => setData('live_secretkey', e.target.value)}
                                        type="text"
                                        name="live_secretkey"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Live Secret Key"
                                    />
                                    <InputError message={errors.live_secretkey} className="mt-2" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div style={{display: tab=='nav-tab-paypal' ? "":"none"}}>
                        <div className='row g-3 my-2'>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel value="Active" />

                                    <Toggle
                                        onClick={onTogglepay}
                                        on={<span>Yes</span>}
                                        off={<span>No</span>}
                                        size="xs"
                                        offstyle="danger"
                                        active={data.paypal_status}
                                        width="80px"
                                        height="40px"
                                    />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel value="Environment" />
                                    {/* <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={typevalpaypal}
                                        name="paypal_env"
                                        options={props.paypal_env}
                                        onChange={optionChangedpaypal}
                                        /> */}

                                    <Toggle
                                        onClick={onTogglepayenv}
                                        on={<span>Test</span>}
                                        off={<span>Live</span>}
                                        size="xs"
                                        offstyle="danger"
                                        active={data.paypal_env}
                                        width="80px"
                                        height="40px"
                                    />
                                    <InputError message={errors.paypal_env} className="mt-2" />
                                </div>
                            </div>

                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="test_publickey_paypal" value="Test Public Key" />
                                    <TextInput
                                        id="test_publickey_paypal"
                                        value={data.test_publickey_paypal}
                                        onChange={(e) => setData('test_publickey_paypal', e.target.value)}
                                        type="text"
                                        name="test_publickey_paypal"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Test Public Key"
                                    />
                                    <InputError message={errors.test_publickey_paypal} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="test_secretkey_paypal" value="Test Secret Key" />
                                    <TextInput
                                        id="test_secretkey_paypal"
                                        value={data.test_secretkey_paypal}
                                        onChange={(e) => setData('test_secretkey_paypal', e.target.value)}
                                        type="text"                                                 name="test_secretkey_paypal"

                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Test Secret Key"
                                    />
                                    <InputError message={errors.test_secretkey_paypal} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="live_publickey_paypal" value="Live Public Key" />
                                    <TextInput
                                        id="live_publickey_paypal"
                                        value={data.live_publickey_paypal}
                                        onChange={(e) => setData('live_publickey_paypal', e.target.value)}
                                        type="text"
                                        name="live_publickey_paypal"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Live Public Key"
                                    />
                                    <InputError message={errors.live_publickey_paypal} className="mt-2" />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="live_secretkey_paypal" value="Live Secret Key" />
                                    <TextInput
                                        id="live_secretkey_paypal"
                                        value={data.live_secretkey_paypal}
                                        onChange={(e) => setData('live_secretkey_paypal', e.target.value)}
                                        type="text"
                                        name="live_secretkey_paypal"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="false"
                                        placeholder="Live Secret Key"
                                    />
                                    <InputError message={errors.live_secretkey_paypal} className="mt-2" />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div style={{display: tab=='nav-tab-scripts' ? "":"none"}}>
                        <div className='row g-3 my-2'>
                            <div className='col-md-12'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="header_script" value="Header" />
                                    <textarea class="form-control" id="header_script" rows="20" onChange={(e) => setData('header_script', e.target.value)}>{data.header_script}</textarea>
                                    <InputError message={errors.header_script} className="mt-2" />

                                </div>
                            </div>
                        </div>

                        <div className='row g-3 my-2'>
                            <div className='col-md-12'>
                                <div className="mb-6">
                                    <InputLabel htmlFor="footer_script" value="Footer" />
                                    <textarea class="form-control" id="footer_script" rows="20" onChange={(e) => setData('footer_script', e.target.value)}>{data.footer_script}</textarea>
                                    <InputError message={errors.footer_script} className="mt-2" />

                                </div>
                            </div>
                        </div>

                    </div>

                    {RoleManageArray.roles['general-setting'] == 2 && (<div className="mt-4 formsubmitbutton">
                        <button
                            type="submit"
                            className="btn btn-success waves-effect waves-light"
                        >
                            Save
                        </button>
                    </div>)}

            </form>

        </Authenticated>
    );
}
