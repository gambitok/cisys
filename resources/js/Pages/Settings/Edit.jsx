import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Settings/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm(props.data);
    
    function handleSubmit(e) {
        e.preventDefault();
        put(route("settings.update",props.data.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit setting'}
            headtitle={'Edit Setting'}
        >
            
            
                            

            <form name="createForm" onSubmit={handleSubmit}>
                
                <Form data={data} errors={errors} setData={setData} />
                
            </form>

                        
            
        </Authenticated>
    );
}
