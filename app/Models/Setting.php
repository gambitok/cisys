<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use App\Traits\UserScope;

class Setting extends Model
{

    use HasFactory, SoftDeletes, UserScope;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function screens()
    {
        return $this->hasMany(SettingScreen::class);
    }

    public function screenFirst()
    {
        return $this->hasOne(SettingScreen::class)->oldestOfMany();
    }

    public function alarms()
    {
        return $this->hasMany(SettingAlarm::class);
    }

    public function alarmFirst()
    {
        return $this->hasOne(SettingAlarm::class)->oldestOfMany();
    }

}
