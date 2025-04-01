import React from 'react';
import { Link, useForm } from '@inertiajs/inertia-react';
import TextInput from '@/Components/TextInput';
import $ from 'jquery';
import Common from '@/Include/Common';

export default function TabelSearchBox({ s,o,ob,user_id,route,ldap=false }) {

    const { data, setData } = useForm({
        search: s || "",
    });

    // typing stop in search after 1 second call function
    var typingTimer;
    var doneTypingInterval = 1000;
    $('#search').keyup(function(){
        clearTimeout(typingTimer);
        if ($('#search').val) {
            typingTimer = setTimeout(function(){
                var search = $("#search").val();
                Common.makeUrlWithSearchAndOrder(route,search,o,ob,user_id,ldap);
            }, doneTypingInterval);
        }
    });

    return (
        <div className="flex items-center justify-between mb-6 float-start">
            <TextInput
                id="search"
                type="text"
                onChange={(e) => setData('search', e.target.value)}
                className="mt-1 block w-full form-control"
                autoComplete="current-name"
                placeholder="Search"
                value={data.search}
                autoFocus
            />
        </div>
    );
}
