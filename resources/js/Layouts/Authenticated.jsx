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
        <div className="min-h-screen allpage-img bg-gray-100">

            <CustomHeadMake title={headtitle} auth={auth} />
            
            
            <div className='container-fluid'>
                <div className='row flex-nowrap'>

                    {toggle && <div className='col-6 col-md-2 bg-white p-0'>
                        <Sidebar company_name={props.general_settings.company_name} logo={props.general_settings.logo}  />
                    </div>}


                    <div className='col p-0 overflow-hidden'>
                        
                        <Nav Toggle={Toggle} auth={auth} header={header} />
                        
                        <div className='container-fluid'>
                            <div className="py-3">
                                <div className="mx-auto sm:px-6 lg:px-0">
                                    {/* <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg"> */}
                                    <div className="bg-white shadow-sm sm:rounded-lg">
                                        <div className="p-2 bg-white border-b border-gray-200">
                                            
                                            {/* {flash.success && (
                                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                    <strong>Success !</strong> {flash.success}
                                                </div>
                                            )}

                                            {flash.error && (
                                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                    <strong>Error !</strong> {flash.error}
                                                </div>
                                            )} */}
                                            {showSuccess && (
                                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                                    <strong>Success!</strong> {flash.success}
                                                </div>
                                            )}

                                            {showError && (
                                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                    <strong>Error!</strong> {flash.error}
                                                </div>
                                            )}
                                            
                                            <main>{children}</main>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


            
            {/* <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto text-gray-500" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    Posts
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav> */}

            {/* {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )} */}

            
            {/* <button type="button" id='UserDetailPopupOpen' className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#UserDetailPopupOpen" style={{display:'none'}}>
                Launch demo modal
            </button>

                
            <div className="modal fade" id="UserDetailPopupOpen" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        test

                    </div>
                </div>
            </div> */}

            <button type="button" id='UserDetailPopupOpenButton' className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#UserDetailPopupOpen" style={{display:'none'}}>
                Launch demo modal
            </button>

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
