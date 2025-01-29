import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Roles/Form';


export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "name": "",
        "permissions": props.defaultselectarray || [],
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("roles.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create Role'}
            headtitle={'Create Role'}
        >
            
            
            

                            <form name="createForm" onSubmit={handleSubmit}>

                                <Form data={data} errors={errors} setData={setData} permissions={props.permissions} rolemanage={props.rolemanage} />
                                
                                

                            </form>

                       
            
        </Authenticated>
    );
}
