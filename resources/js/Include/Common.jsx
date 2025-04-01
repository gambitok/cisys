import React from 'react';
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import moment from 'moment';

const Common = () => {
    const makeUrlWithSearchAndOrder = (route,search,o,ob,user_id,ldap=false) => {
        if (ldap) {
            if (user_id) {
                return changeUrlWithSearchAndOrder(route+'?s='+search+'&ob='+ob+'&o='+o+'&ldap='+ldap+'&user_id='+user_id);
            } else {
                return changeUrlWithSearchAndOrder(route+'?s='+search+'&ob='+ob+'&o='+o+'&ldap='+ldap);
            }
        } else {
            if (user_id) {
                return changeUrlWithSearchAndOrder(route+'?s='+search+'&ob='+ob+'&o='+o+'&user_id='+user_id);
            } else {
                return changeUrlWithSearchAndOrder(route+'?s='+search+'&ob='+ob+'&o='+o);
            }
        }
    }
    const changeUrlWithSearchAndOrder = (url) => {
        Inertia.visit(url);
    }
    const makeSortOrderLink = (linktext,route,columnname,search,o,ob,user_id,ldap=false) => {
        return (
            <Link
                className=""
                href={route+'?s='+search+'&ob='+columnname+'&o='+(o == 'DESC'?'ASC':'DESC')+(ldap?'&ldap=true':'')+(user_id?'&user_id='+user_id:'')}
            >
                {linktext}
            </Link>
        );
    }
    const makeDateFormate = (date,general_settings) => {
        let formattedDate = '-';
        if(date != null){
            const inputDate = new Date(date);
            formattedDate = moment(inputDate).format(general_settings.format_date);

        }
        return formattedDate;
    }

    return {
        makeUrlWithSearchAndOrder,
        changeUrlWithSearchAndOrder,
        makeSortOrderLink,
        makeDateFormate
    }
  }

  export default Common();
