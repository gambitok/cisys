<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Rule;
use App\Models\Coupon;
use Illuminate\Http\Request;

class PlanCheckCouponIsApplyableOrNot implements Rule
{
    protected $requestData,$moq,$message_type=0;

    public function __construct(Request $request){
        $this->requestData = $request->all();
    }

    public function passes($attribute, $value) {
        $response = true;
        
        if (isset($this->requestData['coupon_id']) && isset($this->requestData['qty'])) {
            $coupon_id = $this->requestData['coupon_id'];
            $qty = $this->requestData['qty'];
            $role_id = $this->requestData['role_id'];
            
            $coupon = Coupon::find($coupon_id);

            $arrayOfIds = json_decode($coupon->role_id);
           
            if ($coupon) {
                if ($coupon->moq > $qty) {
                    $this->moq = $coupon->moq;
                    $this->message_type = 0;
                    return false;
                }
                if (!in_array($role_id, $arrayOfIds)) {
                    $this->message_type = 1;
                    return false;
                }
            }
        }
        return $response;

    }
  
    public function message() {
        if ($this->message_type == 1) {
            return 'The coupon User type and plan User type is not matched!';
        }else{
            return 'The :attribute apply minimun '.$this->moq.' Qty is required!';
        }
    }
}
