import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Submenus/Form';

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        route_id: props.submenu.route_id || "",
        name: props.submenu.name || "",
        sort: props.submenu.sort || "",
        parent_id: props.parent_id
    });


    function handleSubmit(e) {
        e.preventDefault();
        put(route("submenu.update",props.submenu.id));
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit sub menu'}
            headtitle={'Edit sub menu'}
        >
            
            


                            <form name="createForm" onSubmit={handleSubmit}>

                                <Form data={data} errors={errors} setData={setData} routes={props.routes} />

                            </form>
                            


            
        </Authenticated>
    );
}
