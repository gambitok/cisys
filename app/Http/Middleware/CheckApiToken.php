<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Route;
use App\Models\Permission;
use App\Models\User;



class CheckApiToken{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next){
        $api_token = $request->header('Token');
        $jsonpost = json_decode(file_get_contents("php://input"), true);
        
        if (isset($api_token)) {
            if (isset($jsonpost['agent']['pat'])) {
                $user = User::where('api_token',$api_token)->where('api_key',$jsonpost['agent']['pat'])->first();
                
                if ($user) {
                    if ($user->api_token_expire < date('Y-m-d H:i:s')) {
                        $responce = [
                            "status" => false,
                            "message" => "Token is expired!",
                            "data" => []
                        ];
                        return response()->json($responce);
                    }
                }else{
                    $responce = [
                        "status" => false,
                        "message" => "Token and Personal Access Token is not validated!",
                        "data" => []
                    ];
                    return response()->json($responce);
                }
            }else{
                $responce = [
                    "status" => false,
                    "message" => "Can you please send Personal Access Token!",
                    "data" => []
                ];
                return response()->json($responce);
            }

        }else{
            $responce = [
                "status" => false,
                "message" => "Can you please send Token in header!",
                "data" => []
            ];
            return response()->json($responce);
        }

        return $next($request);
    }
}
