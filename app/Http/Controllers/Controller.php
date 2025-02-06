<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\Plan;
use App\Models\License;
use App\Models\CouponLog;
use App\Models\Transaction;
use Auth;
use Illuminate\Support\Facades\Log;

class Controller extends BaseController
{

    use AuthorizesRequests, ValidatesRequests;

    public function generateSalt()
    {
        return (substr(str_shuffle(('\\`)/|@'.password_hash(mt_rand(0,999999), PASSWORD_DEFAULT).'!*^&~(')), 0, 15));
    }

    public function createLicense($plan_id, $payment_type, $transaction_id, $expiry_year, $subtotal = 0, $couponcode = '', $serverqty = '', $customclients = '')
    {
        $license = License::where('transaction_id',$transaction_id)->first();
        if ($license) {
            return true;
        }

        if ($plan_id == 1) {
            $expiry_year = 0;
        }

        $plan = Plan::find($plan_id);

        $products = Product::withoutGlobalScopes()->get();

        $product = $products->firstWhere('id', $plan->product_id);

        $data = [];

        $planqty = $plan->qty;

        // Use custom clients if provided
        if (!empty($customclients)) {
            $planqty = (int)$customclients;
        } elseif ($plan_id == 2) {
            $planqty = floor(($subtotal / $expiry_year) / $plan->price);
        }

        $data['device_count'] = $planqty;
        $data['plan_name'] = $plan->name;
        $data['transaction_id'] = $transaction_id;

        //$sub_total = 0;
        $coupon_rate = 0;
        $coupon_price = 0;
        $standalone_rate = 0;
        $standalone_price = 0.00;
        //$coupan_tot =0;

        $tax_rate = 10.5;
        //$tax_price = 0;
        //$total = 0;
        $findcoupon = false;

        if ($plan_id == 2) {
            $sub_total = $subtotal;
        } else {
            $sub_total = $plan->price * $expiry_year;
        }

        if ($serverqty > 0) {
            $standalone_rate = $plan->standalone;

            $s_val = number_format((float)(($sub_total*$standalone_rate)/100), 2, '.', '');

            $standalone_price =  $s_val;

            $standalone = $sub_total + $s_val;
        } else {
            $standalone = $sub_total;
        }

        if ($couponcode != '') {
            $couponres = $this->checkCouponValiedOrNot($couponcode, $planqty);

            if ($couponres['success'] == 1) {
                $findcoupon = Coupon::where('code',$couponcode)->first();

                $coupon_rate = $findcoupon->rate;
                $coupon_price = number_format((float)(($standalone*$coupon_rate)/100), 2, '.', '');
                $coupan_tot = $standalone-$coupon_price;
            } else {
                $coupan_tot = $standalone;
            }
        } else {
            $coupan_tot = $standalone;
        }

        $tax_price = number_format(($coupan_tot*$tax_rate)/100, 2, '.', '');

        $total = number_format((float)($coupan_tot + $tax_price), 2, '.', '');

         $data['expiry_year'] = $expiry_year;
         $data['user_id'] = auth()->id();

        if ($serverqty > 0) {
            $data['device_count'] = 1;
            $data['serverqty'] = 1;
            for ($i = 0; $i < $serverqty; $i++) {
                $license = License::create($data);
            }
        } else {
            $license = License::create($data);
        }

        $tra_data['transaction_id'] = $transaction_id;
        $tra_data['user_id'] = auth()->id();
        $tra_data['plan_id'] = $plan_id;
        $tra_data['product_id'] = $plan->product_id;

        if ($plan_id == 2) {
            $tra_data['sub_total'] = $subtotal;
        } else {
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

        Transaction::create($tra_data);

        if ($findcoupon) {
            $data = [];
            $data['user_id'] = auth()->id();
            $data['license_id'] = $license->id;
            $data['coupon_id'] = $findcoupon->id;
            $data['product_name'] = $product->name;
            $data['product_version'] = $product->version;
            $data['product_edition'] = $product->edition;
            $data['plan_qty'] = $planqty;
            $data['coupon_code'] = $findcoupon->code;
            $data['coupon_rate'] = $findcoupon->rate;
            $data['coupon_discount'] = $coupon_price;

            CouponLog::create($data);

            $uselimit = $findcoupon->use_limit;
            $findcoupon->use_limit = $uselimit - 1;
            $findcoupon->save();
        }

        return true;
    }

    public function checkCouponValiedOrNot($couponcode, $customclients)
    {
        $responce = [];

        $coupon = Coupon::where('code',$couponcode)->first();
        if ($coupon) {

            $arrayOfIds = json_decode($coupon->role_id);

            $user = Auth::user();
            if (!in_array($user->role_id, $arrayOfIds)) {
                $responce['success'] = 0;
                $responce['message'] = 'Coupon code user type and user type is not matched!';
            } else if ($customclients < $coupon->moq) {
                $responce['success'] = 0;
                $responce['message'] = 'This Coupon code apply minimum Clients is '.$coupon->moq.' required!';
            } else if ($coupon->use_limit < 1) {
                $responce['success'] = 0;
                $responce['message'] = 'This Coupon code use limit not available!';
            } else {
                $responce['success'] = 1;
                $responce['rate'] = $coupon->rate;
            }
        } else {
            $responce['success'] = 0;
            $responce['message'] = 'Coupon code is not found!';
        }

        return $responce;
    }

}
