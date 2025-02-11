<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function managedUsers(): HasMany
    {
        return $this->hasMany(User::class, 'parent_id');
    }

    // Get licenses based on the user's role
    public function getLicensesByRole()
    {
        if ($this->role_id === 1) {
            // Admin role: return all licenses
            return License::all();
        } elseif ($this->role_id === 14) {
            // Manager role: return managed users' licenses and own licenses
            $managedUserIds = $this->managedUsers()->pluck('id')->push($this->id);
            return License::whereIn('user_id', $managedUserIds)->get();
        } elseif ($this->role_id === 16) {
            // User role: return only own licenses
            return License::where('user_id', $this->id)->get();
        }
    }

    // Get users list based on the current user's role
    public function getUsersByRole()
    {
        if ($this->role_id === 1) {
            // Admin role: return all users
            return User::all();
        } elseif ($this->role_id === 14) {
            // Manager role: return managed users and self
            return User::where('id', $this->id)
                ->orWhere('parent_id', $this->id)->get();
        } elseif ($this->role_id === 16) {
            // User role: return only self
            return User::where('id', $this->id)->get();
        }
    }
}
