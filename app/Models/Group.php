<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Group extends Model
{
    use HasFactory;
    use SoftDeletes;

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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function setting()
    {
        return $this->belongsTo(Setting::class)->with('screens');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
