<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Product extends Model
{

    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('user', function ($query) {
            $user = Auth::user();
            if ($user && $user->role_id > 1) {
                $query->where('user_id', $user->id);
            }
        });
    }

    /**
     * Get the plans for the product.
     */
    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

}
