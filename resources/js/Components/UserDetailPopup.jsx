import React from 'react';
import $ from 'jquery';

export default function UserDetailPopup({ userName,userId }) {

    function UserDetailPopupOpen() {
        $("#UserDetailPopupOpen .modal-body").html("");

        $.ajax({
            url: route("get-user-data-popup",userId),
            success: function(result){
                $("#UserDetailPopupOpen .modal-body").html(result.html);
            }
        });

        $('#UserDetailPopupOpenButton').trigger("click");
    }

    return (
        <span onClick={UserDetailPopupOpen}>
            <a href='javascript:void(0)'>{userName}</a>
        </span>
    );
}
