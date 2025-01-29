<?php

namespace App\Http\Controllers;

use App\Mail\SendVerifyEmail;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Rules\NoSpecialChars;
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }
    

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        /* $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save(); */
       
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users,email,'.$request->user()->id,
            'work_email'    => 'required|string|max:255',
            '*'             => new NoSpecialChars,
        ],[   
            'email.required'    => 'Please Provide Your Personal Email For Better Communication, Thank You.',
            'email.unique'      => 'Sorry, This Personal Email Address Is Already Used By Another User. Please Try With Different One, Thank You.',
        ]);

        $email_track = (array)json_decode($request->user()->email_track,true);

        if ($request->user()->email != $request->email) {
            $token = sha1(strtotime('-1 day'));
            $email_track['email'] = [
                'email' => $request->email,
                'before_verify' => strtotime('+1 day'),
                'token' => $token,
            ];


            $data = [
                'link' => route('verify-email',$token)
            ];
            
            Mail::to($request->email)->send(new SendVerifyEmail($data));

        }
        
        if ($request->user()->work_email != $request->work_email) {
            $token = sha1(time());
            $email_track['work_email'] = [
                'email' => $request->work_email,
                'before_verify' => strtotime('+1 day'),
                'token' => $token,
            ];

            $data = [
                'link' => route('verify-email',$token)
            ];
            
            Mail::to($request->work_email)->send(new SendVerifyEmail($data));
        }
        $request->user()->email_track = json_encode($email_track);
        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
