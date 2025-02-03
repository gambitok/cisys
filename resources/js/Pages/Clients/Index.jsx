import React, { useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import {Link, useForm} from '@inertiajs/inertia-react';
import { RoleManageArray } from '@/Components/SidebarRolePermissionCheck';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import Checkbox from '@/Components/CustomCheckbox';
import $ from 'jquery';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import UserDetailPopup from '@/Components/UserDetailPopup';
import SpanCopyKeyboad from '@/Components/SpanCopyKeyboad';
import Toggle from "react-bootstrap-toggle";

export default function Index(props) {
    const { data, setData, errors, post } = useForm({
        "clients": [],
        "group_id": "",
        "setting_id": "",
    });

    useEffect(() => {}, []);

    function deleteCheckBoxValided(){
        $(".alert").remove();
        if (data.clients == '') {
            $("<div class='alert alert-danger'>Please select any client</div>").insertBefore("main");
        } else {
            post(route("clients.multiple.delete"));
            $("input[type='checkbox']").prop("checked", false);
        }
    }

    const optionChanged = value => {
        setData("group_id", value.value);
    };

    const handleChange = (e) => {
        let id = e.target.value;
        if (e.target.checked) {
            setData("clients", [...data.clients, id]);
        } else {
            setData(
                "clients",
                data.clients.filter((item) => item !== id)
            );
        }
    };

    const settingOptionChanged = value => {
        setData("setting_id",value.value);
    };

    function settingCheckBoxValided() {
        $(".alert").remove();
        if (data.clients.length === 0) {
            $("<div class='alert alert-danger'>Please select any setting</div>").insertBefore("main");
        } else {
            $('#settingModalButton').trigger("click");
        }
    }

    function checkBoxValided() {
        $(".alert").remove();
        if (data.clients.length === 0) {
            $("<div class='alert alert-danger'>Please select any client</div>").insertBefore("main");
        } else {
            $('#exampleModalButton').trigger("click");
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route("clients.client-groups-bind"));
        $('#exampleModalButton').trigger("click");
    }

    function settingHandleSubmit(e) {
        e.preventDefault();
        post(route("clients.client-settings-bind"));
        $('#settingModalButton').trigger("click");
    }

    function allCheckboxCheckedCode() {
        let allclients = props.clients.data.map(client => String(client.id));
        setData("clients", allclients);

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode() {
        setData("clients", []);

        $("#unselectAll").hide();
        $("#selectAll").show();

        $("input[type='checkbox']").prop("checked", false);
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Clients'}
            headtitle={'Clients'}
        >

            <button type="button" id='settingModalButton' className="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#settingModal" style={{display: 'none'}}>
                Launch demo modal
            </button>

            <div className="modal fade" id="settingModal" tabIndex="-1" aria-labelledby="settingModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <form name="createForm" onSubmit={settingHandleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="settingModalLabel">Bind Setting ID</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>Please select the setting name.</div>
                                <div className='row g-3 my-2'>
                                    <div className='col-md-12'>
                                        <div className="mb-3">
                                            <InputLabel value="Setting ID"/>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="setting_id"
                                                options={props.settings}
                                                onChange={settingOptionChanged}
                                                styles={{
                                                    option: (styles, state) => ({...styles, cursor: 'pointer',}),
                                                    control: (styles) => ({...styles, cursor: 'pointer',}),
                                                }}
                                            />
                                            <InputError message={errors.setting_id} className="mt-2"/>

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

            <button type="button" id='exampleModalButton' className="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#exampleModal" style={{display: 'none'}}>
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <form name="createForm" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Bind Group</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>Please select the group name.</div>
                                <div className='row g-3 my-2'>
                                    <div className='col-md-12'>
                                        <div className="mb-3">
                                            <InputLabel value="Group"/>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="group_id"
                                                options={props.groups}
                                                onChange={optionChanged}
                                                styles={{
                                                    option: (styles, state) => ({...styles, cursor: 'pointer'}),
                                                    control: (styles) => ({...styles, cursor: 'pointer'})
                                                }}
                                            />
                                            <InputError message={errors.group_id} className="mt-2"/>
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

            {RoleManageArray.roles.clients == 2 && (
                <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                    <a className="btn btn-danger waves-effect waves-light mr-5" href='javascript:void(0)' onClick={deleteCheckBoxValided}>
                        Delete Clients
                    </a>
                    <a className="btn btn-success waves-effect waves-light mr-5" href='javascript:void(0)'
                       onClick={settingCheckBoxValided}>
                        Bind Setting ID
                    </a>
                    <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)'
                       onClick={checkBoxValided}>
                        Bind Group
                    </a>
                </div>
            )}

            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='clients'/>

                <table className="table">
                    <thead className="table-light">
                    <tr>
                        <th className="px-2 py-2 w-10">
                            <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)'
                               onClick={allCheckboxCheckedCode} id='selectAll' style={{padding: "0px 5px"}}>
                                All
                            </a>
                            <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)'
                               onClick={allCheckboxUncheckCode} id='unselectAll'
                               style={{display: "none", padding: "0px 5px"}}>
                                All
                            </a>
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('ID', 'clients', 'id', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Username', 'clients', 'username', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Client ID', 'clients', 'client_id', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Client', 'clients', 'name', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Server ID', 'clients', 'server_id', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Group', 'clients', 'group', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Setting', 'clients', 'setting', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('IPv4', 'clients', 'ipaddress', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('OS', 'clients', 'os_version', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">
                            {Common.makeSortOrderLink('Deployed', 'clients', 'deployed', props.s, props.o, props.ob)}
                        </th>
                        <th className="px-2 py-2">Remark</th>
                        <th className="px-2 py-2">{Common.makeSortOrderLink('Added', 'clients', 'created_at', props.s, props.o, props.ob)}</th>
                    </tr>
                    </thead>
                    <tbody>

                    {props.clients.data.map((client, key) => (
                        <tr key={key}>
                            <td className="border px-2 py-2">
                                <Checkbox
                                    name="client[]"
                                    value={client.id}
                                    onChange={handleChange}
                                    checked={data.clients.includes(String(client.id))}
                                />
                            </td>
                            <td className="border px-2 py-2">{client.id}</td>
                            <td className="border px-2 py-2"><UserDetailPopup userName={client.user.username}
                                                                              userId={client.user.id}/></td>
                            <td className="border px-2 py-2"><SpanCopyKeyboad client_id={client.client_id}/></td>
                            <td className="border px-2 py-2">{client.name}</td>
                            <td className="border px-2 py-2"><SpanCopyKeyboad client_id={client.server_id}/></td>
                            <td className="border px-2 py-2">{client?.group?.name}</td>
                            <td className="border px-2 py-2">{client?.group?.setting?.name}</td>
                            <td className="border px-2 py-2">{client.ipaddress}</td>
                            <td className="border px-2 py-2">{client.os_version}</td>
                            <td className="border px-2 py-2">{client.deployed ? 'Yes' : 'No'}</td>
                            <td className="border px-2 py-2"></td>
                            <td className="border px-2 py-2">{Common.makeDateFormate(client.created_at, props.general_settings)}</td>
                        </tr>
                    ))}

                    {props.clients.data.length === 0 && (
                        <tr>
                            <td
                                className="px-6 py-4 border-t"
                                colSpan="12"
                                style={{textAlign: "center"}}
                            >
                                No results.
                            </td>
                        </tr>
                    )}

                    </tbody>
                </table>

                <Paginate datas={props.clients}/>

            </div>

        </Authenticated>
    );
}
