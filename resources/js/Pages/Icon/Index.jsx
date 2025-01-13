import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import Checkbox from '@/Components/Checkbox';
import $ from 'jquery';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';


export default function Index(props) {

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Icons'}
            headtitle={'Icons'}
        >

          
            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='icons' />

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className="px-2 py-2 w-10">
                                {Common.makeSortOrderLink('ID','icons','id',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2 w-10">Icon</th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Icon class','icons','icon',props.s,props.o,props.ob)}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.icons.data.map((icon,key) => (
                            <tr>
                                <td className="border px-2 py-2">
                                    {/* { props.firstitem+key } */}
                                    { icon.id }
                                </td>
                                <td className="border px-2 py-2"><i className={ icon.icon }></i></td>
                                <td className="border px-2 py-2">{ icon.icon }</td>
                            </tr>
                        ))}

                        {props.icons.data.length === 0 && (
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

                <Paginate datas={props.icons} />

            </div>
            
        </Authenticated>
    );
}
