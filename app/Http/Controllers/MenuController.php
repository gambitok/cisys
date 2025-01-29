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
use App\Rules\NoSpecialChars;

class MenuController extends Controller
{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $menus = Menu::with('icon')->where('parent_id','==',0);

        if (isset($request->s)) {
            $s = $request->s;

            $menus = $menus->orWhere('name','LIKE','%'.$request->s.'%')->orWhere('sort','LIKE','%'.$request->s.'%');

        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        $menus = $menus->orderBy($ob, $o);
        
        $menus = $menus->paginate(env('PAGINATE_NO_OF_ROWS'));

        $menus->appends($request->except(['page']));

        return Inertia::render('Menus/Index', ['menus' => $menus,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $menus->firstItem()]);
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create(){
        
        $icons_get = Icon::all();
        $icons = [];
        foreach ($icons_get as $value) {
            $icons[] = [
                'value' => $value->id,
                'label' => $value->icon,
            ];
        }
        
        return Inertia::render('Menus/Create',compact('icons'));
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        
        $this->settingValidation($request);

        $data = $request->all();
        $data['route_id'] = 0;
        $data['parent_id'] = 0;
        Menu::create($data);
        
        return redirect()->route('menus.index')->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Menu $menu){

        $icons_get = Icon::all();
        $icons = [];
        foreach ($icons_get as $value) {
            $icons[] = [
                'value' => $value->id,
                'label' => $value->icon,
            ];
        }

        $submenus = Menu::with('route')->where('parent_id',$menu->id)->orderBy('sort')->get();

        return Inertia::render('Menus/Edit', [
            'submenus'      => $submenus,
            'menu'          => $menu,
            'icons'         => $icons,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Menu $menu){
        
        $this->settingValidation($request);
        
        $menu->update($request->all());

        return redirect()->route('menus.index')->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Menu $menu){

        Menu::where('parent_id',$menu->id)->delete();
        
        $menu->delete();
        
        return redirect()->route('menus.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request){
        $this->validate($request, [
            'icon_id'       => 'required',
            'name'          => 'required',
            'sort'          => 'required|numeric|gt:0',
            '*'             => new NoSpecialChars,
        ]);
    }
}
