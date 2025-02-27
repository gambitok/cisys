import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Plans/Form';

export default function Create(props) {

    const { data, setData, errors, post } = useForm({
        "product_id": "",
        "role_id": "",
        "role_ids": ['16'],
        "coupon_id": "",
        "name": "",
        "qty": "",
        "price": "",
        "standalone": 0,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("plans.store"));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Create package'}
            headtitle={'Create package'}
        >

            <form name="createForm" onSubmit={handleSubmit}>

                <Form data={data} errors={errors} setData={setData} types={props.types} products={props.products} coupons={props.coupons} />

            </form>

        </Authenticated>
    );
}
