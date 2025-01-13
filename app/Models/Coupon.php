<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];
    
    public function role() {
        return $this->belongsTo(Role::class);
    }

    public function couponLog() {
        return $this->hasOne(CouponLog::class)->oldestOfMany();
    }
    
    public function scopeWithCommentCount($query)
    {
        return $query->addSelect([
            'coupon_log_count' => CouponLog::selectRaw('count(*)')
                ->whereColumn('coupon_logs.coupon_code', 'coupons.code')
        ])->leftJoin('coupon_logs', 'coupons.code', '=', 'coupon_logs.coupon_code');
    }
}
