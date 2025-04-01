import React, { useState,useEffect } from 'react';
import { Link,usePage } from '@inertiajs/inertia-react';
import Sidebar from '@/Layouts/Sidebar';
import Nav from '@/Layouts/Nav';
import CustomHeadMake from '@/Components/CustomHeadMake';

export default function Authenticated({ props, auth, header, children, headtitle }) {
    const { flash } = usePage().props
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const successTimer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
            return () => clearTimeout(successTimer);
        }
        if (flash.error) {
            setShowError(true);
            const errorTimer = setTimeout(() => {
                setShowError(false);
            }, 5000);
            return () => clearTimeout(errorTimer);
        }
    }, [flash.success, flash.error]);

    const [toggle, setToggle] = useState(true);
    const Toggle = () => {
        setToggle(!toggle)
    }
    window.matchMedia("(min-width: 760px)").addEventListener('change', e => setToggle( e.matches ));

    return (
        <div className="min-h-screen bg-gray-100">
            <CustomHeadMake title={headtitle} auth={auth} />
            <div className='container-fluid'>
                <div className='row flex-nowrap'>
                    {toggle && <div className='col-6 col-md-2 bg-white p-0'><Sidebar company_name={props.general_settings.company_name} logo={props.general_settings.logo}  /></div>}
                    <div className='col p-0 overflow-hidden'>
                        <Nav Toggle={Toggle} auth={auth} header={header} />
                        <div className='container-fluid'>
                            <div className="py-3">
                                <div className="mx-auto sm:px-6 lg:px-0">
                                    <div className="shadow-sm sm:rounded-lg">
                                        <div className="p-2 border-b border-gray-200">
                                            {showSuccess && <div className="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> {flash.success}</div>}
                                            {showError && <div className="alert alert-danger alert-dismissible fade show" role="alert"><strong>Error!</strong> {flash.error}</div>}
                                            <main>{children}</main>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" id='UserDetailPopupOpenButton' className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#UserDetailPopupOpen" style={{display:'none'}}></button>
            <div className="modal fade" id="UserDetailPopupOpen" tabindex="-1" aria-labelledby="" aria-hidden="true">
                <div className="modal-dialog" style={{minWidth: "65%"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="">User information</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>Please select username.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
