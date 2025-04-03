<?php

namespace App\Http\Controllers;

use App\Models\RoleHasPermission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Route;
use App\Models\Menu;
use Arr;
use Hash;

class SubMenuController extends Controller
{

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create($menuid)
    {
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

    public function store(Request $request)
    {
        $this->settingValidation($request);

        $data = $request->all();
        $submenu = Menu::create($data);

        RoleHasPermission::create([
            'role_id' => 1,
            'menu_id' => $submenu->id,
            'permission' => 2,
            'menu_parent_id' => $submenu->parent_id,
        ]);

        return redirect()->route('menus.edit', $request->parent_id)->with('success', 'Data inserted successfully!');
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit($id)
    {
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
    public function update(Request $request, Menu $menu)
    {
        $this->settingValidation($request);

        $menu->update($request->all());

        return redirect()->route('menus.edit', $request->parent_id)->with('success', 'Data updated successfully!');
    }

    public function destroy(Menu $menu)
    {
        $parent_id = $menu->parent_id;

        RoleHasPermission::where('menu_id', $menu->id)->delete();
        $menu->delete();

        return redirect()->route('menus.edit', $parent_id)->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request)
    {
        $this->validate($request, [
            'route_id'       => 'required',
            'name'          => 'required',
            'sort'          => 'required|numeric|gt:0',
        ]);
    }

}
