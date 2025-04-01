<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Carbon\Carbon;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
        public function store(Request $request): RedirectResponse
        {
            if (!session('email_verification_sent')) {
                return redirect()->route('login');
            }

            $lastAttemptTime = Session::get('last_verification_attempt');

            if ($lastAttemptTime && Carbon::now()->lessThan(Carbon::parse($lastAttemptTime)->addMinutes(2))) {
                return back()->with('status', 'verification-link-error');
            }

            $user = Session::get('registered_user');

            if ($user) {
                $user->sendEmailVerificationNotification();

                Session::put('last_verification_attempt', Carbon::now());

                return redirect()->back()->with('status', 'verification-link-sent');
            }

            return redirect()->route('login');
        }
}
