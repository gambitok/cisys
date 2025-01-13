import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Menus/Form';

export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "icon_id": "",
        "name": "",
        "sort": "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("menus.store"));
    }
    
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create menu'}
            headtitle={'Create menu'}
        >

                <form name="createForm" onSubmit={handleSubmit}>

                    <Form data={data} errors={errors} setData={setData} icons={props.icons} />

                </form>

        </Authenticated>
    );
}
