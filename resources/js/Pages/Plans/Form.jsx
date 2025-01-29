import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import Select from 'react-select';
import { Head, Link, useForm } from '@inertiajs/inertia-react';


export default function Form({ data,errors,setData,types,products,coupons }) {
    
    const optionChanged = value => {
        setData("role_id",value.value);
    };
    const typeval = types.find(obj => {
        return obj.value === data.role_id;
    });

    const optionChangedCoupon = value => {
        setData("coupon_id",value.value);
    };

    const couponval = coupons.find(obj => {
        return obj.value === data.coupon_id;
    });

    const optionChangedProduct = value => {
        setData("product_id",value.value);
    };
    const productval = products.find(obj => {
        return obj.value === data.product_id;
    });
    
    return (
       <div>

            <div className='row g-3 my-2'>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel value="Product" />
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={productval}
                            name="product_id"
                            options={products}
                            onChange={optionChangedProduct}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                        />
                        <InputError message={errors.product_id} className="mt-2" />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Package Name" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Package Name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>

              
            </div>


            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="qty" value="Qty" />
                        <TextInput
                            id="qty"
                            value={data.qty}
                            onChange={(e) => setData('qty', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Qty"
                        />
                        <InputError message={errors.qty} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="price" value="Price" />
                        <TextInput
                            id="price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Price"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>
                </div>

            </div>

           
            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="coupon_code" value="Coupon Code" /* style={{width: "90%",display: "inline-block"}} */ />
                        {/* <span style={{float: "right",cursor: "pointer",width: "auto",display: "inline-block",color: "#6967d7"}} onClick={clearCouponCode}>Clear</span> */}
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={couponval}
                            name="coupon_id"
                            options={coupons}
                            onChange={optionChangedCoupon}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                        />
                        <InputError message={errors.coupon_id} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <label htmlFor="rate" className={`block font-medium text-sm text-gray-700 `}>
                        Standalone Surcharge {/* <small style={{fontSize: "10px"}}>(Percentage)</small> */}
                        </label>
                        <TextInput
                            id="rate"
                            value={data.standalone}
                            onChange={(e) => setData('standalone', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="e.g. 40%..."
                        />
                        <InputError message={errors.standalone} className="mt-2" />
                    </div>
                </div>

                
            </div>
            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel value="User type" />
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={typeval}
                            name="role_id"
                            options={types}
                            onChange={optionChanged}
                            styles={{option: (styles, state) => ({...styles,cursor: 'pointer',}),control: (styles) => ({...styles,cursor: 'pointer',}),}}
                        />
                        <InputError message={errors.role_id} className="mt-2" />
                    </div>
                </div>
            </div>



            

            
            <div className="mt-4 formsubmitbutton">
                <button
                    type="submit"
                    className="btn btn-success waves-effect waves-light"
                >
                    Save
                </button>
                <Link
                    className="btn btn-primary waves-effect waves-light"
                    href={ route("plans.index") }
                >
                    Back
                </Link>
            </div>
        
       </div>
    );
}
