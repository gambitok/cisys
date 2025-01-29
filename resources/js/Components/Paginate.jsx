import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function Checkbox({ datas }) {

    const renderPaginationLinks = () => {
        return <ul className="pagination">
            {
                datas.links?.map((link,index) => (
                    <li key={index} className="page-item">
                        
                        <Link
                            href={link.url}
                            className={`page-link ${link.active ? 'active' : ''}`}
                        >
                            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
                        </Link>

                    </li>
                ))
            }
        </ul>
    }

    return (
        <div className="my-0 d-flex justify-content-between">
            <div>
                Showing {datas.from} to {datas.to} from {datas.total} results.
            </div>
            <div>
                {renderPaginationLinks()}
            </div>
        </div>
    );
}
