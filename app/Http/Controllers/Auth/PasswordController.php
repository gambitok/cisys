<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse{

        $user = User::where('id',auth()->id())->first();

        if ($user) {
            $request->merge([
                'current_password' => $user->salt.$request->current_password,
            ]);
        }

        
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $salt = $this->generateSalt();
        
        $request->user()->update([
            'password' => Hash::make($salt.$validated['password']),
            'salt' => $salt,
        ]);

        return back();
    }
}
