<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Role;
use App\Models\Menu;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use App\Rules\NoSpecialChars;

class RoleController extends Controller
{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(){
        $roles = Role::paginate(env('PAGINATE_NO_OF_ROWS'));
        return Inertia::render('Roles/Index', ['roles' => $roles,'firstitem' => $roles->firstItem()]);
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create(){
        // $permissions = Permission::all();

        $rolemanage = $this->rolesManageArray();

        $defaultselectarray = [];
        foreach ($rolemanage as $mainmenu) {
            foreach ($mainmenu['submenu'] as $submenu) {
                $defaultselectarray[$mainmenu['id'].'-'.$submenu['id']] = 0;
            }
        }
        

        return Inertia::render('Roles/Create',['rolemanage' => $rolemanage,'defaultselectarray' => $defaultselectarray]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        
        Validator::make($request->all(), [
            'name'  => ['required'],
            '*'     => new NoSpecialChars,
        ])->validate();

        $data = $request->except(['permissions']);

        $role = Role::create($data);

        foreach ($request->permissions as $key => $value) {
            $menuid = explode('-',$key);
            
            $permission = [
                'role_id' => $role->id,
                'menu_parent_id' => $menuid[0],
                'menu_id' => $menuid[1],
                'permission' => $value,
            ];
            RoleHasPermission::insert($permission);
        }

        return redirect()->route('roles.index')->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Role $role){
        
        $permissions_temp = RoleHasPermission::where('role_id',$role->id)->get();
       
        $defaultselectarray = [];
        foreach ($permissions_temp as $key => $value) {
            $defaultselectarray[$value->menu_parent_id.'-'.$value->menu_id] = $value->permission;
        }
        
        $rolemanage = $this->rolesManageArray();
        
        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'rolemanage' => $rolemanage,
            'defaultselectarray' => $defaultselectarray,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update($id, Request $request){
        
        $this->validate($request, [
            'name'  => 'required',
            '*'     => new NoSpecialChars,
        ]);
    
        
        $data = $request->except(['permissions']);
        
        $role = Role::find($id);
        $role->update($data);

        RoleHasPermission::where('role_id',$role->id)->delete();

        foreach ($request->permissions as $key => $value) {
            $menuid = explode('-',$key);
            
            $permission = [
                'role_id' => $role->id,
                'menu_parent_id' => $menuid[0],
                'menu_id' => $menuid[1],
                'permission' => $value,
            ];
            RoleHasPermission::insert($permission);
        }

        return redirect()->route('roles.index')->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy($id){
        Role::find($id)->delete();
        return redirect()->route('roles.index')->with('success', 'Data deleted successfully!');
    }

    public function rolesManageArray(){
        $roles = [];


        $menus = Menu::with('icon')->where('parent_id','==',0)->orderby('sort')->get();
        
        foreach ($menus as $value) {
            $submenu = [];
    
            $getsubmenu = Menu::where('parent_id',$value->id)->orderby('sort')->get();

            foreach ($getsubmenu as $menu) {
                $submenu[] = [
                    'id' => $menu->id,
                    'name' => $menu->name,
                ];
            }

            $roles[] = [
                'id' => $value['id'],
                'name' => $value['name'],
                'submenu' => $submenu
            ];

        }
        
        
        return $roles;
    }
}
