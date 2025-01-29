import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';

export default function Index(props) {
    
    function destroy(e) {
        if (confirm("Are you sure you want to delete this menu?")) {
            Inertia.delete(route("menus.destroy", e.currentTarget.id));
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Menus'}
            headtitle={'Menus'}
        >
            
                        
                        {RoleManageArray.roles.menus == 2 && (
                                <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                                    <Link className="btn btn-primary waves-effect waves-light" href={ route("menus.create") } >
                                        Create menu
                                    </Link>
                                </div>
                            )
                        }
                        
                        <div className="table-responsive">

                            <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='menus' />

                            <table className="table">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-2 py-2 w-10">
                                            {Common.makeSortOrderLink('ID','menus','id',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Folder','menus','name',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Sequence','menus','sort',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            Icon
                                        </th>
                                        {RoleManageArray.roles.menus == 2 && (<th className="px-2 py-2 w-25">Action</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.menus.data.map((menu,key) => (
                                        <tr>
                                            <td className="border px-2 py-2">
                                                {/* { props.firstitem+key } */}
                                                { menu.id }
                                            </td>
                                            <td className="border px-2 py-2">{ menu.name }</td>
                                            <td className="border px-2 py-2">{ menu.sort }</td>
                                            <td className="border px-2 py-2"><i className={ menu.icon?.icon }></i></td>
                                            
                                            {RoleManageArray.roles.menus == 2 && (<td className="border px-2 py-2">
                                                
                                                
                                                        <div className='row'>
                                                            <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("menus.edit", menu.id)}>
                                                                Edit / Manage sub menu
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
                                                    
                                                
                                            </td>)}
                                        </tr>
                                    ))}

                                    {props.menus.data.length === 0 && (
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

                            <Paginate datas={props.menus} />

                        </div>
            
        </Authenticated>
    );
}
