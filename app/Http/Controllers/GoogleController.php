<?php

namespace App\Http\Controllers;

use App\Models\google_user;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;

class GoogleController extends Controller
{

   public function googlepage()
   {
    
        return Socialite::driver('google')->stateless()->setScopes(['openid', 'email'])->redirect();

   }

   public function googlecallback()
   {
        try {
            $user = Socialite::driver('google')->stateless()->user();
            $finduser = User::where('email', $user->email)->first();
            if($finduser){
                $finduser->google_id = $user->id;
                $finduser->save();

                Auth::login($finduser);
                return redirect()->intended('/dashboard');
            }else{
                $newUser = User::where('email', $user->email)->onlyTrashed()->first();
                if ($newUser) {
                    $newUser->name = $user->name?$user->name:strtok($user->email , '@');
                    $newUser->username = strtok($user->email , '@');
                    $newUser->google_id = $user->id;
                    $newUser->password = encrypt(strtok($user->email , '@').'123456');
                    $newUser->save();
                    $newUser->restore();
                }else{
                    $newUser = User::create([
                        'name' => $user->name?$user->name:strtok($user->email , '@'),
                        'email' => $user->email,
                        'username' => strtok($user->email , '@'),
                        'google_id' => $user->id,
                        'password' => encrypt(strtok($user->email , '@').'123456')
                    ]);
                }

                

                /* $newUser = User::create([
                    'name' => $user->name?$user->name:strtok($user->email , '@'),
                    'email' => $user->email,
                    'username' => strtok($user->email , '@'),
                    'google_id' => $user->id,
                    'password' => encrypt(strtok($user->email , '@').'123456')
                ]); */
                Auth::login ($newUser);
                return redirect()->intended('/dashboard');
            }



            
        } catch (Exception $e) {
            dd ($e->getMessage());
        }
    }
}   