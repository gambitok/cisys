<?php
    function generateServerID($getlicense, $server_id, $server = 0)
    {

        $responsejson = [
            'success' => 1,
            'message' => '',
        ];

        // create a websocket
        // Create a TCP/IP socket.
        $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

        if ($socket === false) {
            $responsejson['success'] = 0;
            $responsejson['message'] = 'socket_create(): failed reason: '.socket_strerror(socket_last_error());
            return $responsejson;
        }

        $conn = socket_connect($socket, 'nsa.myds.me', 41357);
        if ($conn === false) {
            $responsejson['success'] = 0;
            $responsejson['message'] = 'socket_connect(): failed! Reason: '.$conn.' '.socket_strerror(socket_last_error($socket));
            return $responsejson;
        }

        // generate request token
        $salt = "qxUWXMdruUbfJ8XoFSda2g2rHR1f3jQy";
        $otp = date('Ymd-Hi')."-".$salt;
        $token = substr(hash('sha256', $otp), 0, 16);

        // sent request to SCM server
        // generate randome HASH
        /* $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $serverid = '';
        for ($i = 0; $i < 64; $i++)
            $serverid .= $characters[mt_rand(0, 61)]; */

        $serverid = $server_id;

        // $ts = date('Y-m-d H:i:s');
        // $request_content = '{"Timestamp": '.$ts.', "Version": "CICBv2", "Type": "Retail", "Server_id": '.$serverid.', "PRODUCT": '.$getlicense['plan_name'].', "SID": '.$serverid.', "PID": '.$getlicense['plan_id'].', "LID": '.$getlicense['id'].', "QTY": '.$getlicense['device_count'].', "TID": '.$getlicense['transaction_id'].', "DEBUG": "1"}';

        $request_content = '{"PRODUCT": "'.$getlicense['plan_name'].'", "SID": "'.$serverid.'", "PID": "'.$getlicense['plan_id'].'", "LID": "'.$getlicense['id'].'", "QTY": "'.$getlicense['device_count'].'", "YR": "'.$getlicense['expiry_year'].'", "TID": "'.$getlicense['transaction_id'].'", "DEBUG": "1"}';

        $outbound = $token."|".$request_content;
        $sent = socket_write($socket, $outbound, strlen($outbound));

        // receive signed certificate from SCM server
        $cert = '';

        if ($server) {
            if ($sent) {
                while ($inbound = socket_read($socket, 4096, PHP_NORMAL_READ)) {
                    $cert .="$inbound<br>";
                }
            }
        }

        if ($socket) {
            // close socket
            socket_shutdown($socket, 2);
            socket_close($socket);
        }

        if ($cert != '' || $server == 0) {
            // save signed certificate

            $signedcerfile = substr($serverid, 0, 8).'-'.date("Ymd").'-'.date("his").'.pem';
            $fp = fopen('uploads/signed-certificate/'.$signedcerfile,'w+');
            fwrite($fp, substr(str_replace('<br>', '', $cert), 4));
            fclose($fp);

            $data = [
                'success' => 1,
                'server_id' => $serverid,
                'server_file_cer' => 'uploads/signed-certificate/'.$signedcerfile,
            ];
        } else {
            $data = [
                'success' => 0,
                'message' => 'failed! Reason: Some issue for server side please try after some time!' . $token
            ];
        }

        return $data;
    }

    error_reporting(E_ERROR | E_PARSE);
    if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
        $server = 0;
        $mysqli = new mysqli('localhost', 'root', '', 'cyberintelsystems-react');
    } else {
        $server = 1;
        $mysqli = new mysqli('216.225.199.115', 'cisys_portal', 'p8H2h3v2Pmpuxj$iG', 'db_cisys_portal');
    }

    if ($mysqli->connect_errno) {
        $responsejson['success'] = 0;
        $responsejson['message'] = "Failed to connect to MySQL: " . $mysqli -> connect_error;
        echo json_encode($responsejson);
        exit;
    }

    if (isset($_POST['license_id']) && isset($_POST['server_id'])) {

        $license_id = $_POST['license_id'];
        $server_id = $_POST['server_id'];

        $attempts = 1;

        while($attempts < 3) {

            $result = $mysqli->query("SELECT * FROM licenses lc LEFT JOIN transactions tr ON(lc.transaction_id = tr.transaction_id) where lc.id = ".$license_id."");

            if ($result->num_rows > 0) {
                $getlicense = $result->fetch_assoc();
                $response = generateServerID($getlicense,$server_id,$server);
            } else {
                $response = [
                    'success' => 0,
                    'message' => 'License not found!'
                ];
            }

            if ($response['success'] == 1) {
                break;
            }
            $attempts++;
        }
        if ($response['success'] == 1) {
            $responsejson['success'] = 1;
            $responsejson['license_id'] = $license_id;
            $responsejson['server_id'] = $server_id;
            $responsejson['server_file_cer'] = $response['server_file_cer'];
            echo json_encode($responsejson);
            exit;
        } else {
            $responsejson['success'] = 0;
            $responsejson['license_id'] = $license_id;
            $responsejson['server_id'] = $server_id;
            $responsejson['message'] = $response['message'];
            echo json_encode($responsejson);
            exit;
        }

    } else {
        $responsejson['success'] = 0;
        $responsejson['message'] = "license_id or server_id not found!";
        echo json_encode($responsejson);
        exit;
    }
