import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Products/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        name: props.product.name || "",
        price: props.product.price || "",
        version: props.product.version || "",
        edition: props.product.edition || "",
        os: props.product.os || "",
        unit: props.product.unit || "",
        tax: props.product.tax || "",
        download_url: props.product.download_url || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("products.update",props.product.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit product'}
            headtitle={'Edit product'}
        >
            
           

                            <form name="createForm" onSubmit={handleSubmit}>
                                
                                <Form data={data} errors={errors} setData={setData} />

                            </form>

            
        </Authenticated>
    );
}
