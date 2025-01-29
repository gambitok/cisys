import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Coupons/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        code: props.coupon.code || "",
        name: props.coupon.name || "",
        role_id: props.coupon.role_id || [''], // Pass an empty array if not provided
        moq: props.coupon.moq || "",
        rate: props.coupon.rate || "",
        use_limit: props.coupon.use_limit || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("coupons.update",props.coupon.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit coupon'}
            headtitle={'Edit coupon'}
        >
            
                            <form name="createForm" onSubmit={handleSubmit}>
                                
                                <Form data={data} errors={errors} setData={setData} types={props.types} count={props.count} />

                            </form>

            
        </Authenticated>
    );
}
