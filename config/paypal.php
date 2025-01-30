<?php
/**
 * PayPal Setting & API Credentials
 * Created by Raza Mehdi <srmk@outlook.com>.
 */
//    $test_client_id = '';
//    $test_client_secret = '';
//    $live_client_id = '';
//    $live_client_secret = '';
//
//    $link  = mysqli_connect(env('DB_HOST'),env('DB_USERNAME'),env('DB_PASSWORD'),env('DB_DATABASE'));
//    $q = "SELECT value FROM `general_settings` WHERE `key` = 'paypal_env'";
//    $res = mysqli_query($link,$q);
//    $result = mysqli_fetch_array($res);
//
//    if($result['value'] == '1'){
//        $qa = "SELECT value FROM `general_settings` WHERE `key` = 'test_publickey_paypal'";
//        $ress = mysqli_query($link,$qa);
//        $row = mysqli_fetch_array($ress);
//
//        $test_client_id = $row['value'];
//
//
//        $qaa = "SELECT value FROM `general_settings` WHERE `key` = 'test_secretkey_paypal'";
//        $resss = mysqli_query($link,$qaa);
//        $roww = mysqli_fetch_array($resss);
//
//        $test_client_secret = $roww['value'];
//    }else{
//        $qa = "SELECT value FROM `general_settings` WHERE `key` = 'live_publickey_paypal'";
//        $ress = mysqli_query($link,$qa);
//        $row = mysqli_fetch_array($ress);
//
//        $live_client_id = $row['value'];
//
//
//        $qaa = "SELECT value FROM `general_settings` WHERE `key` = 'live_secretkey_paypal'";
//        $resss = mysqli_query($link,$qaa);
//        $roww = mysqli_fetch_array($resss);
//
//        $live_client_secret = $roww['value'];
//    }

$test_client_id = ENV('PAYPAL_SANDBOX_CLIENT_ID');
$test_client_secret = ENV('PAYPAL_SANDBOX_CLIENT_SECRET');
$live_client_id = ENV('PAYPAL_SANDBOX_CLIENT_ID');
$live_client_secret = ENV('PAYPAL_SANDBOX_CLIENT_SECRET');

return [
    'mode'    => env('PAYPAL_MODE', 'sandbox'), // Can only be 'sandbox' Or 'live'. If empty or invalid, 'live' will be used.
    'sandbox' => [
        'client_id'     =>  $test_client_id,
        'client_secret' => $test_client_secret ,
        'app_id'        => 'APP-80W284485P519543T',
    ],
    'live' => [
        'client_id'     => $live_client_id ,
        'client_secret' => $live_client_secret,
        'app_id'        => env('PAYPAL_LIVE_APP_ID', ''),
    ],

    'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'), // Can only be 'Sale', 'Authorization' or 'Order'
    'currency'       => env('PAYPAL_CURRENCY', 'USD'),
    'notify_url'     => env('PAYPAL_NOTIFY_URL', ''), // Change this accordingly for your application.
    'locale'         => env('PAYPAL_LOCALE', 'en_US'), // force gateway language  i.e. it_IT, es_ES, en_US ... (for express checkout only)
    'validate_ssl'   => env('PAYPAL_VALIDATE_SSL', true), // Validate SSL when creating api client.
];
