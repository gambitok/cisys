<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleHasPermission extends Model
{

    use HasFactory;

    protected $table = 'role_has_permissions';

    protected $fillable = ['role_id', 'menu_id', 'permission', 'menu_parent_id'];

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function menu() {
        return $this->belongsTo(Menu::class)->with('route');
    }

}
