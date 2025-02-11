<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use App\Traits\UserScope;

class Group extends Model
{
    use HasFactory, SoftDeletes, UserScope;

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
