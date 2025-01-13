import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Submenus/Form';

export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "route_id": "",
        "name": "",
        "sort": "",
        "parent_id": props.parent_id
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("submenu.store"));
    }
    
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create sub menu'}
            headtitle={'Create sub menu'}
        >

                <form name="createForm" onSubmit={handleSubmit}>
                
                    <Form data={data} errors={errors} setData={setData} routes={props.routes} />

                </form>

        </Authenticated>
    );
}
