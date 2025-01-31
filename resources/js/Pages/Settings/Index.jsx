import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import UserDetailPopup from '@/Components/UserDetailPopup';
import $ from 'jquery';
import Checkbox from '@/Components/Checkbox';

export default function Index(props) {

    function destroy(e) {
        if (confirm("Are you sure you want to delete this setting?")) {
            Inertia.delete(route("settings.destroy", e.currentTarget.id));
        }
    }

    const { data, setData, errors, post } = useForm({
        "settings": "",
    });

    const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("settings", [...data.settings, id])
        : setData(
            "settings",
            data.settings.filter((item) => {
                return item !== id;
            })
        );
    };

    function allCheckboxCheckedCode(){
        let allsettings = [];
        props.settings.data.map((setting) => (
            allsettings.push(String(setting.id))
        ))
        setData("settings", allsettings)

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode(){
        let allsettings = [];
        setData("settings", allsettings)

        $("#unselectAll").hide();
        $("#selectAll").show();

        $("input[type='checkbox']").prop("checked", false);
    }

    function checkBoxValided(){
        $(".alert").remove();
        if (data.settings == '') {
            $("<div class='alert alert-danger'>Please select any setting</div>").insertBefore("main");
        }else{
            post(route("settings.multiple.delete"));
            $("input[type='checkbox']").prop("checked", false);
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Settings'}
            headtitle={'Settings'}
        >



            {
                RoleManageArray.roles.settings == 2 && (
                    <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                        <a className="btn btn-danger waves-effect waves-light ml-5" href='javascript:void(0)' onClick={checkBoxValided}>
                            Delete Settings
                        </a>

                        <Link className="btn btn-primary waves-effect waves-light ml-5" href={ route("settings.create") } >
                            Create setting
                        </Link>
                    </div>
                )
            }


            <div className="table-responsive">


                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='settings' />


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
                                {Common.makeSortOrderLink('ID','settings','id',props.s,props.o,props.ob)}
                                {/* ID */}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('User','settings','username',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Setting Name','settings','name',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Banner Height (px)','settings','banner_height',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Banner Border (px)','settings','banner_border',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Center Text','settings','center_text',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Right Text','settings','right_text',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">Banner Color</th>
                            <th className="px-2 py-2">Text Color</th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Remark','settings','remark',props.s,props.o,props.ob)}
                            </th>
                            {
                                RoleManageArray.roles.settings == 2 && (
                                    <th className="px-2 py-2 w-20">Action</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {props.settings.data.map((setting,key) => (
                            <tr>
                                <td className="border px-2 py-2">
                                    <Checkbox name="setting[]" value={setting.id} handleChange={handleChange} />
                                </td>
                                <td className="border px-2 py-2">
                                    {/* {props.firstitem + key} */}
                                    {setting.id}
                                </td>

                                {/* {{ ($products->currentpage()-1) * $products->perpage() + $key + 1 }} */}

                                <td className="border px-2 py-2"><UserDetailPopup userName={setting?.user?.username} userId={setting?.user?.id} /></td>
                                <td className="border px-2 py-2">{ setting.name }</td>
                                <td className="border px-2 py-2">{ setting?.screen_first?.banner_height }</td>
                                <td className="border px-2 py-2">{ setting?.screen_first?.banner_border }</td>
                                <td className="border px-2 py-2">{ setting?.screen_first?.center_text }</td>
                                <td className="border px-2 py-2">{ setting?.screen_first?.right_text }</td>
                                <td className="border px-2 py-2"><input type='color' value={ setting?.screen_first?.banner_color } readOnly /></td>
                                <td className="border px-2 py-2"><input type='color' value={ setting?.screen_first?.text_color } readOnly /></td>
                                <td className="border px-2 py-2">{ setting.remark }</td>

                                    {
                                        RoleManageArray.roles.settings == 2 && (
                                            <td className="border px-2 py-2">
                                                <div className='row'>
                                                    <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("settings.edit", setting.id)}>
                                                        Edit
                                                    </Link>
                                                </div>


                                                <div className='row mt-2'>
                                                    <button
                                                        onClick={destroy}
                                                        id={setting.id}
                                                        tabIndex="-1"
                                                        className="btn btn-danger waves-effect waves-light"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )
                                    }



                            </tr>
                        ))}


                        {props.settings.data.length === 0 && (
                            <tr>
                                <td
                                    className="px-6 py-4 border-t"
                                    colSpan="11"
                                    style={{textAlign:"center"}}
                                >
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Paginate datas={props.settings} />

            </div>

        </Authenticated>
    );
}
