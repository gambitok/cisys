<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Group;
use App\Models\Setting;
use App\Models\User;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use App\Rules\NoSpecialChars;

class GroupController extends Controller
{

     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $s = '';
        $o = 'DESC';
        $ob = 'id';
        $ldap = false;

        if (isset($request->ldap)) {
            $ldap = true;
        }

        $groups = Group::with(['setting','user']);

        if (isset($request->ldap) && $request->ldap == 'true') {
            $groups = $groups->where('ldap',1);
        } else {
            $groups = $groups->where('ldap',0);
        }

        if (isset($request->s)) {
            $s = $request->s;

            $groups = $groups->orWhere('name','LIKE','%'.$request->s.'%');

            $groups = $groups->orWhereHas('setting', function($query) use ($s) {
                return $query->where('name','LIKE','%'.$s.'%');
            });

            $groups = $groups->orWhereHas('user', function($query) use ($s) {
                return $query->where('username','LIKE','%'.$s.'%');
            });
        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'sname') {
            $groups = $groups->orderBy(Setting::select('name')->whereColumn('settings.id', 'groups.setting_id'),$o);
        } elseif ($ob == 'username') {
            $groups = $groups->orderBy(User::select($ob)->whereColumn('groups.user_id', 'users.id'),$o);
        } else {
            $groups = $groups->orderBy($ob, $o);
        }

        $groups = $groups->paginate(env('PAGINATE_NO_OF_ROWS'));

        $groups->appends($request->except(['page']));

        $users = User::withTrashed()->get()->keyBy('id');

        $settings = Group::with('user')->get()->map(function ($setting) use ($users) {
            $userName = isset($users[$setting->user_id]) ? $users[$setting->user_id]->name : 'Unknown user';

            return [
                'value' => $setting->id,
                'label' => "{$userName}: {$setting->name}",
            ];
        })->values();

        return Inertia::render('Groups/Index', [
            'groups' => $groups,
            'settings' => $settings,
            's' => $s,
            'o' => $o,
            'ob' => $ob,
            'ldap' => $ldap,
            'firstitem' => $groups->firstItem()
        ]);
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        $setting = Setting::all();
        $settings = [];
        foreach ($setting as $value) {
            $settings[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        return Inertia::render('Groups/Create',compact('settings'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $this->settingValidation($request);

        $data = $request->all();
        $data['user_id'] = auth()->id();

        Group::create($data);

        return redirect()->route('groups.index')->with('success', 'Data inserted successfully!');
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Group $group)
    {
        $setting = Setting::all();
        $settings = [];
        foreach ($setting as $value) {
            $settings[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        return Inertia::render('Groups/Edit', [
            'group' => $group,
            'settings' => $settings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Group $group)
    {
        $this->settingValidation($request, $group->id);

        $group->update($request->all());

        return redirect()->route('groups.index')->with('success', 'Data updated successfully!');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Group $group)
    {
        $group->delete();

        return redirect()->route('groups.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request, $id = 0)
    {
        $this->validate($request, [
            'name'          => 'required|unique:groups,name,'.$id,
            'setting_id'    => 'required',
            '*'             => new NoSpecialChars,
        ]);
    }

    public function groupsBind(Request $request)
    {
        $this->validate($request, [
            'setting_id' => 'required'
        ]);

        Group::whereIn('id', $request->groups)->update(['setting_id' => $request->setting_id]);

        return redirect()->back()->with('success', 'Data updated successfully!');
    }

    public function groupsMultipleDelete(Request $request)
    {
        foreach ($request->groups as $value) {
            $group = Group::find($value);

            if ($group) {
                $group->delete();
            }
        }

        return redirect()->route('groups.index')->with('success', 'Data deleted successfully!');
    }

}
