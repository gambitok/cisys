import React,{useState} from 'react';
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
import TabelSearchBox from '@/Components/TabelSearchBox';
import Common from '@/Include/Common';
import Toggle from 'react-bootstrap-toggle';
import UserDetailPopup from '@/Components/UserDetailPopup';

export default function Index(props) {

    const { data, setData, errors, post } = useForm({
        "groups": "",
        "setting_id": "",
        "ldaptoggle": props.ldap,
    });

    const optionChanged = value => {
        setData("setting_id",value.value);
    };

    function deleteCheckBoxValided(){
        $(".alert").remove();
        if (data.groups == '') {
            $("<div class='alert alert-danger'>Please select any group</div>").insertBefore("main");
        } else {
            if (confirm("Are you sure you want to delete that groups?")) {
                post(route("groups.multiple.delete"));
                $("input[type='checkbox']").prop("checked", false);
            }
        }
    }

    const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("groups", [...data.groups, id])
        : setData(
            "groups",
            data.groups.filter((item) => {
                return item !== id;
            })
        );
    };

    function checkBoxValided(){
        $(".alert").remove();
        if (data.groups == '') {
            $("<div class='alert alert-danger'>Please select any group</div>").insertBefore("main");
        }else{
            $('#exampleModalButton').trigger("click");
        }
    }

    function destroy(e) {
        if (confirm("Are you sure you want to delete this group?")) {
            Inertia.delete(route("groups.destroy", e.currentTarget.id));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route("groups.bind"));
        $('#exampleModalButton').trigger("click");
    }

    function allCheckboxCheckedCode(){
        let allgroup = [];
        props.groups.data.map((group) => (
            allgroup.push(String(group.id))
        ))
        setData("groups", allgroup)

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode(){
        let allgroup = [];
        setData("groups", allgroup)

        $("#unselectAll").hide();
        $("#selectAll").show();

        $("input[type='checkbox']").prop("checked", false);
    }

    function onToggle() {
        setData("ldaptoggle",!data.ldaptoggle);
        Common.makeUrlWithSearchAndOrder('groups',props.s,props.o,props.ob,!data.ldaptoggle);
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Group'}
            headtitle={'Group'}
        >

            <button type="button" id='exampleModalButton' className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{display:'none'}}>
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <form name="createForm" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Bind Group</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>Please select the setting name.</div>
                                <div className='row g-3 my-2'>
                                    <div className='col-md-12'>
                                        <div className="mb-3">
                                            <InputLabel value="Setting ID" />
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="setting_id"
                                                options={props.settings}
                                                onChange={optionChanged}
                                                styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                                            />
                                            <InputError message={errors.setting_id} className="mt-2" />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

            {
                RoleManageArray.roles.groups == 2 && (
                    <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                        <Toggle
                            onClick={onToggle}
                            on={<span>LDAP ON</span>}
                            off={<span>LDAP OFF</span>}
                            size="sm"
                            onstyle="primary"
                            offstyle="default"
                            active={data.ldaptoggle}
                        />
                        <a className="btn btn-success waves-effect waves-light ml-5" href='javascript:void(0)' onClick={checkBoxValided}>
                            Bind Setting ID
                        </a>
                        <a className="btn btn-danger waves-effect waves-light ml-5" href='javascript:void(0)' onClick={deleteCheckBoxValided}>
                            Delete Groups
                        </a>
                        <Link className="btn btn-primary waves-effect waves-light ml-5" href={ route("groups.create") }>
                            Create group
                        </Link>

                    </div>
                )
            }

            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='groups' ldap={data.ldaptoggle} />

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
                                {Common.makeSortOrderLink('ID','groups','id',props.s,props.o,props.ob,data.ldaptoggle)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Username','groups','username',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Group Name','groups','name',props.s,props.o,props.ob,data.ldaptoggle)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Setting ID','groups','sname',props.s,props.o,props.ob,data.ldaptoggle)}
                            </th>
                            <th className="px-2 py-2">
                                Group Remark
                            </th>
                            {RoleManageArray.roles.groups == 2 && (<th className="px-2 py-2 w-20">Action</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {props.groups.data?.map((group,key) => (
                            <tr>
                                <td className="border px-2 py-2">
                                    <Checkbox name="group[]" value={group.id} handleChange={handleChange} />
                                </td>
                                <td className="border px-2 py-2">
                                    {/* { props.firstitem+key } */}
                                    { group.id }
                                </td>
                                <td className="border px-2 py-2"><UserDetailPopup userName={group?.user?.username} userId={group?.user?.id} /></td>
                                <td className="border px-2 py-2">{ group.name }</td>
                                <td className="border px-2 py-2">{ group?.setting?.name }</td>
                                <td className="border px-2 py-2"></td>

                                {RoleManageArray.roles.groups == 2 && (<td className="border px-2 py-2">

                                    <div className='row'>
                                        <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("groups.edit", group.id)}>
                                            Edit
                                        </Link>
                                    </div>

                                    <div className='row mt-2'>
                                        <button
                                            onClick={destroy}
                                            id={group.id}
                                            tabIndex="-1"
                                            className="btn btn-danger waves-effect waves-light"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </td>)}
                            </tr>
                        ))}

                        {props.groups.data.length === 0 && (
                            <tr>
                                <td
                                    className="px-6 py-4 border-t"
                                    colSpan="5"
                                    style={{textAlign:"center"}}
                                >
                                    No results.
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>

                <Paginate datas={props.groups} />

            </div>

        </Authenticated>
    );
}
