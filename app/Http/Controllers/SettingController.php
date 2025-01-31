<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

use App\Rules\NoSpecialChars;
use App\Models\Setting;
use App\Models\SettingScreen;
use App\Models\GeneralSetting;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use Illuminate\Support\Facades\Auth;

class SettingController extends Controller
{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $search = '';
        $order = 'DESC';
        $orderBy = 'id';

        $settings = Setting::with(['user', 'screenFirst']);

        if (isset($request->s)) {
            $search = $request->s;

            $settings = $settings
                ->orWhere('name', 'LIKE', '%' . $search . '%')
                ->orWhere('remark', 'LIKE', '%' . $search . '%')
                ->orWhereHas('screenFirst', function ($query) use ($search) {
                    return $query->where('center_text', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('screenFirst', function ($query) use ($search) {
                    return $query->where('right_text', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('user', function ($query) use ($search) {
                    return $query->where('username', 'LIKE', '%' . $search . '%');
                });
        }

        if (isset($request->o)) {
            $orderBy = $request->ob;
            $order = $request->o;
        }

        if ($orderBy === 'username') {
            $settings = $settings->orderBy(User::select($orderBy)->whereColumn('settings.user_id', 'users.id'), $order);
        } elseif (in_array($orderBy, ['banner_height', 'banner_border', 'center_text', 'right_text'])) {
            $settings = $settings->orderBy(
                SettingScreen::select($orderBy)
                    ->whereColumn('settings.id', 'setting_screens.setting_id')
                    ->orderBy('setting_screens.id')
                    ->limit(1),
                $order
            );
        } else {
            $settings = $settings->orderBy($orderBy, $order);
        }

        $settings = $settings->paginate(env('PAGINATE_NO_OF_ROWS'));

        $settings->appends($request->except(['page']));

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
            's' => $search,
            'o' => $order,
            'ob' => $orderBy,
            'firstitem' => $settings->firstItem(),
        ]);
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        $users = User::withTrashed()->get();

        $user = Auth::user();

        return Inertia::render('Settings/Create', [
            'users' => $users,
            'role_id' => $user->role_id
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $this->settingValidation($request);

        $user = auth()->user();
        $data = $request->all();

        if ($user->role_id === 1 && isset($data['selectedUser']) && $data['selectedUser'] !== '') {
            $userId = $data['selectedUser'];
        } else {
            $userId = $user->id;
        }

        $setting = Setting::create([
            'user_id' => $userId,
            'name' => $data['name'],
            'remark' => $data['remark'],
        ]);

        for ($i=1; $i <= $data['screen']; $i++) {
            SettingScreen::create([
                'setting_id' => $setting->id,
                'banner_height' => $data['banner_height_'.$i],
                'text_size' => $data['text_size_'.$i],
                'hearbeat' => $data['hearbeat_'.$i],
                'banner_border' => $data['banner_border_'.$i],
                'banner_color' => $data['banner_color_'.$i],
                'center_text' => $data['center_text_'.$i],
                'right_text' => $data['right_text_'.$i],
                'text_color' => $data['text_color_'.$i],
                'info_checks' => json_encode($data['info_checks_'.$i]),
                'alarm_code' => $data['alarm_code_'.$i],
                'alarm_message' => $data['alarm_message_'.$i],
            ]);
        }

        return redirect()->route('settings.index')->with('success', 'Data inserted successfully!');
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Setting $setting)
    {
        $data = [];
        $data['id'] = $setting->id;
        $data['name'] = $setting->name;
        $data['remark'] = $setting->remark;
        $data['screen'] = 0;
        $data['screenselect'] = 0;

        foreach ($setting->screens()->orderby('id')->get() as $key => $value) {

            $row = $key + 1;

            $data['banner_height_'.$row] = $value->banner_height;
            $data['text_size_'.$row] = $value->text_size;
            $data['hearbeat_'.$row] = $value->hearbeat;
            $data['banner_border_'.$row] = $value->banner_border;
            $data['center_text_'.$row] = $value->center_text;
            $data['right_text_'.$row] = $value->right_text;
            $data['banner_color_'.$row] = $value->banner_color;
            $data['text_color_'.$row] = $value->text_color;
            $data['alarm_code_'.$row] = $value->alarm_code;
            $data['alarm_message_'.$row] = $value->alarm_message;
            $data['info_checks_'.$row] = json_decode($value->info_checks,true);

            $data['screen']++;
            $data['screenselect']++;
        }

        if ($data['screen'] == 0) {
            $data['screen'] = 1;
            $data['screenselect'] = 1;
        }

        return Inertia::render('Settings/Edit', [
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Setting $setting)
    {
        $this->settingValidation($request);

        $data = $request->all();

        $setting->update([
            'name' => $data['name'],
            'remark' => $data['remark'],
        ]);

        SettingScreen::where('setting_id',$setting->id)->delete();

        for ($i=1; $i <= $data['screen']; $i++) {

            SettingScreen::create([
                'setting_id' => $setting->id,
                'banner_height' => $data['banner_height_'.$i],
                'text_size' => $data['text_size_'.$i],
                'hearbeat' => $data['hearbeat_'.$i],
                'banner_border' => $data['banner_border_'.$i],
                'banner_color' => $data['banner_color_'.$i],
                'center_text' => $data['center_text_'.$i],
                'right_text' => $data['right_text_'.$i],
                'text_color' => $data['text_color_'.$i],
                'info_checks' => json_encode($data['info_checks_'.$i]),
                'alarm_code' => $data['alarm_code_'.$i],
                'alarm_message' => $data['alarm_message_'.$i],
            ]);
        }

        return redirect()->route('settings.index')->with('success', 'Data updated successfully!');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Setting $setting)
    {
        $setting->delete();

        return redirect()->route('settings.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request)
    {
        $validationarray = [];
        $validationarray['name'] = 'required';
        for ($i=1; $i <= $request->screen; $i++) {
            $validationarray['hearbeat_'.$i] = 'required|numeric|between:0,999';
            $validationarray['text_size_'.$i] = 'required|numeric|between:0,99';
            $validationarray['banner_height_'.$i] = 'required|numeric|between:0,999';
            $validationarray['banner_border_'.$i] = 'required|numeric|between:0,99';
        }
        $validationarray['*'] = new NoSpecialChars;
        $this->validate($request, $validationarray);

        /* $this->validate($request, [
            'name'          => 'required',
            '*'             => new NoSpecialChars,
        ]); */
    }

    public function generalSetting() {

        $formates = [[
            'value' => 'D-MMM-Y',
            'label' => date('d-M-Y'),
        ],[
            'value' => 'M/D/Y',
            'label' => date('m/d/Y'),
        ],[
            'value' => 'Y-M-D',
            'label' => date('Y-m-d'),
        ],[
            'value' => 'D/M/Y',
            'label' => date('d/m/Y'),
        ]];

        // $stripe_env = [[
        //     'value' => 'test',
        //     'label' => 'Test (Sandbox)',
        // ],[
        //     'value' => 'live',
        //     'label' => 'Live (Production)',
        // ]];

        // $paypal_env = [[
        //     'value' => 'test',
        //     'label' => 'Test (Sandbox)',
        // ],[
        //     'value' => 'live',
        //     'label' => 'Live (Production)',
        // ]];

        $company_name = GeneralSetting::where('key','company_name')->first();
        $application_name = GeneralSetting::where('key','application_name')->first();
        $format_date =    GeneralSetting::where('key','format_date')->first();
        $currency =       GeneralSetting::where('key','currency')->first();
        $site_icon =      GeneralSetting::where('key','site_icon')->first();
        $site_logo =      GeneralSetting::where('key','site_logo')->first();
        $fav_icon =       GeneralSetting::where('key','fav_icon')->first();
        $stripe_status =  GeneralSetting::where('key','stripe_status')->first();
        $stripe_env =    GeneralSetting::where('key','stripe_env')->first();
        $test_publickey = GeneralSetting::where('key','test_publickey')->first();
        $test_secretkey = GeneralSetting::where('key','test_secretkey')->first();
        $live_publickey = GeneralSetting::where('key','live_publickey')->first();
        $live_secretkey = GeneralSetting::where('key','live_secretkey')->first();

        $paypal_status =  GeneralSetting::where('key','paypal_status')->first();
        $paypal_env =    GeneralSetting::where('key','paypal_env')->first();
        $test_publickey_paypal = GeneralSetting::where('key','test_publickey_paypal')->first();
        $test_secretkey_paypal = GeneralSetting::where('key','test_secretkey_paypal')->first();
        $live_publickey_paypal = GeneralSetting::where('key','live_publickey_paypal')->first();
        $live_secretkey_paypal = GeneralSetting::where('key','live_secretkey_paypal')->first();

        $header_script = GeneralSetting::where('key','header_script')->first();
        $footer_script = GeneralSetting::where('key','footer_script')->first();

        return Inertia::render('Settings/GeneralSetting', compact('formates', 'company_name', 'application_name', 'format_date', 'currency', 'site_icon', 'site_logo', 'fav_icon', 'stripe_status', 'stripe_env', 'test_publickey', 'test_secretkey', 'live_publickey', 'live_secretkey', 'paypal_status', 'paypal_env', 'test_publickey_paypal', 'test_secretkey_paypal', 'live_publickey_paypal', 'live_secretkey_paypal', 'header_script', 'footer_script'));
    }

    public function generalSettingSubmit(Request $request)
    {
        $this->validate($request, [
            '*' => new NoSpecialChars,
        ]);

        $setting = GeneralSetting::firstOrNew(['key' => 'company_name']);
        $setting->value = $request->company_name;
        $setting->save();

        $setting = GeneralSetting::firstOrNew(['key' => 'application_name']);
        $setting->value = $request->application_name;
        $setting->save();

        $setting = GeneralSetting::firstOrNew(['key' => 'format_date']);
        $setting->value = $request->format_date;
        $setting->save();

        $setting = GeneralSetting::firstOrNew(['key' => 'currency']);
        $setting->value = $request->currency;
        $setting->save();

        if($file = $request->file('site_icon')){
            $name = $file->getClientOriginalName();
            $file->move('uploads/general-setting',$name);

            $setting = GeneralSetting::firstOrNew(['key' => 'site_icon']);
            $setting->value = 'uploads/general-setting/'.$name;
            $setting->save();
        }

        if($file = $request->file('site_logo')){
            $name = $file->getClientOriginalName();
            $file->move('uploads/general-setting',$name);

            $setting = GeneralSetting::firstOrNew(['key' => 'site_logo']);
            $setting->value = 'uploads/general-setting/'.$name;
            $setting->save();
        }

        if($file = $request->file('fav_icon')){
            $name = $file->getClientOriginalName();
            $file->move('uploads/general-setting',$name);

            $setting = GeneralSetting::firstOrNew(['key' => 'fav_icon']);
            $setting->value = 'uploads/general-setting/'.$name;
            $setting->save();
        }

        if(!empty($request->stripe_env)){
            $setting = GeneralSetting::firstOrNew(['key' => 'stripe_env']);
            $setting->value = $request->stripe_env;
            $setting->save();
        }

        if(!empty($request->test_publickey)){
            $setting = GeneralSetting::firstOrNew(['key' => 'test_publickey']);
            $setting->value = $request->test_publickey;
            $setting->save();
        }

        if(!empty($request->test_secretkey)){
            $setting = GeneralSetting::firstOrNew(['key' => 'test_secretkey']);
            $setting->value = $request->test_secretkey;
            $setting->save();
        }

        if(!empty($request->live_publickey)){
            $setting = GeneralSetting::firstOrNew(['key' => 'live_publickey']);
            $setting->value = $request->live_publickey;
            $setting->save();
        }

        if(!empty($request->live_secretkey)){
            $setting = GeneralSetting::firstOrNew(['key' => 'live_secretkey']);
            $setting->value = $request->live_secretkey;
            $setting->save();
        }

        if(!empty($request->stripe_status)){
            $setting = GeneralSetting::firstOrNew(['key' => 'stripe_status']);
            $setting->value = $request->stripe_status;
            $setting->save();
        }

        if(!empty($request->paypal_status)){
            $setting = GeneralSetting::firstOrNew(['key' => 'paypal_status']);
            $setting->value = $request->paypal_status;
            $setting->save();
        }

        if(!empty($request->paypal_env)){
            $setting = GeneralSetting::firstOrNew(['key' => 'paypal_env']);
            $setting->value = $request->paypal_env;
            $setting->save();
        }

        if(!empty($request->test_publickey_paypal)){
            $setting = GeneralSetting::firstOrNew(['key' => 'test_publickey_paypal']);
            $setting->value = $request->test_publickey_paypal;
            $setting->save();
        }

        if(!empty($request->test_secretkey_paypal)){

            $setting = GeneralSetting::firstOrNew(['key' => 'test_secretkey_paypal']);
            $setting->value = $request->test_secretkey_paypal;
            $setting->save();
        }

        if(!empty($request->live_publickey_paypal)){
            $setting = GeneralSetting::firstOrNew(['key' => 'live_publickey_paypal']);
            $setting->value = $request->live_publickey_paypal;
            $setting->save();
        }

        if(!empty($request->live_secretkey_paypal)){
            $setting = GeneralSetting::firstOrNew(['key' => 'live_secretkey_paypal']);
            $setting->value = $request->live_secretkey_paypal;
            $setting->save();
        }

        if(!empty($request->header_script)){
            $setting = GeneralSetting::firstOrNew(['key' => 'header_script']);
            $setting->value = $request->header_script;
            $setting->save();
        }

        if(!empty($request->footer_script)){
            $setting = GeneralSetting::firstOrNew(['key' => 'footer_script']);
            $setting->value = $request->footer_script;
            $setting->save();
        }

        return redirect()->route('general-setting.index')->with('success', 'Data updated successfully!');
    }

    public function settingsMultipleDelete(Request $request)
    {
        foreach ($request->settings as $value) {
            $setting = Setting::find($value);

            if ($setting) {
                $setting->delete();
            }
        }

        return redirect()->route('settings.index')->with('success', 'Data deleted successfully!');
    }

}
