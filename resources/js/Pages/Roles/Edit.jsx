import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Roles/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        name: props.role.name || "",
        permissions: props.defaultselectarray || [],
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("roles.update",props.role.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit Role'}
            headtitle={'Edit Role'}
        >
            
            

                            <form name="createForm" onSubmit={handleSubmit}>
                                
                                <Form data={data} errors={errors} setData={setData} permissions={props.permissions} rolemanage={props.rolemanage} />

                            </form>

                        
            
        </Authenticated>
    );
}
