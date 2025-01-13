import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import Select from 'react-select';
import { Head, Link, useForm } from '@inertiajs/inertia-react';


export default function Form({ data,errors,setData,types,count }) {


    const handleChange = (e) => {
        let id = e.target.value;
    
        setData((prevData) => ({
            ...prevData,
            role_id: e.target.checked
                ? [...prevData.role_id, id]
                : prevData.role_id.filter((item) => item !== id),
        }));
    
    };

    const checkboxvaluechecked = (value, selectedValues) => {
        return selectedValues.includes(String(value));
      };
    

    return (
       <div>

            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="code" value="Code" />
                        <TextInput
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="e.g. X892JH39F..."
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="row">
                    <div className="mb-3 col-md-12">
                        <table className="mb-3 col-md-12">
                            <tr>
                                <td style={{ width: '45%'}}>
                                <InputLabel htmlFor="use_limit" value="Use Coupon" />
                                    <TextInput
                                        id="use_limit"
                                        value={count}
                                        // onChange={(e) => setData('use_limit', e.target.value)}
                                        type="readonly"
                                        style={{ background: '#8080802b'}}
                                        className="mt-1 block w-full form-control"
                                        autoComplete="off"
                                        placeholder="e.g. 1..."
                                    />
                                <InputError message={errors.use_limit} className="mt-2" />

                                </td>
                                <td style={{ width: '10%'}}>
                                    <p style={{ marginLeft: '47%',marginTop: '43%'}}>/</p>
                                </td>
                                <td style={{ width: '45%'}}> 
                                <InputLabel htmlFor="use_limit" value="Max Usage" />
                                <TextInput
                                    id="use_limit"
                                    value={data.use_limit}
                                    onChange={(e) => setData('use_limit', e.target.value)}
                                    type="number"
                                    className="mt-1 block w-full form-control"
                                    autoComplete="off"
                                    placeholder="e.g. 1..."
                                />
                                <InputError message={errors.use_limit} className="mt-2" />
                                </td>
                            </tr>
                        </table>
                     
                    </div>
                    <div className="mb-3 col-md-6">
                        
                    </div>
                    </div>
                </div>
            </div>

            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="e.g. NPO..."
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel value="User Type" />
                        <br/>
                        {/* <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={typeval}
                            name="role_id"
                            options={types}
                            onChange={optionChanged}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                        /> */}

                                 {types.map((item) => (
                                    
                                    <label className="flex items-center" style={{display: 'unset',marginLeft: '17px'}}>

                                        <Checkbox name="role_id[]" value={item.value} handleChange={handleChange} checked={checkboxvaluechecked(item.value,data.role_id)} />
                                        
                                        <span className="ml-2 text-sm text-gray-600">{item.label}</span>
                                    </label>
                                    
                                ))} 


                        <InputError message={errors.role_id} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">                    
                        <label htmlFor="moq" className={`block font-medium text-sm text-gray-700 `}>
                            MOQ{/*  <small style={{fontSize: "10px"}}>(Percentage)</small> */}
                        </label>
                        <TextInput
                            id="moq"
                            value={data.moq}
                            onChange={(e) => setData('moq', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="e.g. 100..."
                        />
                        <InputError message={errors.moq} className="mt-2" />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <label htmlFor="rate" className={`block font-medium text-sm text-gray-700 `}>
                            Discount Rate (% OFF) {/* <small style={{fontSize: "10px"}}>(Percentage)</small> */}
                        </label>
                        <TextInput
                            id="rate"
                            value={data.rate}
                            onChange={(e) => setData('rate', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="e.g. 40%..."
                        />
                        <InputError message={errors.rate} className="mt-2" />
                    </div>
                </div>
            </div>
            				


            

            
            <div className="mt-4 formsubmitbutton">
                <Link
                    className="btn btn-primary waves-effect waves-light"
                    href={ route("coupons.index") } style={{marginRight:"10px"}}
                >
                    Back
                </Link>
                <button
                    type="submit"
                    className="btn btn-success waves-effect waves-light"
                >
                    Save
                </button>
                
            </div>
        
       </div>
    );
}
