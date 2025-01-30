import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import ScreenData from '@/Components/ScreenData';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import $ from 'jquery';


export default function Form({ data,errors,setData }) {
    // const information_display = ['IP address', 'User Name', 'Computer Name', 'OS Info', 'Device ID', 'Group'];

    /* const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("info_checks", [...data.info_checks, id])
        : setData(
            "info_checks",
            data.info_checks.filter((item) => {
                return item !== id;
            })
        );
    }; */

    /* function checkboxvaluechecked(permission_id) {
       return (data.info_checks.indexOf(permission_id) > -1);
    } */

    function screenCick(plus){
        const newData = { ...data };
        if (plus) {
            newData.screen = data.screen + 1;
        } else {
            if (data.screen > 1) {
              newData.screen = data.screen - 1;
            }
        }
        newData.screenselect = newData.screen;
        setData(newData);
    }

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    function updateDataTab(tab_id) {
        setData('screenselect',tab_id);
    }

    function loadField(){

        var html = '';

        /* html += '<div className="col-md-4"><div className="mb-3">';
            html += '<InputLabel htmlFor="banner_height" value="Banner Height (px)" />';
                html += '<TextInput id="banner_height" onChange={(e) => setData("banner_height", e.target.value)} type="number" className="mt-1 block w-full form-control" autoComplete="current-banner_height" placeholder="Banner Height (px)" />';
            html += '</div>';
        html += '</div>'; */

        /* const root = ReactDOM.createRoot(
            document.getElementById('screen-data')
        );
        const element = <h1>Hello, world</h1>;
        root.render(element); */

        // $('#screen-data').html('<InputLabel htmlFor="remark" value="Remark" />');
    }

    /* const optionChanged = value => {
        alert(value.value)

        setData("screenselect",value.value);
    }; */
    /* const optionChanged(e) {
        alert(e.value);
        // this.setState({ id: e.value, name: e.label });
    } */

    /* if (data.screen) {
        for (let i = 1; i <= data.screen; i++) {
            const newData = { ...data };
            console.log(newData)
            // if (plus) {
            //     newData.screen = data.screen + 1;
            // } else {
            //     if (data.screen > 1) {
            //         newData.screen = data.screen - 1;
            //     }
            // }
            // newData.screenselect = newData.screen;

            setData(newData);
        }
    } */

    return (
       <div>

            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Setting Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="current-name"
                            placeholder="Setting Name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="remark" value="Remark" />
                        <TextInput
                            id="remark"
                            value={data.remark}
                            onChange={(e) => setData('remark', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="current-remark"
                            placeholder="Remark"
                        />
                        <InputError message={errors.remark} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className='row g-3 my-2' style={{display: "none"}}>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="screen" value="Screen#" />
                        <div style={{display: "inline"}}>

                            <select class="form-select form-select mb-3" id="screen" name='screenselect' style={{width: "50%",display: "inline-block"}} onChange={updateData}>
                                {Array.from(
                                    Array(data.screen), (v,i) =>
                                        <option value={i+1} selected={data.screenselect === i + 1}>Screen #{i+1}</option>
                                )}
                            </select>

                            <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)' onClick={()=>screenCick(1)} style={{display: "inline-block",marginLeft: "20px",padding: "0px 10px"}}>
                                <i className="bi bi-plus-lg" style={{fontSize: "25px"}}></i>
                            </a>

                            <a className="btn btn-danger waves-effect waves-light" href='javascript:void(0)' onClick={()=>screenCick(0)} style={{display: "inline-block",marginLeft: "20px",padding: "0px 10px"}}>
                                <i className="bi bi-dash-lg" style={{fontSize: "25px"}}></i>
                            </a>

                        </div>
                    </div>

                </div>
            </div>

            <div className='row g-3 my-2'>
                <div className='col-md-12'>
                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            {Array.from(
                                Array(data.screen), (v,i) =>
                                    <button className={data.screenselect === i + 1 ? 'nav-link active' : 'nav-link'} id={'nav-tab'+(i+1)} data-bs-toggle="tab" type="button" onClick={()=>updateDataTab(i+1)}>
                                        Screen #{i+1}
                                    </button>
                            )}

                            <button className='nav-link' id='nav-tab-plus' data-bs-toggle="tab" type="button" onClick={()=>screenCick(1)}>
                                <i className="bi bi-plus-lg" style={{fontSize: "25px"}}></i>
                            </button>

                            <button className='nav-link' id='nav-tab-minus' data-bs-toggle="tab" type="button" onClick={()=>screenCick(0)}>
                                <i className="bi bi-dash-lg" style={{fontSize: "25px"}}></i>
                            </button>

                        </div>
                    </nav>
                </div>
            </div>

            {/* <hr /> */}

            <div id='screen-data'>

                {/* {loadField()} */}

                <ScreenData data={data} errors={errors} setData={setData}  />

                {/* <div className='row g-3 my-2'>
                    <div className='col-md-6'>

                        <div className='row'>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="banner_height" value="Banner Height (px)" />
                                    <TextInput
                                        id="banner_height"
                                        value={data.banner_height}
                                        onChange={(e) => setData('banner_height', e.target.value)}
                                        type="number"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-banner_height"
                                        placeholder="Banner Height (px)"
                                    />

                                </div>
                            </div>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="banner_border" value="Banner Border (px)" />
                                    <TextInput
                                        id="banner_border"
                                        value={data.banner_border}
                                        onChange={(e) => setData('banner_border', e.target.value)}
                                        type="number"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-banner_border"
                                        placeholder="Banner Height (px)"
                                    />
                                    <InputError message={errors.banner_border} className="mt-2" />
                                </div>
                            </div>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="banner_color" value="Banner Color" />
                                    <TextInput
                                        id="banner_color"
                                        value={data.banner_color}
                                        onChange={(e) => setData('banner_color', e.target.value)}
                                        type="color"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-banner_color"
                                        placeholder="Banner Color"
                                    />
                                    <InputError message={errors.banner_color} className="mt-2" />
                                </div>
                            </div>

                        </div>

                        <div className='row'>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="center_text" value="Center Text" />
                                    <TextInput
                                        id="center_text"
                                        value={data.center_text}
                                        onChange={(e) => setData('center_text', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-center_text"
                                        placeholder="Center Text"
                                    />
                                    <InputError message={errors.center_text} className="mt-2" />
                                </div>
                            </div>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="right_text" value="Right text" />
                                    <TextInput
                                        id="right_text"
                                        value={data.right_text}
                                        onChange={(e) => setData('right_text', e.target.value)}
                                        type="text"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-right_text"
                                        placeholder="Right text"
                                    />
                                    <InputError message={errors.right_text} className="mt-2" />
                                </div>
                            </div>

                            <div className='col-md-4'>
                                <div className="mb-3">
                                    <InputLabel htmlFor="text_color" value="Text Color" />
                                    <TextInput
                                        id="text_color"
                                        value={data.text_color}
                                        onChange={(e) => setData('text_color', e.target.value)}
                                        type="color"
                                        className="mt-1 block w-full form-control"
                                        autoComplete="current-text_color"
                                        placeholder="Text Color"
                                    />
                                    <InputError message={errors.text_color} className="mt-2" />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='col-md-6'>

                        <InputLabel value="Computer Information Display" />

                        <div className='row g-3 my-2'>
                            {information_display.map((item) => (

                                <label className="flex items-center">
                                    <Checkbox name="info_checks[]" value={item} handleChange={handleChange} checked={checkboxvaluechecked(item)} />
                                    <span className="ml-2 text-sm text-gray-600">{item}</span>
                                </label>

                            ))}
                        </div>

                    </div>
                </div>

                <div className='row g-3 my-2'>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <InputLabel htmlFor="alarm_code" value="Alarm code" />
                            <TextInput
                                id="alarm_code"
                                value={data.alarm_code}
                                onChange={(e) => setData('alarm_code', e.target.value)}
                                type="number"
                                className="mt-1 block w-full form-control"
                                autoComplete="current-alarm_code"
                                placeholder="Alarm code"
                            />
                            <InputError message={errors.alarm_code} className="mt-2" />
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <InputLabel htmlFor="alarm_message" value="Alarm message" />
                            <TextInput
                                id="alarm_message"
                                value={data.alarm_message}
                                onChange={(e) => setData('alarm_message', e.target.value)}
                                type="text"
                                className="mt-1 block w-full form-control"
                                autoComplete="current-alarm_message"
                                placeholder="Alarm message"
                            />
                            <InputError message={errors.alarm_message} className="mt-2" />
                        </div>
                    </div>
                </div> */}

            </div>

            <hr />

            <div className="mt-4 formsubmitbutton">
                <button
                    type="submit"
                    className="btn btn-success waves-effect waves-light"
                >
                    Save
                </button>

                <Link
                    className="btn btn-primary waves-effect waves-light"
                    href={route("settings.index")}
                >
                    Back
                </Link>

            </div>

       </div>
    );
}
