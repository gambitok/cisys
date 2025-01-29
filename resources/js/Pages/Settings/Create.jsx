import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Settings/Form';


export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "name": "",
        "remark": "",
        "screen": 1,
        "screenselect": 1,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("settings.store"));
    }

    
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create Setting'}
            headtitle={'Create Setting'}
        >
            

            <form name="createForm" onSubmit={handleSubmit}>

                <Form data={data} errors={errors} setData={setData} permissions={props.permissions} />

            </form>

                     
            
        </Authenticated>
    );
}
