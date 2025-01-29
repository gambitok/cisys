import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Products/Form';


export default function Create(props) {
    
    const { data, setData, errors, post } = useForm({
        "name": "",
        "price": "",
        "version": "",
        "edition": "",
        "os": "",
        "unit": "",
        "tax": "",
        "download_url": ""
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("products.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create Product'}
            headtitle={'Create Product'}
        >   
            

                        

                            <form name="createForm" onSubmit={handleSubmit}>

                                <Form data={data} errors={errors} setData={setData} />

                            </form>

                     
        </Authenticated>
    );
}
