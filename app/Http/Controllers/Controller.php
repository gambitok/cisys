<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Plan;
use App\Models\License;
use App\Models\CouponLog;
use App\Models\Transaction;

use Auth;


class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function generateSalt(){
        return (substr(str_shuffle(('\\`)/|@'.password_hash(mt_rand(0,999999), PASSWORD_DEFAULT).'!*^&~(')), 0, 15));
    }

    public function createLicense($plan_id, $payment_type, $transaction_id, $expiry_year,$subtotal=0, $couponcode = '',$serverqty = '') {

        // echo '<pre>';
        // print_r($serverqty);
        // exit;

        
        // if transaction_id exits return true
        $license = License::where('transaction_id',$transaction_id)->first();
        if ($license) {
            return true;
        }

        // if plan id 1 expiration_date 14 because is trial date
        if ($plan_id == 1) {
            $expiration_date = date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s"). ' + 14 days'));
            $expiry_year = 0;
        }else{
            $expiration_date = date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s"). ' + '.$expiry_year.' year'));            
        }


        $plan = Plan::with(['product'])->find($plan_id);
        
        $data = [];
  

        $planqty = $plan->qty;
        
        if ($plan_id == 2) {
            $planqty = floor(($subtotal/$expiry_year)/$plan->price);
        }
        
        $data['device_count'] = $planqty;


        $data['plan_name'] = $plan->name;
        $data['transaction_id'] = $transaction_id;


        $sub_total = 0;
        $coupon_rate = 0;
        $coupon_price = 0;
        $standalone_rate = 0;
        $standalone_price = 0.00;
        $coupan_tot =0;

        $tax_rate = 10.5;
        $tax_price = 0;
        $total = 0;
        $findcoupon = false;

        if ($plan_id == 2) {
            $sub_total = $subtotal;
        }else{
            $sub_total = $plan->price * $expiry_year;
        }
        
        if($serverqty > 0){

            $standalone_rate = $plan->standalone;

            $s_val = number_format((float)(($sub_total*$standalone_rate)/100), 2, '.', '');

            $standalone_price =  $s_val;


            $standalone = $sub_total+$s_val;
        }else{
            $standalone = $sub_total;

        }


        if ($couponcode != '') {
            $couponres = $this->checkCouponValiedOrNot($couponcode,$planqty);
           
            if ($couponres['success'] == 1) {
                $findcoupon = Coupon::where('code',$couponcode)->first();
                
                $coupon_rate = $findcoupon->rate;
                $coupon_price = number_format((float)(($standalone*$coupon_rate)/100), 2, '.', '');
                $coupan_tot = $standalone-$coupon_price;
            }else{
                $coupan_tot = $standalone;

            }
            


        }else{
            $coupan_tot = $standalone;

        }

        /* if (isset($plan->coupon)) {
            $coupon_rate = $plan->coupon->rate;
            $coupon_price = number_format((float)(($sub_total*$coupon_rate)/100), 2, '.', '');
            $sub_total = $sub_total-$coupon_price;
        } */
        
        $tax_price = number_format((float)(($coupan_tot*$tax_rate)/100), 2, '.', '');
        
        $total = number_format((float)($coupan_tot + $tax_price), 2, '.', '');

    


        // if ($plan_id == 2) {
        //     $data['sub_total'] = $subtotal;
        // }else{
        //     $data['sub_total'] = $plan->price * $expiry_year;
        // }


     
        
        // $data['buy_date'] = date("Y-m-d H:i:s");
         $data['expiry_year'] = $expiry_year;
         $data['user_id'] = auth()->id();

        // $data['expiration_date'] = $expiration_date;

        // $data['buy_date'] = "null";
        // $data['expiration_date'] = "null";
       
       
        if($serverqty > 0){
            $data['device_count'] = 1;
            $data['serverqty'] = 1;
            for ($i = 0; $i < $serverqty; $i++) {
                // Create and save the license record
                $license = License::create($data);
            }
        }else{
            $license = License::create($data);
        }
            
        // $tran_id = License::where('transaction_id',$transaction_id)->first();
        
        $tra_data['transaction_id'] = $transaction_id;
        $tra_data['user_id'] = auth()->id();
        $tra_data['plan_id'] = $plan_id;
        $tra_data['product_id'] = $plan->product_id;


        if ($plan_id == 2) {
            $tra_data['sub_total'] = $subtotal;
        }else{
            $tra_data['sub_total'] = $plan->price * $expiry_year;
        }
        $tra_data['standalone_rate'] = $standalone_rate;
        $tra_data['standalone_price'] = $standalone_price;

        $tra_data['coupon_rate'] = $coupon_rate;
        $tra_data['coupon_price'] = $coupon_price;
        $tra_data['payment_type'] = $payment_type;


        $tra_data['tax_rate'] = $tax_rate;
        $tra_data['tax_price'] = $tax_price;
        $tra_data['total'] = $total;

        $transaction = Transaction::create($tra_data);


        



        
        if ($findcoupon) {
            $data = [];
            $data['user_id'] = auth()->id();
            $data['license_id'] = $license->id;
            $data['coupon_id'] = $findcoupon->id;
            $data['product_name'] = $plan->product->name;
            $data['product_version'] = $plan->product->version;
            $data['product_edition'] = $plan->product->edition;
            $data['plan_qty'] = $planqty;
            $data['coupon_code'] = $findcoupon->code;
            $data['coupon_rate'] = $findcoupon->rate;
            $data['coupon_discount'] = $coupon_price;
            CouponLog::create($data);

            $uselimit = $findcoupon->use_limit;
            $findcoupon->use_limit = $uselimit-1;
            $findcoupon->save();
        }

        return true;
    }

    public function checkCouponValiedOrNot($couponcode,$customclients) {
        $responce = [];

        $coupon = Coupon::where('code',$couponcode)->first();
        if ($coupon) {

            $arrayOfIds = json_decode($coupon->role_id);

            $user = Auth::user();
            if (!in_array($user->role_id, $arrayOfIds)) {
                $responce['success'] = 0;
                $responce['message'] = 'Coupon code user type and user type is not matched!';
            }else if($customclients < $coupon->moq){
                $responce['success'] = 0;
                $responce['message'] = 'This Coupon code apply minimum Clients is '.$coupon->moq.' requied!';
            }else if($coupon->use_limit < 1){
                $responce['success'] = 0;
                $responce['message'] = 'This Coupon code use limit not available!';
            }else{
                $responce['success'] = 1;
                $responce['rate'] = $coupon->rate;
            }
        }else{
            $responce['success'] = 0;
            $responce['message'] = 'Coupon code is not found!';
        }

        return $responce;
    }
}
