<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;
use App\Traits\UserScope;

class Transaction extends Model
{
    use HasFactory, UserScope;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

//    protected static function boot(){
//        parent::boot();
//        static::addGlobalScope('user', function ($query) {
//            $user = Auth::user();
//            if ($user && $user->role_id > 1) {
//                $query->where('user_id', $user->id);
//            }
//        });
//    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
