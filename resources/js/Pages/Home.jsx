import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';

export default function Home(props) {
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Home'}
            headtitle={'Home'}
        >
            <div className="row" style={{ padding: "10px 0px" }}>
                {/* Existing user content */}
                <div className="home-title">
                    <b>
                        Application :<br /><br />
                        Company :<br /><br />
                        Full Name :<br /><br />
                        Email :<br /><br />
                        Username :<br /><br />
                        Role Group :
                    </b>
                </div>
                <div className="home-value">
                    SOFTWARE PORTAL<br /><br />
                    CYBER INTEL SYSTEMS<br /><br />
                    {props.auth.user.name}<br /><br />
                    {props.auth.user.email}<br /><br />
                    {props.auth.user.username}<br /><br />
                    {props.rolename}
                </div>
            </div>

            <hr/>

            {/* New content: Dashboard data */}
            <div className="row" style={{margin: "0px"}}>
                {props.dashboardData.map((stastic) => (
                    <div className="col-md-3 p-3" key={stastic.name}>
                        <Link href={stastic.link} style={{color:"#000"}}>
                            <div className="row bg-gray-200 rounded pt-2 pb-2 border">
                                <div className="col">
                                    <p className='fs-5'>{stastic.name}</p>
                                    <h3 className='fs-2'>{stastic.count}</h3>
                                </div>
                                <div className="col-auto">
                                    <i className={stastic.icon + ' p-3 fs-1'}></i>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </Authenticated>
    );
}
