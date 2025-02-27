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
import TabelSearchBox from '@/Components/TabelSearchBox';
import UserDetailPopup from '@/Components/UserDetailPopup';
import Common from '@/Include/Common';
import Paginate from '@/Components/Paginate';

export default function Index(props) {

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Coupon History'}
            headtitle={'Coupon history'}
        >

            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='coupon-history' />

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className="px-2 py-2 w-10">ID</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Username','coupon-history','username',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Product','coupon-history','product_name',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Version','coupon-history','product_version',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Edition','coupon-history','product_edition',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Quantity','coupon-history','plan_qty',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Coupon','coupon-history','coupon_code',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Date','coupon-history','created_at',props.s,props.o,props.ob)}</th>
                        </tr>
                    </thead>
                    <tbody>

                        {props.couponlogs.data.map((couponlog,key) => (
                            <tr>
                                <td className="border px-2 py-2">{ props.firstitem+key }</td>
                                <td className="border px-2 py-2"><UserDetailPopup userName={couponlog?.user?.username} userId={couponlog?.user?.id} /></td>
                                <td className="border px-2 py-2">{couponlog.product_name}</td>
                                <td className="border px-2 py-2">{couponlog.product_version}</td>
                                <td className="border px-2 py-2">{couponlog.product_edition}</td>
                                <td className="border px-2 py-2">{couponlog.plan_qty}</td>
                                <td className="border px-2 py-2">{couponlog.coupon_code}</td>
                                <td className="border px-2 py-2">{Common.makeDateFormate(couponlog.created_at,props.general_settings)}</td>

                                {/*
                                <td className="border px-2 py-2">{ license.buy_date }</td>
                                <td className="border px-2 py-2">{ license?.product?.name }</td>
                                <td className="border px-2 py-2">${ license.total }</td>
                                <td className="border px-2 py-2">USD</td>
                                <td className="border px-2 py-2">-</td> */}
                            </tr>
                        ))}

                        {props.couponlogs.data.length === 0 && (
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

                <Paginate datas={props.couponlogs} />

            </div>

        </Authenticated>
    );
}
