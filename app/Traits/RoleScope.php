<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait RoleScope
{
    protected static function bootRoleScope()
    {
        static::addGlobalScope('role', function (Builder $query) {
            $user = Auth::user();
            if ($user) {
                $table = (new static)->getTable();
               if ($user->role_id === 14) {
                    $query->where(function ($query) use ($table) {
                        $query->whereJsonContains("{$table}.role_id", "14")
                            ->orWhereJsonContains("{$table}.role_id", "16");
                    });
                } elseif ($user->role_id === 16) {
                    $query->whereJsonContains("{$table}.role_id", "16");
                }
            }
        });
    }
}
