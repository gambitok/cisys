<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        Log::info('Verifying email for user', ['user_id' => $user->id]);

        if ($user->hasVerifiedEmail()) {
            Log::info('User already has verified email', ['user_id' => $user->id]);
            return redirect()->intended(RouteServiceProvider::HOME.'?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            Log::info('Email marked as verified for user', ['user_id' => $user->id]);
            event(new Verified($user));

            // Update the user's status to 1 after email verification
            $user->status = 1;
            $user->save();

            Log::info('User status updated to 1 after email verification', ['user_id' => $user->id]);
        }

        return redirect()->intended(RouteServiceProvider::HOME.'?verified=1');
    }
}
