import React, { useState } from 'react';
import { Inertia } from "@inertiajs/inertia";
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Select from 'react-select';
import $ from 'jquery';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Create(props) {
    console.log(props.plans);
    const [clients, setClients] = useState("-");
    const [productname, setProductname] = useState("");
    const [pricing, setPricing] = useState("-");
    const [subtotal, setSubtotal] = useState("-");
    const [coupon, setCoupon] = useState("-");
    const [couponcode, setCouponcode] = useState();
    const [couponprice, setCouponprice] = useState("-");
    const [tax, setTax] = useState("-");
    const [total, setTotal] = useState("-");
    const [standaloneval, setStandaloneval] = useState("-");
    const [standalone, setStandalone] = useState(false);
    const [standalonetot, setStandalonetot] = useState("-");
    const [serverqty, setServerqty] = useState(0);
    const [standalone_status, setStandaloneStatus] = useState(0); // New state for standalone_status

    const yearOptions = [];
    for (let i = 1; i < 16; i++) {
        yearOptions.push({ value: i, label: i + " Year" });
    }

    const { data, setData, errors, post } = useForm({
        plan_id: "",
        expiry_year: 1,
        customclients: 1,
    });

    const yearValue = yearOptions.find(obj => obj.value === data.expiry_year);

    function handleSubmit(e) {
        e.preventDefault();
        post(route("licenses.store"));
    }

    const optionChanged = value => {
        $("input[type='checkbox']").prop("checked", false);
        var plan = findArrayElementById(props.all_plans, value.value);
        var sendcouponplan = '';
        var sendcustomclients = plan.qty;
        setStandaloneval(plan.standalone);
        setStandaloneStatus(plan.standalone_status); // Set standalone_status from plan
        const newData = { ...data };
        newData.plan_id = value.value;
        newData.customclients = sendcustomclients;
        setData(newData);

        if (plan && plan.product) {
            setProductname(plan.product.name);
        } else {
            setProductname('');
        }

        if (plan?.coupon) {
            setCouponcode(plan.coupon.code);
            sendcouponplan = plan.coupon.code;
        } else {
            setCouponcode('');
        }
        changeTotal(value.value, data.expiry_year, sendcustomclients, sendcouponplan);
    };

    const yearOptionChanged = value => {
        setData("expiry_year", value.value);
        changeTotal(data.plan_id, value.value, data.customclients, couponcode);
    };

    const customClientChanged = value => {
        setData("customclients", value);
        changeTotal(data.plan_id, data.expiry_year, value, couponcode);
    };

    const onHandleChange = event => {
        const isChecked = event.target.checked;
        setStandalone(true);
        changeTotal(data.plan_id, data.expiry_year, isChecked, couponcode);
    };

    const couponCheckCode = value => {
        setCouponcode(value);
        changeTotal(data.plan_id, data.expiry_year, data.customclients, value);
    };

    function changeTotal(plan_id, expiry_year, customclients, couponcode) {
        if (plan_id) {
            var plan = findArrayElementById(props.all_plans, plan_id);
            var tempsubtotal = plan_id == 2 ? Number(plan.price * expiry_year * customclients).toFixed(2) : Number(plan.price * expiry_year).toFixed(2);
            $('#coupon-input-text-box').toggle(plan_id == 2);
            setClients(plan.qty);
            if (customclients == true) {
                if (plan_id == 1) {
                    setPricing('$' + Number(tempsubtotal).toFixed(2) + ' (' + plan.qty + ' Server +' + plan.qty + ' Client x 14-Days)');
                    setServerqty(plan.qty);
                } else {
                    setPricing('$' + Number(tempsubtotal).toFixed(2) + ' (' + customclients + ' Server +' + customclients + ' Client x ' + expiry_year + '-Year)');
                    setServerqty(customclients);
                }
            } else {
                setServerqty(0);
                if (plan_id == 1) {
                    setPricing('$' + Number(tempsubtotal).toFixed(2) + ' (1 Server + ' + plan.qty + ' Client x 14-Days)');
                } else {
                    setPricing('$' + Number(tempsubtotal).toFixed(2) + ' (1 Server + ' + customclients + ' Client x ' + expiry_year + '-Year)');
                }
            }
            setSubtotal(Number(tempsubtotal).toFixed(2));
            var standalonetotal = customclients == true ? ((parseFloat(tempsubtotal) * standaloneval) / 100).toFixed(2) : 0;
            setStandalonetot(standalonetotal);
            var stand = Number(parseFloat(tempsubtotal) + parseFloat(standalonetotal)).toFixed(2);
            var temprate = Number(applyCouponCode(couponcode, customclients));
            var tempcouponprice = 0;
            var temps = 0;
            if (temprate > 0) {
                tempcouponprice = ((parseFloat(stand) * parseFloat(temprate)) / 100).toFixed(2);
                temps = stand - tempcouponprice;
                setCouponprice(tempcouponprice);
                setCoupon(temprate);
            } else {
                temps = stand;
                setCouponprice(tempcouponprice);
                setCoupon(0);
            }
            var temptax = ((parseFloat(temps) * 10.5) / 100).toFixed(2);
            setTax(temptax);
            setTotal(Number(parseFloat(temps) + parseFloat(temptax)).toFixed(2));
        }
    }

    function findArrayElementById(array, id) {
        return array.find(element => element.id === id);
    }

    function stripeCheckout(e) {
        e.preventDefault();
        var postFormStr = "<form method='POST' action='" + route("stripe.payment") + "'>\n";
        postFormStr += "<input type='hidden' name='ammount' value='" + total + "'></input>";
        postFormStr += "<input type='hidden' name='subtotal' value='" + subtotal + "'></input>";
        postFormStr += "<input type='hidden' name='plan_id' value='" + data.plan_id + "'></input>";
        postFormStr += "<input type='hidden' name='expiry_year' value='" + data.expiry_year + "'></input>";
        postFormStr += "<input type='hidden' name='couponcode' value='" + couponcode + "'></input>";
        postFormStr += "<input type='hidden' name='serverqty' value='" + serverqty + "'></input>";
        postFormStr += "</form>";
        var formElement = $(postFormStr);
        $('body').append(formElement);
        $(formElement).submit();
    }

    function paypalCheckout(e) {
        e.preventDefault();
        var postFormStr = "<form method='POST' action='" + route("paypalProcess") + "'>\n";
        postFormStr += "<input type='hidden' name='ammount' value='" + total + "'></input>";
        postFormStr += "<input type='hidden' name='subtotal' value='" + subtotal + "'></input>";
        postFormStr += "<input type='hidden' name='plan_id' value='" + data.plan_id + "'></input>";
        postFormStr += "<input type='hidden' name='expiry_year' value='" + data.expiry_year + "'></input>";
        postFormStr += "<input type='hidden' name='couponcode' value='" + couponcode + "'></input>";
        postFormStr += "<input type='hidden' name='serverqty' value='" + serverqty + "'></input>";
        postFormStr += "</form>";
        var formElement = $(postFormStr);
        $('body').append(formElement);
        $(formElement).submit();
    }

    function applyCouponCode(couponcode, customclients) {
        $(".invalid-feedback").remove();
        if (couponcode == '') return 0;
        var res = 0;
        $.ajax({
            type: "POST",
            url: route("licenses.check-coupon-valid"),
            data: { couponcode: couponcode, customclients: customclients },
            dataType: "JSON",
            async: false,
        }).done(function (responce) {
            if (responce.success == 0) {
                $('#coupon-input-text-box').append("<div class='invalid-feedback' style='display: block;text-align: left;'>" + responce.message + "</div>");
                res = 0;
            } else {
                res = responce.rate;
            }
        });
        return res;
    }

    return (
        <Authenticated props={props} auth={props.auth} errors={props.errors} header={'Add License'}>
            <Head title="Add License" />
            <form name="createForm" onSubmit={handleSubmit}>
                <div className='row g-3 my-2'>
                    <div className='col-md-12'>
                        <div>
                            <table className="table">
                                <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-2">License Package Name</th>
                                    {data.plan_id != 1 ? <th className="px-4 py-2">Year</th> : ''}
                                    <th className="px-4 py-2">Version</th>
                                    <th className="px-4 py-2"># of Client</th>
                                    {(standalone_status === 1 && standaloneval > 0) && <th className="px-4 py-2">Standalone Mode</th>}
                                    <th className="px-4 py-2">Pricing</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border px-4 py-2">
                                        <div className="mb-3">
                                            <small style={{ fontSize: '15px', fontWeight: 'bold' }}>{productname}</small>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="plan_id"
                                                options={props.plans}
                                                onChange={optionChanged}
                                                styles={{ option: (styles, state) => ({ ...styles, cursor: 'pointer' }), control: (styles) => ({ ...styles, cursor: 'pointer' }) }}
                                            />
                                        </div>
                                        <InputError message={errors.plan_id} className="mt-2" />
                                    </td>
                                    {data.plan_id != 1 ? <td className="border px-4 py-2"><div className="mb-3"> <Select className="basic-single" classNamePrefix="select" name="year" styles={{ option: (styles, state) => ({ ...styles, cursor: 'pointer' }), control: (styles) => ({ ...styles, cursor: 'pointer' }) }} options={yearOptions} value={yearValue} onChange={yearOptionChanged} /></div></td> : ''}
                                    <td className="border px-4 py-2">v2.x</td>
                                    <td className="border px-4 py-2" id='clentCount' style={{ width: '200px' }}>
                                        {clients == 0 ?
                                            <TextInput
                                                id="customclients"
                                                value={data.customclients}
                                                onChange={(e) => customClientChanged(e.target.value)}
                                                type="number"
                                                min="1"
                                                className="mt-1 block w-full form-control"
                                                autoComplete="off"
                                                placeholder="Name"
                                            />
                                            : clients
                                        }
                                    </td>
                                    {(standalone_status === 1 && standaloneval > 0) && (
                                        <td className="border px-4 py-2 ">
                                            <label className="flex items-center" style={{ display: 'block', margin: 'auto' }}>
                                                <Checkbox name="remember" value={standaloneval} handleChange={onHandleChange} />
                                            </label>
                                        </td>
                                    )}
                                    <td className="border px-4 py-2">{pricing}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='col-md-8'></div>
                    <div className='col-md-4'>
                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td className="border px-4 py-2 text-right"><span className='checkoutTotalTextTitle'>Subtotal :</span> <span className='checkoutTotalText'>{subtotal == '-' ? '-' : '$' + subtotal}</span></td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 text-right" style={{ display: standalonetot != 0 ? "block" : "none" }}><span className='checkoutTotalTaxTextTitle'>Standalone Surcharge : {standalonetot == '-' ? '-' : +standaloneval + '% (+$' + standalonetot + ')'}</span></td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 text-right">
                                        <span className='checkoutTotalTaxTextTitle'>Discount : {coupon == '-' ? '-' : coupon + '% (-$' + couponprice + ') OFF'}</span>
                                        <div id="coupon-input-text-box">
                                            <TextInput
                                                type="text"
                                                onChange={(e) => couponCheckCode(e.target.value)}
                                                className="mt-1 block w-full form-control"
                                                autoComplete="current-name"
                                                placeholder="Coupon code"
                                                value={couponcode}
                                                id="coupon-input-box"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 text-right"><span className='checkoutTotalTaxTextTitle'>Sales Tax : {tax == '-' ? '-' : '10.5% (+$' + tax + ')'}</span></td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 text-right"><span className='checkoutTotalTextTitle'>Total :</span> <span className='checkoutTotalText'>{total == '-' ? '-' : '$' + total}</span></td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">
                                        <div className="mt-4 formsubmitbutton">
                                            {
                                                total < 0 || total == 0 || total == '-' ?
                                                    <button type="submit" className="px-6 py-2 font-bold text-white bg-green-500 rounded" style={{ width: '100%' }}>Checkout</button>
                                                    :
                                                    <div>
                                                        <button onClick={stripeCheckout} className="px-6 py-2 font-bold text-white bg-green-500 rounded" style={{ width: '100%' }}>Stripe checkout</button>
                                                        <br /><br />
                                                        <button onClick={paypalCheckout} className="px-6 py-2 font-bold text-white bg-green-500 rounded" style={{ width: '100%' }}>Paypal checkout</button>
                                                    </div>
                                            }
                                            <br />
                                            <Link className="px-6 py-2 text-white bg-blue-500 rounded-md focus:outline-none" href={route("licenses.index")} style={{ marginLeft: "0px", width: "100%", textAlign: "center" }}>Back</Link>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </form>
        </Authenticated>
    );
}
