<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Rules\ReCaptcha;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            // 'email' => 'required|string|email|max:255|unique:'.User::class,
            'email' => 'required|string|email|max:255|unique:users,email,NULL,id,deleted_at,NULL',
            'work_email' => 'required|string|email|max:255|unique:users,work_email,NULL,id,deleted_at,NULL',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'g-recaptcha-response' => ['required', new Recaptcha()],
            'privacy_policy' => 'required',
        ],[   
            'email.required'    => 'Please Provide Your Personal Email For Better Communication, Thank You.',
            'email.unique'      => 'Sorry, This Personal Email Address Is Already Used By Another User. Please Try With Different One, Thank You.',
            'work_email.required'    => 'Please Provide Your Work Email For Better Communication, Thank You.',
            'work_email.unique'      => 'Sorry, This Work Email Address Is Already Used By Another User. Please Try With Different One, Thank You.',
            'privacy_policy.required'      => 'Please check privacy policy checkbox.',
        ]);

        $salt = $this->generateSalt();

        $user = User::where('email', $request->email)->onlyTrashed()->first();
        if ($user) {
            $user->name = $request->name;
            $user->work_email = $request->work_email;
            $user->password = Hash::make($salt.$request->password);
            $user->salt = $salt;
            $user->save();
            $user->restore();
        }else{
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'work_email' => $request->work_email,
                'username' => strtok($request->email , '@'),
                'password' => Hash::make($salt.$request->password),
                'salt' => $salt,
            ]);
            event(new Registered($user));
        }

        /* $salt = $this->generateSalt();
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'work_email' => $request->work_email,
            'username' => strtok($request->email , '@'),
            'password' => Hash::make($salt.$request->password),
            'salt' => $salt,
        ]);
        event(new Registered($user)); */
       
        $user = User::find($user->id);
        $user->sendEmailVerificationNotification();

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }
}
