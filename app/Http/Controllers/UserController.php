<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\RoleHasPermission;
use App\Models\Role;
use App\Models\Menu;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Rules\NoSpecialChars;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $s = $request->input('s', '');
        $o = $request->input('o', 'DESC');
        $ob = $request->input('ob', 'id');

        $currentUser = Auth::user();
        $usersQuery = User::with('role');

        if ($currentUser->role_id === 1) {
            $usersQuery = User::with('role');
        } elseif ($currentUser->role_id === 14) {
            $managedUserIds = $currentUser->managedUsers()->pluck('id')->push($currentUser->id);
            $usersQuery = User::whereIn('id', $managedUserIds)->with('role');
        } elseif ($currentUser->role_id === 16) {
            $usersQuery = User::where('id', $currentUser->id)->with('role');
        }

        if (!empty($s)) {
            $usersQuery = $usersQuery->where(function($query) use ($s) {
                $query->where('name', 'LIKE', '%' . $s . '%')
                    ->orWhere('email', 'LIKE', '%' . $s . '%');
            });
        }

        $users = $usersQuery->orderBy($ob, $o)->paginate(env('PAGINATE_NO_OF_ROWS'));
        $users->appends($request->except(['page']));

        return Inertia::render('Users/Index', [
            'users' => $users,
            's' => $s,
            'o' => $o,
            'ob' => $ob,
            'firstitem' => $users->firstItem(),
        ]);
    }

    public function create()
    {
        $roles = Role::all()->map(function($role) {
            return ['value' => $role->id, 'label' => $role->name];
        });

        return Inertia::render('Users/Create', ['roles' => $roles]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:4',
            'title' => 'required|min:4',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|regex:/^[a-zA-Z0-9_.-]+$/|unique:users,username|min:4',
            'password' => 'required',
            'role_id' => 'required',
            '*' => new NoSpecialChars,
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $data = $request->all();
        $data['password'] = Hash::make($data['password']);
        User::create($data);

        return redirect()->route('users.index')->with('success', 'Data inserted successfully!');
    }

    public function edit(User $user)
    {
        $roles = Role::all()->map(function($role) {
            return ['value' => $role->id, 'label' => $role->name];
        });

        if ($user->role) {
            $user->rolename = $user->role->name;
        }

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function update($id, Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'username' => 'required|regex:/^[a-zA-Z0-9_.-]+$/|unique:users,username,' . $id . '|min:4',
            '*' => new NoSpecialChars,
        ]);

        $input = $request->all();
        if (!empty($input['password'])) {
            $input['password'] = Hash::make($input['password']);
        } else {
            $input = Arr::except($input, ['password']);
        }
        $input['status'] = (int)$input['status'];
        unset($input['user_id']);

        $user = User::findOrFail($id);
        $user->update($input);

        return redirect()->route('users.index')->with('success', 'Data updated successfully!');
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->route('users.index')->with('success', 'Data deleted successfully!');
    }

    public function checkRoleGetApi(Request $request)
    {
        $rc_role_id = Auth::user()->role_id;
        $getpermission = RoleHasPermission::with('menu')->where('role_id', $rc_role_id)->get();

        $roles = [];
        $permissions = [
            'roles' => [],
            'menus' => [],
        ];

        foreach ($getpermission as $value) {
            if (isset($value->menu->route)) {
                $roles[$value->menu_parent_id][$value->menu_id] = $value->permission;
                $permissions['roles'][$value->menu->route->name] = $value->permission;
            }
        }

        $menus = Menu::with('icon')->where('parent_id', 0)->orderBy('sort')->get();

        foreach ($menus as $value) {
            if (!isset($roles[$value->id])) {
                continue;
            }

            $submenu = [];
            $getsubmenu = Menu::with('route')->where('parent_id', $value->id)->orderBy('sort')->get();

            foreach ($getsubmenu as $menu) {
                if (!isset($roles[$value->id][$menu->id]) || $roles[$value->id][$menu->id] == 0) {
                    continue;
                }

                $customlink = ($menu->route->name == 'user-manual') ? 'https://cyberintelsystems.com/category/documents/' : false;

                $submenu[] = [
                    'id' => $menu->id,
                    'route' => $menu->route->name,
                    'name' => $menu->name,
                    'customlink' => $customlink,
                ];
            }

            if (count($submenu) > 0) {
                $permissions['menus'][] = [
                    'id' => $value['id'],
                    'icon' => $value->icon->icon,
                    'name' => $value['name'],
                    'idname' => strtolower(str_replace(' ', '', $value['name'] . $value['id'])),
                    'submenu' => $submenu,
                ];
            }
        }

        return $permissions;
    }

    public function getUserDataPopup($id)
    {
        $user = User::with('role')->findOrFail($id);
        $rolename = $user->role ? $user->role->name : '';

        $data['html'] = view('partials.user_data_popup', compact('user', 'rolename'))->render();

        return $data;
    }

    public function usersMultipleDelete(Request $request)
    {
        User::whereIn('id', $request->users)->delete();

        return redirect()->route('users.index')->with('success', 'Data deleted successfully!');
    }

    public function verifyEmail($token)
    {
        $user = User::where('email_track', 'LIKE', '%' . $token . '%')->first();
        $message = '';

        if ($user) {
            $email_track = json_decode($user->email_track, true);
            if (isset($email_track['email']['token']) && $email_track['email']['token'] == $token) {
                if (time() > $email_track['email']['before_verify']) {
                    $message = '<div class="error alert"><div class="alert-body">Error this link has been expired!</div></div>';
                } else {
                    $user->email = $email_track['email']['email'];
                    unset($email_track['email']);
                    $user->email_track = json_encode($email_track);
                    $user->save();
                    $message = '<div class="success alert"><div class="alert-body">Your work personal email has been verified.</div></div>';
                }
            } elseif (isset($email_track['work_email']['token']) && $email_track['work_email']['token'] == $token) {
                if (time() > $email_track['work_email']['before_verify']) {
                    $message = '<div class="error alert"><div class="alert-body">Error this link has been expired!</div></div>';
                } else {
                    $user->work_email = $email_track['work_email']['email'];
                    unset($email_track['work_email']);
                    $user->email_track = json_encode($email_track);
                    $user->save();
                    $message = '<div class="success alert"><div class="alert-body">Your work email has been verified.</div></div>';
                }
            }
        } else {
            $message = '<div class="error alert"><div class="alert-body">Error token is not found. Can you again request change email!</div></div>';
        }

        $html = '<div class="box">' . $message . '</div>';
        $html .= "<style>
            .box { margin-top: 60px; display: flex; justify-content: space-around; flex-wrap: wrap; }
            .alert { margin-top: 25px; background-color: #fff; font-size: 25px; font-family: sans-serif; text-align: center; width: 300px; height: 100px; padding-top: 150px; position: relative; border: 1px solid #efefda; border-radius: 2%; box-shadow: 0px 0px 3px 1px #ccc; }
            .alert::before { width: 100px; height: 100px; position: absolute; border-radius: 100%; inset: 20px 0px 0px 100px; font-size: 60px; line-height: 100px; border: 5px solid gray; animation-name: reveal; animation-duration: 1.5s; animation-timing-function: ease-in-out; }
            .alert>.alert-body { opacity: 0; animation-name: reveal-message; animation-duration: 1s; animation-timing-function: ease-out; animation-delay: 1.5s; animation-fill-mode: forwards; }
            .success { color: green; }
            .success::before { content: '✓'; background-color: #eff; box-shadow: 0px 0px 12px 7px rgba(200,255,150,0.8) inset; border: 5px solid green; }
            .error { color: red; }
            .error::before { content: '✗'; background-color: #fef; box-shadow: 0px 0px 12px 7px rgba(255,200,150,0.8) inset; border: 5px solid red; }
            @keyframes reveal-message { from { opacity: 0; } to { opacity: 1; } }
            @keyframes reveal { 0% { border: 5px solid transparent; color: transparent; box-shadow: 0px 0px 12px 7px rgba(255,250,250,0.8) inset; transform: rotate(1000deg); } 25% { border-top: 5px solid gray; color: transparent; box-shadow: 0px 0px 17px 10px rgba(255,250,250,0.8) inset; } 50% { border-right: 5px solid gray; border-left: 5px solid gray; color: transparent; box-shadow: 0px 0px 17px 10px rgba(200,200,200,0.8) inset; } 75% { border-bottom: 5px solid gray; color: gray; box-shadow: 0px 0px 12px 7px rgba(200,200,200,0.8) inset; } 100% { border: 5px solid gray; box-shadow: 0px 0px 12px 7px rgba(200,200,200,0.8) inset; } }
        </style>";
        echo $html;
    }

    public function userGenreateKey($id)
    {
        $user = User::findOrFail($id);
        do {
            $code = Str::random(32);
            $code_find = User::where('api_key', $code)->first();
        } while ($code_find);
        $user->api_key = $code;
        $user->save();
        echo $user->api_key;
        exit;
    }

}
