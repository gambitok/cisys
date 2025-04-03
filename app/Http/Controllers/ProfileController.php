<?php

namespace App\Http\Controllers;

use App\Mail\SendVerifyEmail;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
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
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users,email,'.$request->user()->id,
            'work_email' => 'nullable|string|max:255',
        ], [
            'email.required' => 'Please Provide Your Personal Email.',
            'email.unique'   => 'This email is already taken.',
        ]);

        $email_track = json_decode($request->user()->email_track, true) ?? [];

        if ($request->user()->email !== $request->email) {
            $token = sha1(strtotime('-1 day'));
            $email_track['email'] = [
                'email' => $request->email,
                'before_verify' => strtotime('+1 day'),
                'token' => $token,
            ];
            Mail::to($request->email)->send(new SendVerifyEmail(['link' => route('verify-email', $token)]));
        }

        $request->user()->update([
            'name'       => $request->name,
            'firstname'  => $request->firstname,
            'lastname'   => $request->lastname,
            'email'      => $request->email,
            'work_email' => $request->work_email,
            'email_track' => json_encode($email_track),
        ]);

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully!');
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
