<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Hash;
use Str;

class CommonController extends Controller{

    public function index(){
        return [
            "status" => true,
            "message" => "ping back ...",
            "data" => NULL
        ];
    }

    public function decripteCode($msg){
        /* $key = '9HhaipyqzFFCIs32kW0X6rR1ICKyjp6C';
        $salt = 'o29y0itkysvw9rte3cb085hf78wpscos';
        $string = hex2bin($string);
        $key = substr(hash('sha256', $key.$salt, true), 0, 32);
        $cipher = 'aes-256-gcm';
        $iv_len = openssl_cipher_iv_length($cipher);
        $tag_length = 16;
        $encrypted = base64_decode($string);
        $iv = substr($encrypted, 0, $iv_len);
        $ciphertext = substr($encrypted, $iv_len, -$tag_length);
        $tag = substr($encrypted, -$tag_length);
        $decrypted = openssl_decrypt($ciphertext, $cipher, $key, OPENSSL_RAW_DATA, $iv, $tag); */

        $secret = "9HhaipyqzFFCIs32kW0X6rR1ICKyjp6C";
        $salt = "o29y0itkysvw9rte3cb085hf78wpscos";
        $key = hash('sha256', $secret.$salt, true);


        $len = strlen($msg);
        $iv = substr($msg, 0, 24);
        $ciphertext = substr($msg, 24, $len - 32 - 24);
        $tag = substr($msg, $len - 32, 32);
        $iv = pack("H*", $iv);
        $tag = pack("H*", $tag);
        $ciphertext = pack("H*", $ciphertext);
    
        $decrypted = openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);

