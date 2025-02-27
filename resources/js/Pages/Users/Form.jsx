import React, { useState } from 'react';
import Select from 'react-select';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Toggle from 'react-bootstrap-toggle';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Form({ data,errors,setData,roles }) {
    console.log("Selected Role ID:", data.role_id);
    const optionChanged = value => {
        setData("role_id",value.value);
    };

    const rolesval = roles.find(obj => {
        return obj.value === data.role_id;
    });

    function onToggle() {
        setData("status",!data.status);
    }

    function refreshKey(){
        $.ajax({
            url: route("user-genreate-key",data.user_id),
            success: function(result){
                $("#genreate-key-success").html('PAT generated successfully!');
                $("#genreate-key-success").show();
                setData("api_key",result);
            }
        });
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
       <>
        <div className='row g-3 my-2'>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        type="text"
                        className="mt-1 block w-full form-control"
                        autoComplete="current-name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
            </div>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="title" value="Title" />
                    <TextInput
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        type="text"
                        className="mt-1 block w-full form-control"
                        autoComplete="current-title"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>
            </div>
        </div>
        <div className='row g-3 my-2'>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="email" value="Personal Email" />
                    <TextInput
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        autoComplete="current-email"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>
            {/* <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="email" value="Personal Email" />
                    <TextInput
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        autoComplete="current-email"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div> */}
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="work_email" value="Work Email" />
                    <TextInput
                        id="work_email"
                        value={data.work_email}
                        onChange={(e) => setData('work_email', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        autoComplete="current-work_email"
                    />
                    <InputError message={errors.work_email} className="mt-2" />
                </div>
            </div>
        </div>
        <div className='row g-3 my-2'>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        type="text"
                        className="mt-1 block w-full form-control"
                        autoComplete="current-username"
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>
            </div>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel value="Role" />
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        value={rolesval}
                        name="role_id"
                        options={roles}
                        onChange={optionChanged}
                        styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                    />
                    <InputError message={errors.role_id} className="mt-2" />
                </div>
            </div>
        </div>
        <div className='row g-3 my-2'>
            <div className='col-md-6'>
                <div className="mb-3">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
            </div>
            {data.user_id > 0 &&
                (<div className='col-md-6'>
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
                            onClick={refreshKey}
                            style={{marginTop:"10px",marginRight:"10px"}}
                        >
                            <i className='bi bi-arrow-clockwise fs-6'></i> Re-Generate PAT
                        </div>
                        <div
                            className="btn btn-primary waves-effect waves-light"
                            onClick={copyGenreateKey}
                            style={{marginTop:"10px"}}
                        >
                            <i className='bi bi-clipboard2-pulse fs-6'></i> Copy PAT
                        </div>
                        <div className='alert alert-light' id='genreate-key-success' style={{display:"none"}}></div>

                    </div>
                </div>)
            }
        </div>
        <div className='row g-3 my-2'>
            <div className='col-md-6'>
                <div className="mt-4 formsubmitbutton">
                    <button
                        type="submit"
                        className="btn btn-success waves-effect waves-light"
                    >
                        Save
                    </button>
                    <Link
                        className="btn btn-primary waves-effect waves-light"
                        href={ route("users.index") }
                    >
                        Back
                    </Link>
                </div>
            </div>
            <div className='col-md-6'>
                <div className="mb-3" style={{float:"right"}}>
                    <InputLabel value="Active" />
                    <Toggle
                        onClick={onToggle}
                        on={<span>Yes</span>}
                        off={<span>No</span>}
                        size="xs"
                        offstyle="danger"
                        onstyle="success"
                        active={data.status}
                        width="80px"
                        height="40px"
                    />
                </div>
            </div>
        </div>
       </>
    );
}
