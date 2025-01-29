import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/inertia-react';


export default function Form({ data,errors,setData }) {
 
    
    return (
       <div>

            <div className='row g-3 my-2'>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="name" value="Product" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Product"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="price" value="Price (USD)" />
                        <TextInput
                            id="price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Product"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>
                </div>

            </div>

            <div className='row g-3 my-2'>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="version" value="Software Version" />
                        <TextInput
                            id="version"
                            value={data.version}
                            onChange={(e) => setData('version', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Software Version"
                        />
                        <InputError message={errors.version} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="edition" value="Edition" />
                        <TextInput
                            id="edition"
                            value={data.edition}
                            onChange={(e) => setData('edition', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Edition"
                        />
                        <InputError message={errors.edition} className="mt-2" />
                    </div>
                </div>

            </div>

            <div className='row g-3 my-2'>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="os" value="OS" />
                        <TextInput
                            id="os"
                            value={data.os}
                            onChange={(e) => setData('os', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="OS"
                        />
                        <InputError message={errors.os} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="unit" value="Unit" />
                        <TextInput
                            id="unit"
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Unit"
                        />
                        <InputError message={errors.unit} className="mt-2" />
                    </div>
                </div>

            </div>

            <div className='row g-3 my-2'>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="tax" value="Tax" />
                        <TextInput
                            id="tax"
                            value={data.tax}
                            onChange={(e) => setData('tax', e.target.value)}
                            type="number"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Tax"
                        />
                        <InputError message={errors.tax} className="mt-2" />
                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="mb-3">
                        <InputLabel htmlFor="download_url" value="Download URL" />
                        <TextInput
                            id="download_url"
                            value={data.download_url}
                            onChange={(e) => setData('download_url', e.target.value)}
                            type="text"
                            className="mt-1 block w-full form-control"
                            autoComplete="off"
                            placeholder="Download URL"
                        />
                        <InputError message={errors.download_url} className="mt-2" />
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
                    href={ route("products.index") }
                >
                    Back
                </Link>
            </div>
        
       </div>
    );
}
