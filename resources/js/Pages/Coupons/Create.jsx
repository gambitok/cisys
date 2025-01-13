import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Coupons/Form';


export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "code": "",
        "name": "",
        "role_id": ['16'],
        "moq": "",
        "rate": 0,
        "use_limit": 1,
    });
    				

    function handleSubmit(e) {
        e.preventDefault();
        post(route("coupons.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create coupon'}
            headtitle={'Create coupon'}
        >
            
            
            

                            

                            <form name="createForm" onSubmit={handleSubmit}>

                                <Form data={data} errors={errors} setData={setData} types={props.types} />

                            </form>

                        
            
        </Authenticated>
    );
}
