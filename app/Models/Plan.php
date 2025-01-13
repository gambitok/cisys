<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model{
    use HasFactory, SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];
    
    public function role() {
        return $this->belongsTo(Role::class);
    }

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function coupon() {
        return $this->belongsTo(Coupon::class);
    }

    
}
