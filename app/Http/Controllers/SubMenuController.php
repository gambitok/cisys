<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\UserType;
use App\Models\Route;
use App\Models\Menu;
use App\Models\Icon;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;

class SubMenuController extends Controller
{
     
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create($menuid){
        $parent_id = $menuid;
        if ($menuid) {
            $menu = Menu::find($menuid);
            if (!$menu) {
                return redirect()->route('menus.index');
            }
        }

        $routes_get = Route::all();
        $routes = [];
        foreach ($routes_get as $value) {
            $routes[] = [
                'value' => $value->id,
                'label' => ucfirst(str_replace('-',' ',$value->name)),
            ];
        }
        
        return Inertia::render('Submenus/Create',compact('routes','parent_id'));
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        
        $this->settingValidation($request);

        $data = $request->all();
        
        Menu::create($data);
        
        return redirect()->route('menus.edit', $request->parent_id)->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit($id){
        $submenu = Menu::find($id);
        if ($submenu) {
            if ($submenu->parent_id == 0) {
                return redirect()->route('menus.index');
            }
        }
        
        $parent_id = $submenu->parent_id;

        $routes_get = Route::all();
        $routes = [];
        foreach ($routes_get as $value) {
            $routes[] = [
                'value' => $value->id,
                'label' => ucfirst(str_replace('-',' ',$value->name)),
            ];
        }


        return Inertia::render('Submenus/Edit',compact('routes','parent_id','submenu'));

    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Menu $menu){
        
        $this->settingValidation($request);
        
        $menu->update($request->all());

        return redirect()->route('menus.edit', $request->parent_id)->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Menu $menu){
        $parent_id = $menu->parent_id;
        $menu->delete();
        
        return redirect()->route('menus.edit', $parent_id)->with('success', 'Data deleted successfully!');

    }

    public function settingValidation($request){
        $this->validate($request, [
            'route_id'       => 'required',
            'name'          => 'required',
            'sort'          => 'required|numeric|gt:0',
        ]);
    }
}
