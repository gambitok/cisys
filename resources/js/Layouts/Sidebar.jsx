import React,{ useEffect, useState }  from 'react';
import NavLink from '@/Components/NavLink';
import NavDropdownLink from '@/Components/NavDropdownLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import {Collapse} from 'react-bootstrap'
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Sidebar({company_name,logo}) {

    // const [printbutton, setPrintbutton] = useState(null);

    /* function checkRole(rolename) {
        fetch(route("checkRoleGetApi")+'?route=1', {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            // setPrintbutton(data);
            setPrintbutton(rolename);
        })
        .catch((error) => console.log(error));
    } */

    /* const [data,setData] = useState();

    RoleManageArray.menus.forEach((menu, index) => {
        setData({...data, [index]: menu.name});
    });

    console.log(data) */


    /* const [cicb, setCicb] = useState(route().current('settings*') || route().current('groups*') || route().current('products*') || route().current('clients*') || route().current('licenses*'));
    const Cicb = () => {
        setCicb(!cicb)
    }

    const [sales, setSales] = useState(route().current('coupons*') || route().current('coupon-history*') || route().current('transactions*'));
    const Sales = () => {
        setSales(!sales)
    }

    const [users, setUsers] = useState(route().current('users*') || route().current('roles*'));
    const Users = () => {
        setUsers(!users)
    }

    const [settings, setSettings] = useState(route().current('setting.general*') || route().current('plans*') || route().current('icons*') || route().current('menus*'));
    const Settings = () => {
        setSettings(!settings)
    } */

    const [data, setData] = useState();
    const Customdropdown = (idname) => {
        setData({...data, [idname]: !data?.[idname]});
    }

    function loadDataOnlyOnce() {
        RoleManageArray.menus.forEach((menu) => {
            menu.submenu.forEach((submenu) => {
                if (route().current(submenu.route+'*')) {
                    Customdropdown(menu.idname)
                }
            });
        });
    }

    // This function will called only once
    useEffect(() => {
        loadDataOnlyOnce();
    }, [])

    return (
        <div className='sidebar' style={{ height: '99%', minHeight: '98.5vh' }} >
            <div>
                <span className="brand-name fs-5">

                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" siteLogo={logo} />

                </span>
            </div>
            <hr className="text-dark" style={{marginBottom: "0px"}} />

            <div className="list-group list-group-flush">

                <NavLink href={route('home')} active={route().current('home')}>
                    <i className="bi bi-house fs-6 me-3"></i>
                    <span className='fs-6'>Home</span>
                </NavLink>

                {RoleManageArray.menus.map((menu) => (
                    <>

                        <NavDropdownLink onClick={() => Customdropdown(menu.idname)} open={data?.[menu.idname] ? data?.[menu.idname] : false}>
                            <i className={menu.icon+' fs-6 me-3'}></i>
                            <span className='fs-6'>{menu.name}</span>
                        </NavDropdownLink>

                        <Collapse in={data?.[menu.idname]}>
                            <div>
                                {menu.submenu.map((submenu) => (

                                    <>
                                        {submenu.customlink ?
                                            <a href={submenu.customlink} className='list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out' target='_blank'>
                                                <span className='fs-7'>- User Manual</span>
                                            </a>
                                            :
                                            <NavLink href={route(submenu.route+'.index')} active={route().current(submenu.route+'*')?true:false}>
                                                <span className='fs-7'>- {submenu.name}</span>
                                            </NavLink>
                                        }
                                    </>



                                ))}
                            </div>
                        </Collapse>


                        {/* <Collapse in={cicb}>
                            <div>
                                {
                                    RoleManageArray.indexOf("settings.index") > -1 && (
                                        <NavLink href={route('settings.index')} active={route().current('settings*')}>
                                            <span className='fs-7'>- Setting</span>
                                        </NavLink>
                                    )
                                }
                                {
                                    RoleManageArray.indexOf("groups.index") > -1 && (
                                        <NavLink href={route('groups.index')} active={route().current('groups*')}>
                                            <span className='fs-7'>- Group</span>
                                        </NavLink>
                                    )
                                }

                                <NavLink href={route('clients.index')} active={route().current('clients*')}>
                                    <span className='fs-7'>- Client</span>
                                </NavLink>

                                <NavLink href={route('licenses.index')} active={route().current('licenses*')}>
                                    <span className='fs-7'>- License</span>
                                </NavLink>

                                {
                                    RoleManageArray.indexOf("products.index") > -1 && (
                                        <NavLink href={route('products.index')} active={route().current('products*')}>
                                            <span className='fs-7'>- Software</span>
                                        </NavLink>
                                    )
                                }
                                <a href={"https://cyberintelsystems.com/category/documents/"} className='list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out' target='_blank'>
                                    <span className='fs-7'>- User Manual</span>
                                </a>
                            </div>
                        </Collapse> */}
                    </>
                ))}


                {/* <NavDropdownLink onClick={Cicb} open={cicb} active={route().current('settings*') || route().current('groups*') || route().current('products*') || route().current('clients*') || route().current('licenses*')}>
                    <i className="bi bi-laptop fs-6 me-3"></i>
                    <span className='fs-6'>CICB</span>
                </NavDropdownLink>

                <Collapse in={cicb}>
                    <div>
                        {
                            RoleManageArray.indexOf("settings.index") > -1 && (
                                <NavLink href={route('settings.index')} active={route().current('settings*')}>
                                    <span className='fs-7'>- Setting</span>
                                </NavLink>
                            )
                        }
                        {
                            RoleManageArray.indexOf("groups.index") > -1 && (
                                <NavLink href={route('groups.index')} active={route().current('groups*')}>
                                    <span className='fs-7'>- Group</span>
                                </NavLink>
                            )
                        }

                        <NavLink href={route('clients.index')} active={route().current('clients*')}>
                            <span className='fs-7'>- Client</span>
                        </NavLink>

                        <NavLink href={route('licenses.index')} active={route().current('licenses*')}>
                            <span className='fs-7'>- License</span>
                        </NavLink>

                        {
                            RoleManageArray.indexOf("products.index") > -1 && (
                                <NavLink href={route('products.index')} active={route().current('products*')}>
                                    <span className='fs-7'>- Software</span>
                                </NavLink>
                            )
                        }
                        <a href={"https://cyberintelsystems.com/category/documents/"} className='list-group-item py-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out' target='_blank'>
                            <span className='fs-7'>- User Manual</span>
                        </a>
                    </div>
                </Collapse>


                <NavDropdownLink onClick={Sales} open={sales} active={route().current('coupons*') || route().current('coupon-history*') || route().current('transactions*')}>
                    <i className="bi bi-archive fs-6 me-3"></i>
                    <span className='fs-6'>Sales</span>
                </NavDropdownLink>

                <Collapse in={sales}>
                    <div>
                        {
                            RoleManageArray.indexOf("coupons.index") > -1 && (
                                <NavLink href={route('coupons.index')} active={route().current('coupons*')}>
                                    <span className='fs-7'>- Coupon</span>
                                </NavLink>
                            )
                        }

                        <NavLink href={route('coupon-history.index')} active={route().current('coupon-history*')}>
                            <span className='fs-7'>- History</span>
                        </NavLink>

                        <NavLink href={route('transactions.index')} active={route().current('transactions*')}>
                            <span className='fs-7'>- Transaction</span>
                        </NavLink>
                    </div>
                </Collapse>

                <NavDropdownLink onClick={Users} open={users} active={route().current('users*') || route().current('roles*')}>
                    <i className="bi bi-people fs-6 me-3"></i>
                    <span className='fs-6'>User</span>
                </NavDropdownLink>


                <Collapse in={users}>
                    <div>
                        {
                            RoleManageArray.indexOf("users.index") > -1 && (
                                <NavLink href={route('users.index')} active={route().current('users*')}>
                                    <span className='fs-7'>- User</span>
                                </NavLink>
                            )
                        }
                        {
                            RoleManageArray.indexOf("roles.index") > -1 && (
                                <NavLink href={route('roles.index')} active={route().current('roles*')}>
                                    <span className='fs-7'>- User Group</span>
                                </NavLink>
                            )
                        }

                    </div>
                </Collapse>




                <NavDropdownLink onClick={Settings} open={settings} active={route().current('setting.general*') || route().current('plans*')}>
                    <i className="bi bi-gear fs-6 me-3"></i>
                    <span className='fs-6'>Setting</span>
                </NavDropdownLink>


                <Collapse in={settings}>
                    <div>
                        <NavLink href={route('setting.general')} active={route().current('setting.general*')}>
                            <span className='fs-7'>- General</span>
                        </NavLink>


                        <NavLink href={route('icons.index')} active={route().current('icons*')}>
                            <span className='fs-7'>- Icon</span>
                        </NavLink>


                        <NavLink href={route('menus.index')} active={route().current('menus*')}>
                            <span className='fs-7'>- Menu</span>
                        </NavLink>

                        {
                            RoleManageArray.indexOf("plans.index") > -1 && (
                                <NavLink href={route('plans.index')} active={route().current('plans*')}>
                                    <span className='fs-7'>- Plan</span>
                                </NavLink>
                            )
                        }
                    </div>
                </Collapse> */}



                <ResponsiveNavLink method="post" href={route('logout')} as="button" >
                    <i className="bi bi-power fs-6 me-3" style={{marginLeft:"-7px"}}></i>
                    <span className='fs-6'>Log Out</span>
                </ResponsiveNavLink>

            </div>




        </div>
    );
}
