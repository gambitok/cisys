<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Icon;
use App\Models\Setting;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;

class IconController extends Controller{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $icons = new Icon;
        
        if (isset($request->s)) {
            $s = $request->s;
            $icons = $icons->orWhere('icon','LIKE','%'.$request->s.'%');
        }
        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }
        
        $icons = $icons->orderBy($ob, $o);
        
        $icons = $icons->paginate(env('PAGINATE_NO_OF_ROWS'));

        $icons->appends($request->except(['page']));
        
        return Inertia::render('Icon/Index', ['icons' => $icons,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $icons->firstItem()]);
    }
    
}
