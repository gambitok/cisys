import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Form from '@/Pages/Menus/Form';
import { Inertia } from "@inertiajs/inertia";

export default function Index(props) {
    
    const { data, setData, errors, put } = useForm({
        icon_id: props.menu.icon_id || "",
        name: props.menu.name || "",
        sort: props.menu.sort || "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route("menus.update",props.menu.id));
    }

    function destroy(e) {
        if (confirm("Are you sure you want to delete this submenu?")) {
            Inertia.delete(route("submenu.destroy", e.currentTarget.id));
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Edit menu'}
            headtitle={'Edit menu'}
        >
            
            
                            <form name="createForm" onSubmit={handleSubmit}>

                                <Form data={data} errors={errors} setData={setData} icons={props.icons} />

                            </form>
                            

                            <hr />

                            
                            <div className="flex items-center justify-between mb-6 mt-6">
                                <Link className="btn btn-success waves-effect waves-light" href={ route("submenu.create", props.menu.id) } >
                                    Add sub menu
                                </Link>
                            </div>
                                
                            
                            <div className="table-responsive">

                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-2 py-2">Name</th>
                                            <th className="px-2 py-2">Route</th>
                                            <th className="px-2 py-2">Sort order</th>
                                            <th className="px-2 py-2 w-20">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.submenus.map((menu) => (
                                            <tr>
                                                <td className="border px-2 py-2">{ menu.name }</td>
                                                <td className="border px-2 py-2">{ menu.route.name }</td>
                                                <td className="border px-2 py-2">{ menu.sort }</td>
                                                
                                                <td className="border px-2 py-2">
                                                    
                                                    
                                                    <div className='row'>
                                                        <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("submenu.edit", menu.id)}>
                                                            Edit
                                                        </Link>
                                                    </div>
                                                        
                                                    
                                                    
                                                    <div className='row mt-2'>
                                                        <button
                                                            onClick={destroy}
                                                            id={menu.id}
                                                            tabIndex="-1"
                                                            className="btn btn-danger waves-effect waves-light"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                       
                                                    
                                                </td>
                                            </tr>
                                        ))}

                                        
                                    </tbody>
                                </table>


                            </div>
            
        </Authenticated>
    );
}
