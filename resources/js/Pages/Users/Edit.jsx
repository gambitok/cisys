import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Users/Form';

export default function Index(props) {

    const { data, setData, errors, put } = useForm({
        name: props.user.name || "",
        title: props.user.title || "",
        email: props.user.email || "",
        work_email: props.user.work_email || "",
        username: props.user.username || "",
        password: props.user.password || "",
        role_id: props.user.role_id || "",
        status: props.user.status || "",
        user_id: props.user.id || 0,
        api_key: props.user.api_key || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("users.update",props.user.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit User'}
            headtitle={'Edit User'}
        >


            <form name="createForm" onSubmit={handleSubmit}>
                
                <Form data={data} errors={errors} setData={setData} roles={props.roles} />

            </form>

                        
            
        </Authenticated>
    );
}
