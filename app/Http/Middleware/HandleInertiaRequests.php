<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use App\Models\GeneralSetting;
use App\Models\Role;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $site_logo = GeneralSetting::where('key','site_logo')->first();
        if ($site_logo) {
            $site_logo = '<img src="'.url($site_logo->value).'" style="width:350px;" />';
        }else{
            $site_logo = '';
        }

        $site_icon = GeneralSetting::where('key','site_icon')->first();
        if ($site_icon) {
            $site_icon = '<img src="'.url($site_icon->value).'" style="width:350px;" />';
        }else{
            $site_icon = '';
        }

        $company_name = GeneralSetting::where('key','company_name')->first();
        if ($company_name) {
            $company_name = $company_name->value;
        }else{
            $company_name = '';
        }

        $format_date = GeneralSetting::where('key','format_date')->first();
        if ($format_date) {
            $format_date = $format_date->value;
        }else{
            $format_date = 'D/M/Y';    
        }

        $rolename = '';
        if (isset($request->user()->role_id)) {
            $role = Role::find($request->user()->role_id);
            if ($role) {
                $rolename = $role->name;
            }
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'role_name' => $rolename,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'general_settings' => [
                'logo' => $site_logo,
                'site_icon' => $site_icon,
                'company_name' => $company_name,
                'format_date' => $format_date,
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}
