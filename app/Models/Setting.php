<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Setting extends Model{
    use HasFactory;
    use SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    protected static function boot(){
        parent::boot();
        static::addGlobalScope('user', function ($query) {
            $user = Auth::user();            
            if ($user && $user->role_id > 1) {
                $query->where('user_id', $user->id);
            }
        });
    }


    public function user() {
        return $this->belongsTo(User::class);
    }

    public function screens(){
        return $this->hasMany(SettingScreen::class);
    }

    public function screenFirst() {
        return $this->hasOne(SettingScreen::class)->oldestOfMany();
    }
}
