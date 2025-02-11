<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait UserScope
{
    protected static function bootUserScope()
    {
        static::addGlobalScope('user', function (Builder $query) {
            $user = Auth::user();
            if ($user) {
                $table = (new static)->getTable();
                if ($user->role_id === 14) {
                    $managedUserIds = $user->managedUsers()->pluck('id')->push($user->id);
                    $query->whereIn("{$table}.user_id", $managedUserIds);
                } elseif ($user->role_id === 16) {
                    $query->where("{$table}.user_id", $user->id);
                }
            }
        });
    }
}
