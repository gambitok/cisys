import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { Inertia } from "@inertiajs/inertia";
import {RoleManageArray} from '@/Components/SidebarRolePermissionCheck';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import Checkbox from '@/Components/Checkbox';
import TabelSearchBox from '@/Components/TabelSearchBox';
import UserDetailPopup from '@/Components/UserDetailPopup';
import Common from '@/Include/Common';
import $ from 'jquery';
import TextInput from '@/Components/TextInput';
import Paginate from '@/Components/Paginate';
import parse from 'html-react-parser';
import SpanCopyKeyboad from '@/Components/SpanCopyKeyboad';

export default function Index(props) {

    function allCheckboxCheckedCode(){
        let alllicenses = [];
        props.licenses.data.map((license) => (
            alllicenses.push(String(license.id))
        ))
        setData("licenses", alllicenses)

        $("#unselectAll").show();
        $("#selectAll").hide();

        $("input[type='checkbox']").prop("checked", true);
    }

    function allCheckboxUncheckCode(){
        let alllicenses = [];
        setData("licenses", alllicenses)
        
        $("#unselectAll").hide();
        $("#selectAll").show();
        
        $("input[type='checkbox']").prop("checked", false);
    }

    const { data, setData, errors, post } = useForm({
        "licenses": "",
    });

    const handleChange = (e) => {
        let id = e.target.value;
        e.target.checked
        ? setData("licenses", [...data.licenses, id])
        : setData(
            "licenses",
            data.licenses.filter((item) => {
                return item !== id;
            })
        );
    };

    function validedChecked(exdate,buydate,refund){

        if(refund == 1){
            return '<span class="badge bg-danger print-noyes">REFUND</span>';
        }else if(buydate == null){
            return '<span class="badge bg-warning print-noyes">AVAILABLE</span>';
        }else if (new Date(exdate) < new Date()) { 
            return '<span class="badge bg-danger print-noyes">NO</span>';
        }else{
            return '<span class="badge bg-success print-noyes">YES</span>';
        }
    }

    
    
    function checkBoxValidedBindServerID(){
        $(".alert").remove();
        var error = true;
        if (data.licenses == '') {
            $("<div class='alert alert-danger'>Please select the License ID!</div>").insertBefore("main");
            error = false;
        }else{
            var sendserverids = {};
            data.licenses.forEach(license_id => {

                var serverid = $('#server-id-'+license_id+' input').val();

                if (typeof serverid === 'undefined') {
                    $('#server-id-'+license_id+'').append("<div class='alert alert-danger'>Please only select unassigned checkbox Server ID!</div>");
                    error = false;
                }else if (/^[A-Za-z0-9]*$/.test(serverid) == false) {
                    $('#server-id-'+license_id+'').append("<div class='alert alert-danger'>The Server ID may only contain letters and numbers.</div>");
                    error = false;
                }else if (serverid.length != 64) {
                    $('#server-id-'+license_id+'').append("<div class='alert alert-danger'>The Server ID format is Invalid.</div>");
                    error = false;
                }

                sendserverids[license_id] = serverid;
            });
            
            if (error) {
                $.ajax({
                    type: "POST",
                    url: route("licenses.validate-server-id"),
                    data: sendserverids,
                    dataType: "JSON",
                    async : false,
                }).done(function(json){
                    $.each(json, function(key,license) {
                        if(license.success == 0){
                            $('#server-id-'+license.license_id+'').append("<div class='alert alert-danger'>"+license.message+"</div>");
                            error = false;
                        }
                    });
                });    
            }

            


            if (error) {
                
                $('#exampleModal .modal-title').html("Generate license");
                var popuphtml = '<table class="table"><thead class="table-light"><tr><th style="width: 8%;">License ID</th><th style="width: 52%;text-align: center;">Server ID</th><th style="width: 40%;text-align: center;">Progress</th></tr></thead><tbody>';
                
                const keys = Object.keys(sendserverids);
                keys.map((key) => {
                    popuphtml += '<tr><td>'+key+'</td><td>'+sendserverids[key]+'</td><td><div class="progress progress-'+key+'"><div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>';
                });

                popuphtml += '</tbody></table>';
                popuphtml += `<script>
                    function licenseBindReGenerate(license_id,server_id){
                        $(".progress-"+license_id).replaceWith('<div class="progress progress-'+license_id+'"><div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div></div>');
                        
                        $.ajax({
                            type: "POST",
                            url: '/generate-license-saprate.php',
                            data: {license_id:license_id,server_id:server_id},
                            dataType: "JSON",
                        }).done(function(license){
                            
                            var _start = {property: 0};
                            var _end = {property: 100};
                            $(_start).animate(_end, {
                                duration: 3000,
                                step: function() {
                                    $('.progress-'+license.license_id+' .progress-bar').css('width', this.property + "%");
                                },complete: function() {
                                    if (license.success == 1) {
                                        $.ajax({
                                            type: "POST",
                                            url: route("licenses.bind-server-id"),
                                            data: license,
                                            dataType: "JSON",
                                        }).done(function(json){
                                            $('#buy-date-'+json.license_id).html(json.buy_date);
                                            
                                            $('#expiration-date-'+json.license_id).html(json.expiration_date);
    
                                        });
                                        
                                        $('#server-id-'+license.license_id).html('<span data-title="'+license.server_id+'">'+license.server_id.slice(0, 8)+'...</span>');
                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-success'>To download your license(s), please select the target license, then click the download button.</div>");

                                        $('.print-noyes').text('YES');


                                        

                                    }else{
                                        
                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-danger progress-"+license.license_id+"'>"+license.message+"<a href='javascript:void(0)' onclick='licenseBindReGenerate(\`"+license.license_id+"\`,\`"+license.server_id+"\`);' class='btn btn-success waves-effect waves-light ml-5'>License Bind Again</a></div>");

                                    }
                                }
                            });
        
                        });

                    }
                </script>`;

                
                
                
                $('#exampleModal .modal-body').html(popuphtml);

                $('#exampleModalButton').trigger("click");

                
                const sendserver = Object.keys(sendserverids);
                
                var sleep = 0;

                sendserver.map((key) => {
                    setTimeout(function() {

                        $.ajax({
                            type: "POST",
                            url: '/generate-license-saprate.php',
                            data: {license_id:key,server_id:sendserverids[key]},
                            dataType: "JSON",
                        }).done(function(license){


                            var _start = {property: 0};
                            var _end = {property: 100};
                            $(_start).animate(_end, {
                                duration: 3000,
                                step: function() {
                                    $('.progress-'+license.license_id+' .progress-bar').css('width', this.property + "%");
                                },complete: function() {
                                    if (license.success == 1) {
                                        $.ajax({
                                            type: "POST",
                                            url: route("licenses.bind-server-id"),
                                            data: license,
                                            dataType: "JSON",
                                        }).done(function(json){
                                            $('#buy-date-'+json.license_id).html(Common.makeDateFormate(json.buy_date,props.general_settings));
                                            
                                            $('#expiration-date-'+json.license_id).html(Common.makeDateFormate(json.expiration_date,props.general_settings));
    
                                        });
                                        
                                        $('#server-id-'+license.license_id).html('<span data-title="'+license.server_id+'">'+license.server_id.slice(0, 8)+'...</span>');
                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-success'>To download your license(s), please select the target license, then click the download button.</div>");

                                        $('.print-noyes').text('YES');


                                        

                                    }else{
                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-danger progress-"+license.license_id+"'>"+license.message+"<a href='javascript:void(0)' onclick='licenseBindReGenerate(`"+license.license_id+"`,`"+license.server_id+"`);' class='btn btn-success waves-effect waves-light ml-5'>License Bind Again</a></div>");

                                    }
                                }
                            });
        
                        });



                    }, sleep);
                    sleep = sleep+3000;

                    // popuphtml += '<tr><td>'+key+'</td><td>'+sendserverids[key]+'</td><td><div class="progress progress-'+key+'"><div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>';
                });

                

                /* $.ajax({
                    type: "POST",
                    url: '/generate-license.php',
                    data: sendserverids,
                    dataType: "JSON",
                }).done(function(json){

                    var sleep = 0;

                    $.each(json.licenses, function(license_id,license) {
                        
                        setTimeout(function() { 

                            var _start = {property: 0};
                            var _end = {property: 100};
                            $(_start).animate(_end, {
                                duration: 3000,
                                step: function() {
                                    $('.progress-'+license_id+' .progress-bar').css('width', this.property + "%");
                                },complete: function() {
                                    
                                    if (license.success == 1) {
                                        $.ajax({
                                            type: "POST",
                                            url: route("licenses.bind-server-id"),
                                            data: license,
                                            dataType: "JSON",
                                        }).done(function(json){
                                        });
                                        
                                        $('#server-id-'+license_id).html('<span data-title="'+license.server_id+'">'+license.server_id.slice(0, 8)+'...</span>');

                                        $('.progress-'+license_id).replaceWith("<div class='alert alert-success'>To download your license(s), please select the target license, then click the download button.</div>");

                                    }else{

                                        $('.progress-'+license_id).replaceWith("<div class='alert alert-danger'>"+license.message+"</div>");

                                    }
                                }
                            });

                        }, sleep);

                        sleep = sleep+3000;
                        
                    });


                    $("input[type='checkbox']").prop("checked", false);
                    setData("licenses", [])

                }); */


            }
            
            
        }
    }


    function checkBoxValidedDownloadLicense(){

        $(".alert").remove();
        var error = true;
        if (data.licenses == '') {
            $("<div class='alert alert-danger'>Please select the License ID!</div>").insertBefore("main");
            error = false;
        }else{
            data.licenses.forEach(license_id => {
                var serverid = $('#server-id-'+license_id+' input').val();
                if (typeof serverid !== 'undefined') {
                    $('#server-id-'+license_id+'').append("<div class='alert alert-danger'>Please only select Bind Server ID!</div>");
                    error = false;
                }
            });

            
            if (error) {
                
                $('#exampleModal .modal-title').html("Download license");
                var popuphtml = '<table class="table"><thead class="table-light"><tr><th style="width: 8%;">License ID</th><th style="width: 40%;text-align: center;">Progress</th></tr></thead><tbody>';
                data.licenses.map((license) => {
                    popuphtml += '<tr><td>'+license+'</td><td><div class="progress progress-'+license+'"><div class="progress-bar progress-bar-striped" role="progressbar" style="width: 0%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>';
                });
                popuphtml += '</tbody></table>';
                $('#exampleModal .modal-body').html(popuphtml);
                $('#exampleModalButton').trigger("click");


                $.ajax({
                    type: "POST",
                    url: route("licenses.download-license"),
                    data: data,
                    dataType: "JSON",
                }).done(function(json){
                   
                    var sleep = 0;

                    $.each(json.downloadfiles, function(key,license) {
                        
                        setTimeout(function() { 

                            var _start = {property: 0};
                            var _end = {property: 100};
                            $(_start).animate(_end, {
                                duration: 3000,
                                step: function() {
                                    $('.progress-'+license.license_id+' .progress-bar').css('width', this.property + "%");
                                },complete: function() {
                                    
                                    if (license.success == 1) {

                                        window.location.assign(license.cert_filename,"download");
                                        
                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-success'>"+license.message+"</div>");

                                    }else{

                                        $('.progress-'+license.license_id).replaceWith("<div class='alert alert-danger'>"+license.message+"</div>");

                                    }
                                }
                            });

                        }, sleep);

                        sleep = sleep+3000;

                    });
                });

                $("input[type='checkbox']").prop("checked", false);
                setData("licenses", [])
            
            }
        }
    }

    return (
        <Authenticated
            props={props}
            auth={props.auth}
            errors={props.errors}
            header={'Licenses'}
            headtitle={'Licenses'}
        >

            <button type="button" id='exampleModalButton' className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{display:'none'}}>
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" style={{maxWidth:"80%"}}>
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title"></h5>
                            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>


                    </div>
                </div>
            </div>


            {RoleManageArray.roles.clients == 2 && (<div className="flex items-center justify-between mb-6 float-end create-button-listing">
                <Link className="btn btn-blue waves-effect waves-light ml-5" href={ route("licenses.create") } >
                    Add License
                </Link>

                <a className="btn btn-success waves-effect waves-light ml-5" href='javascript:void(0)' onClick={checkBoxValidedBindServerID}>
                    Bind Server ID
                </a>
                
                <a className="btn btn-primary waves-effect waves-light ml-5" href='javascript:void(0)' onClick={checkBoxValidedDownloadLicense}>
                    Download License
                </a>
            </div>)}
            

               
            <div className="table-responsive">

                <TabelSearchBox s={props.s} o={props.o} ob={props.ob} route='licenses' />

                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th className="px-2 py-2 w-10">
                                <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)' onClick={allCheckboxCheckedCode} id='selectAll' style={{padding: "0px 5px"}}>
                                    All
                                </a>
                                
                                <a className="btn btn-primary waves-effect waves-light" href='javascript:void(0)' onClick={allCheckboxUncheckCode} id='unselectAll' style={{display:"none",padding: "0px 5px"}}>
                                    All
                                </a>
                            </th>
                            <th className="px-2 py-2">
                                {Common.makeSortOrderLink('ID','licenses','id',props.s,props.o,props.ob)}
                            </th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Username','licenses','username',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Package Name','licenses','plan_name',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Server Qty.','licenses','device_count',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Client Qty.','licenses','device_count',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2" style={{width: "42%"}}>{Common.makeSortOrderLink('Server ID','licenses','server_id',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Added','licenses','added_date',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Issue','licenses','buy_date',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Expiration','licenses','expiration_date',props.s,props.o,props.ob)}</th>
                            <th className="px-2 py-2">{Common.makeSortOrderLink('Valid','licenses','expiration_date',props.s,props.o,props.ob)}</th>
                        </tr>
                    </thead>
                    <tbody>

                        {props.licenses.data.map((license,key) => (
                            <tr>
                                <td className="border px-2 py-2">
                                    <Checkbox name="license[]" value={license.id} handleChange={handleChange} disabled={license?.transaction?.refund} />
                                </td>
                                <td className="border px-2 py-2">
                                    {/* { props.firstitem+key } */}
                                    { license.id }
                                </td>
                                <td className="border px-2 py-2"><UserDetailPopup userName={license?.user?.username} userId={license?.user?.id} /></td>
                                <td className="border px-2 py-2">{ license.plan_name }</td>
                                <td className="border px-2 py-2">1</td>
                                <td className="border px-2 py-2">{ license.device_count }</td>
                                <td className="border px-2 py-2" id={'server-id-'+license.id}>
                                    { license.server_id ? 
                                        // <span data-title={ license.server_id }>{ license.server_id.substring(0,8) }...</span>
                                        <SpanCopyKeyboad client_id={license.server_id} />
                                        :
                                        <TextInput type="text" className="mt-1 block w-full form-control" autoComplete="off" placeholder="Server (S) software -> About -> Server ID (e.g. 3612E35377AC7EFA...)" /> 
                                    }
                                </td>
                                <td className="border px-2 py-2">{Common.makeDateFormate(license.created_at,props.general_settings)}</td>
                                <td className="border px-2 py-2" id={'buy-date-'+license.id}>{Common.makeDateFormate(license.buy_date,props.general_settings)}</td>

                                <td className="border px-2 py-2" id={'expiration-date-'+license.id}>{Common.makeDateFormate(license.expiration_date,props.general_settings)}</td>

                                <td className="border px-2 py-2"><div class="form-label" bis_skin_checked="1">{parse(validedChecked(license.expiration_date,license.buy_date,license?.transaction?.refund))}</div></td>
                            </tr>
                        ))}
                        
                        {props.licenses.data.length === 0 && (
                            <tr>
                                <td
                                    className="px-6 py-4 border-t"
                                    colSpan="9"
                                    style={{textAlign:"center"}}
                                >
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Paginate datas={props.licenses} />

            </div>
            
        </Authenticated>
    );
}
