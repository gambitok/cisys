import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Users/Form';

export default function Create(props) {

    const { data, setData, errors, post } = useForm({
        name: "",
        title: "",
        email: "",
        work_email: "",
        username: "",
        password: "",
        role_id: 0,
        status: 0,
        api_key: "",
        // user_id: 0,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("users.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create User'}
            headtitle={'Create User'}
        >

            <form name="createForm" onSubmit={handleSubmit}>

                <Form data={data} errors={errors} setData={setData} roles={props.roles} />

            </form>

        </Authenticated>
    );
}
