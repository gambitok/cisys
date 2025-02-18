import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import moment from 'moment';
import UserDetailPopup from '@/Components/UserDetailPopup';
import $ from 'jquery';
import Checkbox from '@/Components/Checkbox';

export default function Index(props) {

    function destroy(e) {
        if (confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(route("users.destroy", e.currentTarget.id));
        }
    }

    const { data, setData, errors, post } = useForm({
        "users": "",
    });

    const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("users", [...data.users, id])
        : setData(
            "users",
            data.users.filter((item) => {
                return item !== id;
            })
        );
    };

    function allCheckboxCheckedCode(){
        let allusers = [];
        props.users.data.map((user) => (
            allusers.push(String(user.id))
        ))
        setData("users", allusers)

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode(){
        let allusers = [];
        setData("users", allusers)

        $("#unselectAll").hide();
        $("#selectAll").show();

        $("input[type='checkbox']").prop("checked", false);
    }

    function checkBoxValided(){
        $(".alert").remove();
        if (data.users == '') {
            $("<div class='alert alert-danger'>Please select any user</div>").insertBefore("main");
        } else {
            if (confirm("Are you sure you want to delete that users?")) {
                post(route("users.multiple.delete"));
                $("input[type='checkbox']").prop("checked", false);
            }
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Users'}
            headtitle={'Users'}
        >
            {RoleManageArray.roles.users == 2 && (
                    <div className="flex items-center justify-between mb-6 float-end create-button-listing">

                        <a className="btn btn-danger waves-effect waves-light mr-5" href='javascript:void(0)' onClick={checkBoxValided}>
                            Delete Users
                        </a>

                        <Link
                            className="btn btn-primary waves-effect waves-light"
                            href={ route("users.create") }
                        >
                            Create User
                        </Link>
                    </div>
                )
            }
                <div className="table-responsive">

                    <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='users' />

                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th className="px-2 py-2 w-10">
                                    <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)' onClick={allCheckboxCheckedCode} id='selectAll' style={{padding: "0px 5px"}}>
                                        All
                                    </a>
                                    <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)' onClick={allCheckboxUncheckCode} id='unselectAll' style={{display:"none",padding: "0px 5px"}}>
                                        All
                                    </a>
                                </th>
                                <th className="px-2 py-2 w-10">
                                    {Common.makeSortOrderLink('ID','users','id',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    {Common.makeSortOrderLink('Username','users','username',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    User Group
                                </th>
                                <th className="px-2 py-2">
                                    {Common.makeSortOrderLink('Full Name','users','name',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    {Common.makeSortOrderLink('Title','users','title',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    {Common.makeSortOrderLink('Email','users','email',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    {Common.makeSortOrderLink('Active','users','status',props.s,props.o,props.ob)}
                                </th>
                                <th className="px-2 py-2">
                                    Date
                                </th>
                                {RoleManageArray.roles.coupons == 2 && (<th className="px-2 py-2 w-20">Action</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {props.users.data.map((user,key) => (
                                <tr>
                                    <td className="border px-2 py-2">
                                        <Checkbox name="users[]" value={user.id} handleChange={handleChange} />
                                    </td>
                                    <td className="border px-2 py-2">
                                        { user.id }
                                    </td>
                                    <td className="border px-2 py-2"><UserDetailPopup userName={user.username} userId={user.id} /></td>
                                    <td className="border px-2 py-2">{ user?.role?.name }</td>
                                    <td className="border px-2 py-2">{ user.name }</td>
                                    <td className="border px-2 py-2">{ user.title }</td>
                                    <td className="border px-2 py-2">{ user.email }</td>
                                    <td className="border px-2 py-2">{ user.status?'Yes':'no' }</td>
                                    <td className="border px-2 py-2">{Common.makeDateFormate(user.created_at,props.general_settings)}</td>
                                    {RoleManageArray.roles.coupons == 2 && (<td className="border px-2 py-2">

                                        <div className='row'>
                                            <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("users.edit", user.id)} >
                                                Edit
                                            </Link>
                                        </div>

                                        <div className='row mt-2'>
                                            <button onClick={destroy} id={user.id} tabIndex="-1" className="btn btn-danger waves-effect waves-light">
                                                Delete
                                            </button>
                                        </div>
                                    </td>)}
                                </tr>
                            ))}

                            {props.users.data.length === 0 && (
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

                    <Paginate datas={props.users} />

                </div>

        </Authenticated>
    );
}
