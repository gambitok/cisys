import React from 'react';
import Dropdown from '@/Components/Dropdown';
import ThemeSwitcher from '@/Components/ThemeSwitcher';

export default function Nav({Toggle,auth,header}) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">

                <div className="navbar-collapse pr-5 pl-5" id="navbarText">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-10 col-12">
                                <ul className="navbar-nav mr-auto w-100">
                                    <li className="nav-item">
                                        <i className="navbar-brand bi bi-justify-left fs-4 cursor-pointer" onClick={Toggle} style={{color: 'black'}}></i>
                                    </li>
                                    <li>
                                        <span className="inline-flex rounded-md custom-nav-title">{header}</span>
                                    </li>
                                    <li className="float-right">
                                        <ThemeSwitcher />
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-12">
                                <span className="navbar-text">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth.user.name} {
                                            auth.role_name != '' ? '('+auth.role_name+')':''
                                        }

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
                                    <Dropdown.Link href={route('profile.edit')} method="get" as="button">
                                        Edit profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
