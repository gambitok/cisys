import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';

export default function Dashboard(props) {

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Welcome'}
            headtitle={'Welcome'}
        >

            <div className='row' style={{padding:"10px 0px"}}>
                <div className="home-title">
                    <b>
                        Application :
                        <br />
                        <br />
                        Company :
                        <br />
                        <br />
                        Full Name :
                        <br />
                        <br />
                        Email :
                        <br />
                        <br />
                        Username :
                        <br />
                        <br />
                        Role Group :
                    </b>
                </div>
                <div className="home-value">
                    SOFTWARE PORTAL
                    <br />
                    <br />
                    CYBER INTEL SYSTEMS
                    <br />
                    <br />
                    {props.auth.user.name}
                    <br />
                    <br />
                    {props.auth.user.email}
                    <br />
                    <br />
                    {props.auth.user.username}
                    <br />
                    <br />
                    {props.rolename}
                </div>
            </div>
            

            
        </Authenticated>
    );
}
