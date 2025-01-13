import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Groups/Form';


export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "name": "",
        "setting_id": "",
    });
    				

    function handleSubmit(e) {
        e.preventDefault();
        post(route("groups.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create group'}
            headtitle={'Create group'}
        >
            

            <form name="createForm" onSubmit={handleSubmit}>

                <Form data={data} errors={errors} setData={setData} settings={props.settings} />

            </form>

                        
            
        </Authenticated>
    );
}
