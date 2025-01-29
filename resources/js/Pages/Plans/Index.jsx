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
        if (confirm("Are you sure you want to delete this plan?")) {
            Inertia.delete(route("plans.destroy", e.currentTarget.id));
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Packages'}
            headtitle={'Packages'}
        >
            
                {RoleManageArray.roles.plans == 2 && (
                                <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                                    <Link className="btn btn-primary waves-effect waves-light" href={ route("plans.create") } >
                                        Create package
                                    </Link>
                                </div>
                            )
                        }
                        
                        <div className="table-responsive">

                            <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='plans' />

                            <table className="table">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-2 py-2 w-10">
                                            {/* {Common.makeSortOrderLink('ID','plans','id',props.s,props.o,props.ob)} */}
                                            ID
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Product Name','plans','product',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Package Name','plans','name',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Quantity','plans','qty',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('Price','plans','price',props.s,props.o,props.ob)}
                                        </th>
                                        <th className="px-2 py-2">
                                            {/* {Common.makeSortOrderLink('Coupon','plans','coupon_id',props.s,props.o,props.ob)} */}
                                            Coupon
                                        </th>
                                        <th className="px-2 py-2">
                                            {/* {Common.makeSortOrderLink('Coupon','plans','coupon_id',props.s,props.o,props.ob)} */}
                                            Standalone Surcharge
                                        </th>
                                        <th className="px-2 py-2">
                                            {Common.makeSortOrderLink('User Type','plans','type',props.s,props.o,props.ob)}
                                        </th>
                                       
                                   
                                        
                                      
                                        {RoleManageArray.roles.plans == 2 && (<th className="px-2 py-2 w-20">Action</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.plans.data.map((plan,key) => (
                                        <tr>
                                            <td className="border px-2 py-2">{ props.firstitem+key }</td>
                                            <td className="border px-2 py-2">{ plan.product.name }</td>
                                            <td className="border px-2 py-2">{ plan.name }</td>
                                            <td className="border px-2 py-2">{ plan.qty }</td>
                                            <td className="border px-2 py-2">{ plan.price }</td>
                                            <td className="border px-2 py-2">{ plan?.coupon?.code }</td>
                                            <td className="border px-2 py-2">{ plan.standalone }</td>

                                            <td className="border px-2 py-2">{ plan?.role?.name }</td>
                                            
                                            {RoleManageArray.roles.plans == 2 && (<td className="border px-2 py-2">
                                                
                                                
                                                        <div className='row'>
                                                            <Link tabIndex="1" className="btn btn-primary waves-effect waves-light text-center" href={route("plans.edit", plan.id)}>
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    
                                                        <div className='row mt-2'>
                                                            <button
                                                                onClick={destroy}
                                                                id={plan.id}
                                                                tabIndex="-1"
                                                                className="btn btn-danger waves-effect waves-light"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    
                                                
                                            </td>)}
                                        </tr>
                                    ))}

                                   
                                    {props.plans.data.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-6 py-4 border-t"
                                                colSpan="8"
                                                style={{textAlign:"center"}}
                                            >
                                                No results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Paginate datas={props.plans} />

                        </div>
            
        </Authenticated>
    );
}
