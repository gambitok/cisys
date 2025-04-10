import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import ScreenData from '@/Components/ScreenData';
import AlarmData from '@/Components/AlarmData';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import $ from 'jquery';

export default function Form({ data, errors, setData, users, role_id }) {

    function screenCick(plus) {
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
        setData('screenselect', tab_id);
    }

    function alarmClick(plus) {
        console.log(data);
        const newData = { ...data };
        if (plus) {
            newData.alarm = data.alarm + 1;
        } else {
            if (data.alarm > 1) {
                newData.alarm = data.alarm - 1;
            }
        }
        newData.alarmselect = newData.alarm;
        setData(newData);
    }

    function updateAlarmTab(tab_id) {
        setData('alarmselect', tab_id);
    }

    return (
       <div>

           {role_id === 1 && (
               <div className='row g-3 my-2'>
                   <div className='col-md-6'>
                       <div className="mb-3">
                           <InputLabel htmlFor="user" value="Select User" />
                           <select
                               id="user"
                               name="selectedUser"
                               value={data.selectedUser}
                               onChange={updateData}
                               className="form-control"
                           >
                               <option value="">Select a user</option>
                               {Array.isArray(users) && users.length > 0 ? (
                                   users.map(user => (
                                       <option key={user.id} value={user.id}>
                                           {user.id}. {user.name}
                                       </option>
                                   ))
                               ) : (
                                   <option value="" disabled>No users available</option>
                               )}
                           </select>
                           <InputError message={errors.selectedUser} className="mt-2" />
                       </div>
                   </div>
               </div>
           )}

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

                            <select className="form-select mb-3" id="screen" name='screenselect' style={{width: "50%",display: "inline-block"}} onChange={updateData}>
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
                    <h5>Banners</h5>
                    <nav>
                        <div className="nav nav-tabs nav-tabs-custom" id="nav-tab" role="tablist">
                            {window.innerWidth < 768 ? (
                                <select className="form-select" onChange={(e) => updateDataTab(Number(e.target.value))} value={data.screenselect}>
                                    {Array.from(Array(data.screen), (v, i) => (
                                        <option key={i} value={i + 1}>
                                            Screen #{i + 1}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                Array.from(Array(data.screen), (v, i) => (
                                    <button
                                        key={i}
                                        className={data.screenselect === i + 1 ? 'nav-link active' : 'nav-link'}
                                        id={'nav-tab' + (i + 1)}
                                        data-bs-toggle="tab"
                                        type="button"
                                        onClick={() => updateDataTab(i + 1)}
                                    >
                                        Screen #{i + 1}
                                    </button>
                                ))
                            )}

                            <div className="nav-controls">
                                <button className="nav-link nav-tab-plus" id="nav-tab-plus" data-bs-toggle="tab" type="button" onClick={() => screenCick(1)}>
                                    ➕
                                </button>

                                <button className="nav-link nav-tab-minus" id="nav-tab-minus" data-bs-toggle="tab" type="button" onClick={() => screenCick(0)}>
                                    ➖
                                </button>
                            </div>
                        </div>
                    </nav>

                </div>
            </div>

            <div id='screen-data'>

                <ScreenData data={data} errors={errors} setData={setData}  />

            </div>

            <hr />

           <div className='row g-3 my-2'>
               <div className='col-md-12'>
                   <h5>Alarms</h5>
                   <nav>
                       <div className="nav nav-tabs nav-tabs-custom" role="tablist">
                           {window.innerWidth < 768 ? (
                               <select className="form-select" onChange={(e) => updateDataTab(Number(e.target.value))} value={data.alarmselect}>
                                   {Array.from(Array(data.alarm), (v, i) => (
                                       <option key={i} value={i + 1}>
                                           Alarm #{i + 1}
                                       </option>
                                   ))}
                               </select>
                           ) : (
                               Array.from(Array(data.alarm), (v, i) => (
                                   <button
                                       key={i}
                                       className={data.alarmselect === i + 1 ? 'nav-link active' : 'nav-link'}
                                       type="button"
                                       onClick={() => updateAlarmTab(i + 1)}
                                   >
                                       Alarm #{i + 1}
                                   </button>
                               ))
                           )}

                           <div className="nav-controls">
                               <button className="nav-link" type="button" onClick={() => alarmClick(1)}>
                                   ➕
                               </button>
                               <button className="nav-link" type="button" onClick={() => alarmClick(0)}>
                                   ➖
                               </button>
                           </div>
                       </div>
                   </nav>
               </div>
           </div>

           <div id='alarm-data'>
               <AlarmData data={data} errors={errors} setData={setData} />
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
