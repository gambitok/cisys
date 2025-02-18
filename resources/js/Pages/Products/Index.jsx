import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import Paginate from '@/Components/Paginate';
import Common from '@/Include/Common';
import TabelSearchBox from '@/Components/TabelSearchBox';
import Checkbox from '@/Components/Checkbox';
import $ from 'jquery';

export default function Index(props) {

    function destroy(e) {
        if (confirm("Are you sure you want to delete this role?")) {
            Inertia.delete(route("products.destroy", e.currentTarget.id));
        }
    }

    const { data, setData, errors, post } = useForm({
        "products": "",
    });

    const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("products", [...data.products, id])
        : setData(
            "products",
            data.products.filter((item) => {
                return item !== id;
            })
        );
    };

    function allCheckboxCheckedCode(){
        let allproducts = [];
        props.products.data.map((product) => (
            allproducts.push(String(product.id))
        ))
        setData("products", allproducts)

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode(){
        let allproducts = [];
        setData("products", allproducts)

        $("#unselectAll").hide();
        $("#selectAll").show();

        $("input[type='checkbox']").prop("checked", false);
    }

    function checkBoxValided(){
        $(".alert").remove();
        if (data.products == '') {
            $("<div class='alert alert-danger'>Please select any product</div>").insertBefore("main");
        } else {
            if (confirm("Are you sure you want to delete that settings?")) {
                post(route("products.multiple.delete"));
                $("input[type='checkbox']").prop("checked", false);
            }
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Products'}
            headtitle={'Products'}
        >

            {RoleManageArray.roles.products == 2 && (
                <div className="flex items-center justify-between mb-6 float-end create-button-listing">
                    <a className="btn btn-danger waves-effect waves-light mr-5" href='javascript:void(0)' onClick={checkBoxValided}>
                        Delete Products
                    </a>
                    <Link className="btn btn-primary waves-effect waves-light" href={ route("products.create") } >
                        Create product
                    </Link>
                </div>
            )}

            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='products' />

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
                                {Common.makeSortOrderLink('ID','products','id',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Product','products','name',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Version','products','version',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Edition','products','edition',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('OS','products','os',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Price (USD)','products','price',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Unit','products','unit',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('Tax','products','tax',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">
                                Size
                            </th>
                            <th className="px-2 py-2 w-20">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.products.data.map((product,key) => (
                            <tr>
                                <td className="border px-2 py-2">
                                    <Checkbox name="products[]" value={product.id} handleChange={handleChange} />
                                </td>
                                <td className="border px-2 py-2">
                                    {/* { props.firstitem+key } */}
                                    { product.id }
                                </td>
                                <td className="border px-2 py-2">{ product.name }</td>
                                <td className="border px-2 py-2">{ product.version }</td>
                                <td className="border px-2 py-2">{ product.edition }</td>
                                <td className="border px-2 py-2">{ product.os }</td>
                                <td className="border px-2 py-2">{ product.price }</td>
                                <td className="border px-2 py-2">{ product.unit }</td>
                                <td className="border px-2 py-2">{ product.tax }</td>
                                <td className="border px-2 py-2"></td>

                                <td className="border px-2 py-2">

                                    <div className='row'>
                                        <a style={{textAlign: "center"}} className="btn btn-primary waves-effect waves-light" href={ product.download_url } download> Download </a>
                                    </div>

                                    {RoleManageArray.roles.products == 2 && (
                                            <div className='row mt-2'>
                                                <Link tabIndex="1" className="btn btn-primary waves-effect waves-light" href={route("products.edit", product.id)}>
                                                    Edit
                                                </Link>
                                            </div>
                                        )
                                    }

                                    {RoleManageArray.roles.products == 2 && (
                                            <div className='row mt-2'>
                                                <button
                                                    onClick={destroy}
                                                    id={product.id}
                                                    tabIndex="-1"
                                                    className="btn btn-danger waves-effect waves-light"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )
                                    }

                                </td>
                            </tr>
                        ))}

                        {props.products.data.length === 0 && (
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

                <Paginate datas={props.products} />

           </div>

        </Authenticated>
    );
}
