import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/inertia-react';


export default function Form({ data,errors,setData,permissions,rolemanage }) {
    
    /* const handleChange = (e) => {
        let id = parseInt(e.target.value);
        e.target.checked
        ? setData("permissions", [...data.permissions, id])
        : setData(
            "permissions",
            data.permissions.filter((item) => {
                return item !== id;
            })
        );
    }; */

    function handleChange(e) {
        const key = e.target.name;
        const val = e.target.value;

        setData('permissions',{...data.permissions, [key]: val});

    }

    function radiovaluechecked(key,val) {
        return (data.permissions[key] == val);
    }


    return (
       <>
        <div className="mb-3">
            <InputLabel htmlFor="name" value="Name" />
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

        <div className="mb-3">
            
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Permission</th>
                        <th scope="col" className="text-center">No access</th>
                        <th scope="col" className="text-center">Read only</th>
                        <th scope="col" className="text-center">Full control</th>
                    </tr>
                </thead>
                <tbody>
                    {rolemanage.map((item,key) => (
                        <>
                            <tr>
                                <th scope="row" colSpan={4}>
                                    {item.name}
                                </th>
                            </tr>

                            {item.submenu.map((submenu) => (
                                <tr>
                                    <td scope="row">
                                        &nbsp;&nbsp;&nbsp;&nbsp;- {submenu.name}
                                    </td>
                                    <td className="text-center">
                                        <label> 
                                            <input
                                                type="radio"
                                                value="0"
                                                name={item.id+'-'+submenu.id}
                                                onChange={handleChange}
                                                checked={radiovaluechecked(item.id+'-'+submenu.id,0)}
                                            />
                                        </label>
                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="radio"
                                            value="1"
                                            name={item.id+'-'+submenu.id}
                                            onChange={handleChange}
                                            checked={radiovaluechecked(item.id+'-'+submenu.id,1)}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="radio"
                                            value="2"
                                            name={item.id+'-'+submenu.id}
                                            onChange={handleChange}
                                            checked={radiovaluechecked(item.id+'-'+submenu.id,2)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </>
                    ))}
                    
                </tbody>
            </table>

            {/* <div className='row g-3 my-2'>
                {permissions.map((item,key) => (
                    <div className='col-md-3'>
                        <label className="flex items-center">
                            
                            <Checkbox name="permissions[]" value={item.id} handleChange={handleChange} checked={checkboxvaluechecked(item.id)} />

                            <span className="ml-2 text-sm text-gray-600">{item.name}</span>
                        </label>
                    </div>
                ))}
            </div> */}

            
            

        </div>

        {/* {permissions.map((item,key) => (
            <tr>
                <td className="border px-4 py-2">{ key }</td>
                <td className="border px-4 py-2">{ item.id }</td>
                <td className="border px-4 py-2">{ item.name }</td>
            </tr>
        ))} */}

        
        <div className="mt-4 formsubmitbutton">
            <button
                type="submit"
                className="btn btn-success waves-effect waves-light"
            >
                Save
            </button>
            <Link
                className="btn btn-primary waves-effect waves-light"
                href={ route("roles.index") }
            >
                Back
            </Link>
        </div>
       </>
    );
}
