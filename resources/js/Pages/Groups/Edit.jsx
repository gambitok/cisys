import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Groups/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        name: props.group.name || "",
        setting_id: props.group.setting_id || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("groups.update",props.group.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit group'}
            headtitle={'Edit group'}
        >
            

            <form name="createForm" onSubmit={handleSubmit}>
                
                <Form data={data} errors={errors} setData={setData} settings={props.settings} />

            </form>

                        
        </Authenticated>
    );
}
