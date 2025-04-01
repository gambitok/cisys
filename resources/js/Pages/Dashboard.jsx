import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';

export default function Dashboard(props) {
    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Dashboard'}
            headtitle={'Dashboard'}
        >
            <div className="row" style={{margin: "0px"}}>
                {props.datastastics.map((stastic) => (
                    <div className="col-md-3 p-3">
                        <Link href={stastic.link} style={{color:"#000"}}>
                            <div className="row bg-gray-200 rounded pt-2 pb-2 border">
                                <div className="col">
                                    <p className='fs-5'>{stastic.name}</p>
                                    <h3 className='fs-2'>{stastic.count}</h3>
                                </div>
                                <div className="col-auto">
                                    <i className={stastic.icon+' p-3 fs-1'}></i>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </Authenticated>
    );
}
