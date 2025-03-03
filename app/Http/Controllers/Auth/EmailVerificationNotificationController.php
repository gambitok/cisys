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

            // Отримуємо користувача з сесії
            $user = Session::get('registered_user');

            // Якщо користувач є в сесії
            if ($user) {
                // Відправляємо лист на підтвердження email
                $user->sendEmailVerificationNotification();

                // Оновлюємо час останньої спроби
                Session::put('last_verification_attempt', Carbon::now());

                return redirect()->back()->with('status', 'verification-link-sent');
            }

            // Якщо користувача немає в сесії, редіректимо на сторінку логіну
            return redirect()->route('login');
        }
}
