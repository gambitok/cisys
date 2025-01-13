<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\RoleHasPermission;
use App\Models\Route;

class CheckRouteByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response{
        
        $rc_role_id = Auth::user()->role_id;

        $rc_route = $request->route()->getName();
        $rc_temp = explode('.',$rc_route);

       
        if (isset($rc_temp[1]) && ($rc_temp[1] == 'index' || $rc_temp[1] == 'create' || $rc_temp[1] == 'edit' || $rc_temp[1] == 'destroy')) {

            // $permission = Permission::join('role_has_permissions', 'permissions.id', '=', 'role_has_permissions.permission_id')->where('route',$rc_route)->where('role_has_permissions.role_id',$rc_role_id)->first();
            $permission = false;
            
            $routedb = Route::where('name',$rc_temp[0])->first();
            
            if ($routedb) {
                
                $getpermission = RoleHasPermission::with('menu');
                $getpermission = $getpermission->orWhereHas('menu', function($query) {
                    return $query->where('route_id','=',1);
                });
                $getpermission = $getpermission->where('role_id',$rc_role_id)->first();
                
                if ($getpermission) {
                    if ($getpermission->permission == 2) {
                        $permission = true;
                    }else if($getpermission->permission == 1 && $rc_temp[1] == 'index'){
                        $permission = true;
                    }

                }
            }

            if ($permission) {
                return $next($request);
            }else{
                return redirect()->to('/dashboard');
            }
        }

        return $next($request);
    }
}
