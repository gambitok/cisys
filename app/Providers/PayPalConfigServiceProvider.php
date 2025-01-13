<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\GeneralSetting;

class PayPalConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        // $paypal_envs = GeneralSetting::where('key','paypal_env')->first();

        

        // if($paypal_envs['value'] == 'test'){

        //     $publickey = GeneralSetting::where('key','test_publickey_paypal')->first();

        //     $secret = GeneralSetting::where('key','test_secretkey_paypal')->first();

        //     $test_client_id = $publickey['value'];
        //     $test_client_secret = $secret['value'];

        //     // config(['paypal.client_id' => $test_client_id , 'paypal.client_secret' => $test_client_secret]);
        //     return [
        //         'paypal.client_id' => $test_client_id,
        //         'paypal.client_secret' => $test_client_secret,
        //     ];


        // }else{
        //     $publickey = GeneralSetting::where('key','live_publickey_paypal')->first();

        //     $secret = GeneralSetting::where('key','live_secretkey_paypal')->first();

        //     $live_client_id = $publickey['value'];
        //     $live_client_secret = $secret['value'];

        //     // config(['paypal.client_id' => $live_client_id, 'paypal.client_secret' => $live_client_secret]);
        //     return [
        //         'paypal.client_id' => $live_client_id,
        //         'paypal.client_secret' => $live_client_secret,
        //     ];
        // }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {

       


           // Fetch data from the database

           // Pass the data to the configuration
    }
}
