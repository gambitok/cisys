import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import Select from 'react-select';
import { Head, Link, useForm } from '@inertiajs/inertia-react';


export default function Form({ data,errors,setData,icons }) {
    

    const optionChangedIcon = value => {
        setData("icon_id",value.value);
    };
    const iconval = icons.find(obj => {
        return obj.value === data.icon_id;
    });
    
    return (
       <div>

            <div className='row g-3 my-2'>
                <div className='col-md-4'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className="mb-3">
                        <InputLabel value="Icon" />
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={iconval}
                            name="icon_id"
                            options={icons}
                            onChange={optionChangedIcon}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                            formatOptionLabel={function(data) {
                                return (
                                  <span dangerouslySetInnerHTML={{ __html: '<i class="'+data.label+'"></i> -- '+data.label }} />
                                );
                              }}
                              
                        />
                        <InputError message={errors.icon_id} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className="mb-3">
                        <InputLabel htmlFor="sort" value="Sort order" />
                        <TextInput
                            id="sort"
                            value={data.sort}
                            onChange={(e) => setData('sort', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Sort order"
                        />
                        <InputError message={errors.sort} className="mt-2" />
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
                    href={ route("menus.index") }
                >
                    Back
                </Link>
            </div>
        
       </div>
    );
}
