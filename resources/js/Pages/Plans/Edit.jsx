import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Plans/Form';

export default function Index(props) {

    const { data, setData, errors, put } = useForm({
        product_id: props.plan.product_id || "",
        role_id: props.plan.role_id || "",
        coupon_id: props.plan.coupon_id || "",
        name: props.plan.name || "",
        qty: props.plan.qty || "",
        price: props.plan.price || "",
        standalone: props.plan.standalone || 0,
        standalone_status: props.plan.standalone_status !== undefined ? props.plan.standalone_status : 0,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("plans.update",props.plan.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit package'}
            headtitle={'Edit package'}
        >
            <form name="createForm" onSubmit={handleSubmit}>
                <Form data={data} errors={errors} setData={setData} types={props.types} products={props.products} coupons={props.coupons} />
            </form>
        </Authenticated>
    );
}
