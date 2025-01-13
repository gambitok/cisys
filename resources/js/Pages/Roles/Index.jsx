import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';


export default function Index(props) {
    
    function destroy(e) {
        if (confirm("Are you sure you want to delete this role?")) {
            Inertia.delete(route("roles.destroy", e.currentTarget.id));
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Roles'}
            headtitle={'Roles'}
        >
            
            

                            
                        {RoleManageArray.roles.roles == 2 && (
                                <div className="flex items-center justify-between mb-6 float-end">
                                    <Link className="btn btn-primary waves-effect waves-light" href={ route("roles.create") } >
                                        Create Role
                                    </Link>
                                </div>
                            )
                        }

                        <div className="table-responsive">
                            <table className="table">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-2 py-2 w-10">ID</th>
                                        <th className="px-2 py-2">Name</th>
                                        <th className="px-2 py-2">Notes</th>
                                        {RoleManageArray.roles.roles == 2 && (<th className="px-2 py-2 w-20">Action</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.roles.data.map(({ id, name },key) => (
                                        <tr>
                                            <td className="border px-2 py-2">
                                                {/* { props.firstitem+key } */}
                                                { id }
                                            </td>
                                            <td className="border px-2 py-2">{ name }</td>
                                            <td className="border px-2 py-2"></td>
                                            {RoleManageArray.roles.roles == 2 && (<td className="border px-2 py-2">
                                                
                                                        <div className='row'>
                                                            <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("roles.edit", id)}>
                                                                Edit
                                                            </Link>
                                                        </div>

                                                        {id != 1 && (<div className='row mt-2'>
                                                            <button
                                                                onClick={destroy}
                                                                id={id}
                                                                tabIndex="-1"
                                                                className="btn btn-danger waves-effect waves-light"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>)}
                                                    
                                                
                                            </td>)}
                                        </tr>
                                    ))}
                                    
                                    {props.roles.data.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-6 py-4 border-t"
                                                colSpan="3"
                                                style={{textAlign:"center"}}
                                            >
                                                No results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Paginate datas={props.roles} />

                        </div>
        </Authenticated>
    );
}
