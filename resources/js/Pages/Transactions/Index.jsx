import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import UserDetailPopup from '@/Components/UserDetailPopup';
import Paginate from '@/Components/Paginate';

export default function Index(props) {

    function refund(e) {
        if (confirm("Are you sure you want to refund this transaction?")) {
            Inertia.post(route("transactions.refund", e.currentTarget.id));
        }
    }

    function paymentTypeNameGet(payment_type){
        var payment_name = 'Free transaction';
        if (payment_type == 2) {
            payment_name = 'Stripe';
        } else if (payment_type == 3) {
            payment_name = 'Paypal';
        }
        return payment_name;
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Transactions'}
            headtitle={'Transactions'}
        >

            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='transactions' />

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className="px-2 py-2 w-10">ID</th>
                            <th className="px-2 py-2 w-10">{Common.makeSortOrderLink('Transactions ID','transactions','transaction_id',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Customer','transactions','username',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Product','transactions','product',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Total Amount','transactions','total',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Payment method','transactions','payment_type',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Date','transactions','created_at',props.s,props.o,props.ob)}</th>
                            {RoleManageArray.roles.transactions == 2 && <th className="px-2 py-2">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                    {props.licenses.data.map((license, key) => {
                        console.log(license);
                        return (
                            <tr key={key}>
                                <td className="border px-2 py-2">{ props.firstitem + key }</td>
                                <td className="border px-2 py-2">{ license.transaction_id }</td>
                                <td className="border px-2 py-2"><UserDetailPopup userName={license?.user?.username} userId={license?.user?.id} /></td>
                                <td className="border px-2 py-2">
                                    {license?.product?.name ?? 'N/A'}
                                </td>
                                <td className="border px-2 py-2">${ license.total }</td>
                                <td className="border px-2 py-2">{ paymentTypeNameGet(license.payment_type) }</td>
                                <td className="border px-2 py-2">{Common.makeDateFormate(license.created_at, props.general_settings)}</td>
                                {RoleManageArray.roles.transactions == 2 && (
                                    <td className="border px-2 py-2">
                                        {(license.payment_type != 1 && license.refund == 0) && (
                                            <div className='row mt-2'>
                                                <button
                                                    onClick={refund}
                                                    id={license.id}
                                                    tabIndex="-1"
                                                    className="btn btn-warning waves-effect waves-light"
                                                >
                                                    Refund
                                                </button>
                                            </div>
                                        )}
                                        {license.refund == 1 ? 'Refund Completed' : ''}
                                    </td>
                                )}
                            </tr>
                        );
                    })}

                        {props.licenses.data.length === 0 && (
                            <tr>
                                <td
                                    className="px-6 py-4 border-t"
                                    colSpan="7"
                                    style={{textAlign:"center"}}
                                >
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Paginate datas={props.licenses} />

            </div>

        </Authenticated>
    );
}
