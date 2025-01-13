import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import moment from 'moment';
import $ from 'jquery';
import parse from 'html-react-parser';

export default function Index(props) {
        // alert(props.couponlog);
    function destroy(e) {
        if (confirm("Are you sure you want to delete this coupon?")) {
            Inertia.delete(route("coupons.destroy", e.currentTarget.id));
        }
    }

    function jsonarr(arr) {
        const arrrr = JSON.parse(arr);
        let result = [];

        $.each(props.types, function (key, val) {
            
            var check = arrrr.includes(`${val.value}`);
            if (check == true) {

                var a = val.label;
                result.push(a);
            }
        });
        

        return result.join("<br />");
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Coupons'}
            headtitle={'Coupons'}
        >
            
                            {RoleManageArray.roles.coupons == 2 && (
                                    <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                                        <Link className="btn btn-primary waves-effect waves-light" href={ route("coupons.create") } >
                                            Create coupon
                                        </Link>
                                    </div>
                                )
                            }

                        <div className="table-responsive">

                            <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='coupons' />

                            <table className="table">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-2 py-2 w-10">
                                            {/* {Common.makeSortOrderLink('ID','coupons','id',props.s,props.o,props.ob)} */}
                                            ID
                                        </th>
                                        <th className="px-2 py-2">
                                            Date
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Name','coupons','name',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Code','coupons','code',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Type','coupons','type',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('MOQ','coupons','moq',props.s,props.o,props.ob)}
                                        </th>
                                       
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('usage','coupons','usage',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Rate','coupons','rate',props.s,props.o,props.ob)}
                                        </th>
                                        {RoleManageArray.roles.coupons == 2 && (<th className="px-2 py-2 w-20">Action</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.coupons.data.map((coupon,key) => (
                                        <tr>
                                            <td className="border px-2 py-2">{ props.firstitem+key }</td>
                                            <td className="border px-2 py-2">{Common.makeDateFormate(coupon.created_at,props.general_settings)}</td>
                                            <td className="border px-2 py-2">{ coupon.name }</td>
                                            <td className="border px-2 py-2">{ coupon.code }</td>
                                            <td className="border px-2 py-2"> {parse(jsonarr(coupon.role_id))}
                                            </td>
                                            <td className="border px-2 py-2">{ coupon.moq }</td>
                                            <td className="border px-2 py-2">{ coupon.coupon_log_count+ '/'+coupon.use_limit}</td>
                                            <td className="border px-2 py-2">{ coupon.rate }%</td>

                                            {RoleManageArray.roles.coupons == 2 && (<td className="border px-2 py-2">
                                                
                                                
                                                        <div className='row'>
                                                            <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("coupons.edit", coupon.id)}>
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    
                                                
                                                
                                                        <div className='row mt-2'>
                                                            <button
                                                                onClick={destroy}
                                                                id={coupon.id}
                                                                tabIndex="-1"
                                                                className="btn btn-danger waves-effect waves-light"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    
                                                
                                            </td>)}
                                        </tr>
                                    ))}

                                    {props.coupons.data.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-6 py-4 border-t"
                                                colSpan="9"
                                                style={{textAlign:"center"}}
                                            >
                                                No results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Paginate datas={props.coupons} />


                        </div>
        </Authenticated>
    );
}
