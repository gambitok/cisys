import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import { Link } from '@inertiajs/inertia-react';

export default function Form({ data,errors,setData,settings }) {

    const optionChanged = value => {
        setData("setting_id",value.value);
    };

    const setting_val = settings.find(obj => {
        return obj.value === data.setting_id;
    });

    return (
       <div>
            <div className='row g-3 my-2'>
                <div className='col-md-12'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Group Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Group Name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className='row g-3 my-2'>
                <div className='col-md-12'>
                    <div className="mb-3">
                        <InputLabel value="Setting ID" />
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={setting_val}
                            name="setting_id"
                            options={settings}
                            onChange={optionChanged}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                        />
                        <InputError message={errors.setting_id} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className="mt-4 formsubmitbutton">
                <button
                    type="submit"
                    className="btn btn-success waves-effect waves-light"
                >
                    Save
                </button>

                <Link
                    className="btn btn-primary waves-effect waves-light"
                    href={ route("groups.index") }
                >
                    Back
                </Link>
            </div>
       </div>
    );
}
