<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\User;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use App\Models\Role;
use App\Models\Menu;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use Route;
use Auth;
use App\Rules\NoSpecialChars;
use Illuminate\Support\Str;

class UserController extends Controller{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $users = User::with('role');

        if (isset($request->s)) {
            $s = $request->s;

            $users = $users->orWhere('name','LIKE','%'.$request->s.'%')->orWhere('email','LIKE','%'.$request->s.'%');

        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

       
        $users = $users->orderBy($ob, $o);
        
        $users = $users->paginate(env('PAGINATE_NO_OF_ROWS'));

        $users->appends($request->except(['page']));


        return Inertia::render('Users/Index', ['users' => $users,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $users->firstItem()]);
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create(){
        $role = Role::all();
        $roles = [];
        foreach ($role as $value) {
            $roles[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }
        return Inertia::render('Users/Create',['roles'=>$roles]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        Validator::make($request->all(), [
            'name'      => ['required'],
            'email'     => 'required|email|unique:users,email',
            'username'  => 'required|regex:/^[a-zA-Z0-9_.-]+$/|unique:users,username',
            'password'  => ['required'],
            'role_id'   => ['required'],
            '*'         => new NoSpecialChars,
        ])->validate();
   
        User::create($request->all());
    
        return redirect()->route('users.index')->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(User $user){
        $role = Role::all();
        $roles = [];
        foreach ($role as $value) {
            $roles[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }
        if ($user->role) {
            $user->rolename = $user->role->name;
        }
        
        return Inertia::render('Users/Edit', [
            'user'  => $user,
            'roles' => $roles
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update($id, Request $request){

        $this->validate($request, [
            'name'      => 'required',
            'email'     => 'required|email|unique:users,email,'.$id,
            'username'  => 'required|regex:/^[a-zA-Z0-9_.-]+$/|unique:users,username,'.$id,
            '*'         => new NoSpecialChars,
        ]);
    
        $input = $request->all();
        if(!empty($input['password'])){ 
            $input['password'] = Hash::make($input['password']);
        }else{
            $input = Arr::except($input,array('password'));    
        }
        $input['status'] = (int)$input['status'];
        unset($input['user_id']);
        
        $user = User::find($id);
        $user->update($input);

        return redirect()->route('users.index')->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy($id){
        User::find($id)->delete();
        return redirect()->route('users.index')->with('success', 'Data deleted successfully!');
    }
    
    public function checkRoleGetApi(Request $request){
        
        $rc_role_id = Auth::user()->role_id;
        
        $getpermission = RoleHasPermission::with('menu')->where('role_id',$rc_role_id)->get();
        
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


        $menus = Menu::with('icon')->where('parent_id','==',0)->orderby('sort')->get();
        
        foreach ($menus as $value) {
            if (!isset($roles[$value->id])) {
                continue;
            }

            $submenu = [];
            $getsubmenu = Menu::with('route')->where('parent_id',$value->id)->orderby('sort')->get();

            foreach ($getsubmenu as $menu) {
                
                if (!isset($roles[$value->id][$menu->id])) {
                    continue;
                }else if (isset($roles[$value->id][$menu->id]) && $roles[$value->id][$menu->id] == 0) {
                    continue;
                }

                $customlink = false;
                if ($menu->route->name == 'user-manual') {
                    $customlink = 'https://cyberintelsystems.com/category/documents/';
                }

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
                    'idname' => strtolower(str_replace(' ','',$value['name'].$value['id'])),
                    'submenu' => $submenu
                ];
            }
            
        }

        return $permissions;
    }

    public function getUserDataPopup($id){
        
        $user = User::with('role')->find($id);
        $rolename = '';
        if ($user->role) {
            $rolename = $user->role->name;
        }

        $data['html'] = '
            <center>
                <div class="row">
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Usergroup
                            </div>
                            <div class="userValue">
                                '.$rolename.'
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Fullname
                            </div>
                            <div class="userValue">
                                '.$user->name.'
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Title
                            </div>
                            <div class="userValue">
                                '.$user->title.'
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Email
                            </div>
                            <div class="userValue">
                                '.$user->email.'
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Username
                            </div>
                            <div class="userValue">
                                '.$user->username.'
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="popUserInfo">
                            <div class="userTitle">
                                Active
                            </div>
                            <div class="userValue">
                                '.($user->status?'yes':'no').'
                            </div>
                        </div>
                    </div>
                </div>
            </center>
            <style>
                .popUserInfo .userTitle {
                    color: #808080;
                    text-transform: uppercase;
                }
                .popUserInfo {
                    padding: 30px 0px;
                }
            </style>
        ';

        return $data;
    }

    public function usersMultipleDelete(Request $request){
        foreach ($request->users as $value) {
            $user = User::find($value);
            $user->delete();
        }
    
        return redirect()->route('users.index')->with('success', 'Data deleted successfully!');
    }

    public function verifyEmail($token){

        $user = User::where('email_track','LIKE','%'.$token.'%')->first();
        $message = '';
        if ($user) {
            $email_track = json_decode($user->email_track,true);
            if (isset($email_track['email']['token']) && $email_track['email']['token'] == $token) {
                
                if (time() > $email_track['email']['before_verify']) {
                    $message = '<div class="error alert">
                        <div class="alert-body">
                            Error this link has been expired!
                        </div>
                    </div>';
                }else{
                    $user->email = $email_track['email']['email'];
                    unset($email_track['email']);
                    $user->email_track = json_encode($email_track);
                    $user->save();
                    $message = '
                        <div class="success alert">
                            <div class="alert-body">
                                Your work personal email has been verified.
                            </div>
                        </div>
                    ';
                }
                
            }else if(isset($email_track['work_email']['token']) && $email_track['work_email']['token'] == $token){


                if (time() > $email_track['work_email']['before_verify']) {
                    $message = '<div class="error alert">
                        <div class="alert-body">
                            Error this link has been expired!
                        </div>
                    </div>';
                }else{
                    $user->work_email = $email_track['work_email']['email'];
                    unset($email_track['work_email']);
                    $user->email_track = json_encode($email_track);
                    $user->save();
                    $message = '
                        <div class="success alert">
                            <div class="alert-body">
                                Your work email has been verified.
                            </div>
                        </div>
                    ';
                }


            }

        }else{
            $message = '<div class="error alert">
                <div class="alert-body">
                    Error token is not found can you again request change email!
                </div>
            </div>';
        }
        /* <div class="success alert">
            <div class="alert-body">
                Success !
            </div>
        </div>
        <div class="error alert">
            <div class="alert-body">
                Error !
            </div>
        </div> */
        $html = '
            <div class="box">
                '.$message.'
            </div>
        ';
        $html .= "<style>.box{
            margin-top:60px;
            display:flex;
            justify-content:space-around;
            flex-wrap:wrap;
          }
          
          .alert{
            margin-top:25px;
            background-color:#fff;
            font-size:25px;
            font-family:sans-serif;
            text-align:center;
            width:300px;
            height:100px;
            padding-top: 150px;
            position:relative;
            border: 1px solid #efefda;
            border-radius: 2%;
            box-shadow:0px 0px 3px 1px #ccc;
          }
          
          .alert::before{
            width:100px;
            height:100px;
            position:absolute;
            border-radius: 100%;
            inset: 20px 0px 0px 100px;
            font-size: 60px;
            line-height: 100px;
            border : 5px solid gray;
            animation-name: reveal;
            animation-duration: 1.5s;
            animation-timing-function: ease-in-out;
          }
          
          .alert>.alert-body{
            opacity:0;
            animation-name: reveal-message;
            animation-duration:1s;
            animation-timing-function: ease-out;
            animation-delay:1.5s;
            animation-fill-mode:forwards;
          }
          
          @keyframes reveal-message{
            from{
              opacity:0;
            }
            to{
              opacity:1;
            }
          }
          
          .success{
            color:green;
          }
          
          .success::before{
            content: '✓';
            background-color: #eff;
            box-shadow: 0px 0px 12px 7px rgba(200,255,150,0.8) inset;
            border : 5px solid green;
          }
          
          .error{
            color: red;
          }
          
          .error::before{
            content: '✗';
            background-color: #fef;
            box-shadow: 0px 0px 12px 7px rgba(255,200,150,0.8) inset;
            border : 5px solid red;
          }
          
          @keyframes reveal {
            0%{
              border: 5px solid transparent;
              color: transparent;
              box-shadow: 0px 0px 12px 7px rgba(255,250,250,0.8) inset;
              transform: rotate(1000deg);
            }
            25% {
              border-top:5px solid gray;
              color: transparent;
              box-shadow: 0px 0px 17px 10px rgba(255,250,250,0.8) inset;
              }
            50%{
              border-right: 5px solid gray;
              border-left : 5px solid gray;
              color:transparent;
              box-shadow: 0px 0px 17px 10px rgba(200,200,200,0.8) inset;
            }
            75% {
              border-bottom: 5px solid gray;
              color:gray;
              box-shadow: 0px 0px 12px 7px rgba(200,200,200,0.8) inset;
              }
            100%{
              border: 5px solid gray;
              box-shadow: 0px 0px 12px 7px rgba(200,200,200,0.8) inset;
            }
          }
          </style>";
        echo $html;
    }



    public function userGenreateKey($id){
        $user = User::find($id);
        do{
            $code = Str::random(32);
            $code_find = User::where('api_key', $code)->first();
        }while($code_find);
        $user->api_key = $code;
        $user->save();
        echo $user->api_key;
        exit;
    }
}
