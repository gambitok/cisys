<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use App\Traits\UserScope;

class Product extends Model
{

    use HasFactory, SoftDeletes, UserScope;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Get the plans for the product.
     */
    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

}