        return $decrypted;
    }

    public function authenticate(){
        $jsonData = json_decode(file_get_contents("php://input"), true);
        $responce = [];
        

        if (isset($jsonData['username']) && $jsonData['username'] != '' && isset($jsonData['password']) && $jsonData['password'] != '') {
            /* 
            // decrypt password and username
            $key = "9HhaipyqzFFCIs32kW0X6rR1ICKyjp6C";
            // $iv = "123c80e175755abc";
            $salt = "o29y0itkysvw9rte3cb085hf78wpscos"; // 32 ASCII chars from Alex
            $iv = substr(hash('sha256', date("i") .  $salt), 0, 16); // keep first 16 ASCII chars only
            
            $cipher = "aes-256-cbc-hmac-sha256";
            $options = OPENSSL_RAW_DATA;
            $username = preg_replace('/[\x00-\x1F\x7F]/', '', openssl_decrypt(hex2bin($jsonData['username']), $cipher, $key, $options, $iv));
            $password = preg_replace('/[\x00-\x1F\x7F]/', '', openssl_decrypt(hex2bin($jsonData['password']), $cipher, $key, $options, $iv));
            // decrypt password and username end
            */
            
            $username = $this->decripteCode($jsonData['username']);
            $password = $this->decripteCode($jsonData['password']);

            if (isset($jsonData['devloper'])) {
                $devloper = explode(':',$jsonData['devloper']);
                $username = $devloper[0];
                $password = $devloper[1];
            }

            //Select user data form database
            $user = User::where('username', $username)->first();
            
            //Check password hash
            if(!$user || !Hash::check($user->salt.$password, $user->password)){
                $responce = [
                    "status" => false,
                    "message" => "Invalid login username or password!",
                    "data" => $jsonData
                ];
                return $responce;
            } else {
                $findtoken = true;
                while ($findtoken) {
                    $api_token = Str::random(80);
                    $checktoken = User::where('api_token',$api_token)->first();
                    if ($checktoken) {
                        $findtoken = true;
                    }else{
                        $findtoken = false;
                    }
                }
                $user->api_token = $api_token;
                $user->api_token_expire = date('Y-m-d H:i:s', strtotime("+1 day"));
                $user->save();

                $responce = [
                    "status" => true,
                    "message" => "Token generated successfully!",
                    "data" => [
                        'api_token' => $api_token,
                        // 'pat' => $user->api_key,
                    ]
                ];
                return $responce;
            }
        }else{
            $responce = [
                "status" => false,
                "message" => "Username and password field is required!",
                "data" => $jsonData
            ];
            return $responce;
        }

    }

    public function uploadDeviceList() {
        $jsonData = json_decode(file_get_contents("php://input"), true);
        $responce = [];

        if (isset($jsonData['agent']['pat']) && isset($jsonData['agent']['agentDevId'])) {

            $user = User::where('api_key', $jsonData['agent']['pat'])->first();
            if ($user) {
                $insert = 0;
                $update = 0;
                // Client
                foreach (@$jsonData['devices'] as $device) {

                    $findClient = Client::where('client_id',$device['device_id'])->first();

                    if ($findClient) {
                        $findClient->name = $device['device_user_name'];
                        $findClient->os_version = $device['os_version'];
                        $findClient->ipaddress = $device['ipaddress'];
                        $findClient->save();
                        $update++;
                    }else{
                        $data = [
                            'user_id' => $user->id,
                            'server_id' => $jsonData['agent']['agentDevId'],
                            'client_id' => $device['device_id'],
                            'name' => $device['device_user_name'],
                            'os_version' => $device['os_version'],
                            'ipaddress' => $device['ipaddress'],
                        ];
                        Client::create($data);
                        $insert++;
                    }
                }
                $responce = [
                    "status" => true,
                    "message" => "Total client insert : ".$insert.". Total client update : ".$update.".",
                    "data" => []
                ];
                return $responce;
            }else{
                $responce = [
                    "status" => false,
                    "message" => "Agent Personal Access Token is not found!",
                    "data" => $jsonData
                ];
                return $responce;
            }
        }else{
            $responce = [
                "status" => false,
                "message" => "Agent Personal Access Token and DevId is required!",
                "data" => $jsonData
            ];
            return $responce;
        }

    }
    
    public function downloadDeviceSetting() {
        $jsonData = json_decode(file_get_contents("php://input"), true);
        $responce = [];

        
        if (isset($jsonData['agent']['pat'])) {

            $user = User::where('api_key', $jsonData['agent']['pat'])->first();
            
            if ($user) {
                $dbclient = Client::with('group')->where('user_id',$user->id)->orderBy('group_id','DESC')->get();
                
                $clients = [];

                foreach ($dbclient as $client) {

                    $screens = [];
                    if ($client?->group?->setting?->screens) {
                        $tempscreens = $client?->group?->setting?->screens;
                        $tempscreens = $tempscreens->sortBy('id');
                        $screencount = 1;
                        foreach ($tempscreens as $key => $screen) {
                            $tempflags = json_decode($screen->info_checks);
                            $flags = '';
                            $flags .= in_array('IP address',$tempflags)? 1:0;
                            $flags .= in_array('User Name',$tempflags)? 1:0;
                            $flags .= in_array('Computer Name',$tempflags)? 1:0;
                            $flags .= in_array('OS Info',$tempflags)? 1:0;
                            $flags .= in_array('Device ID',$tempflags)? 1:0;
                            $flags .= in_array('Group',$tempflags)? 1:0;
                            

                            $screens[] = [
                                'screen_index' => $screencount++,
                                'banner_size' => $screen->banner_height,
                                'border_size' => $screen->banner_border,
                                'banner_color' => $screen->banner_color,
                                'text_color' => $screen->text_color,
                                'flags' => $flags,
                                'center' => $screen->center_text,
                                'right' => $screen->right_text,
                                'text_size' => $screen->text_size,
                                'hearbeat' => $screen->hearbeat,
                            ];
                        }
                    }
                    

                    $clients[] = [
                        'client_id' => $client->client_id,
                        'screens' => $screens,
                    ];
                }
                
                $responce = [
                    "status" => true,
                    "message" => "Total client : ".count($clients),
                    "data" => $clients
                ];
                return $responce;
            }else{
                $responce = [
                    "status" => false,
                    "message" => "Agent Personal Access Token is not found!",
                    "data" => $jsonData
                ];
                return $responce;
            }
        }else{
            $responce = [
                "status" => false,
                "message" => "Agent Personal Access Token is required!",
                "data" => $jsonData
            ];
            return $responce;
        }

    }
    
}