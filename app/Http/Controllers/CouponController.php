<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\UserType;
use App\Models\Coupon;
use App\Models\Role;
use App\Models\CouponLog;

use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use App\Rules\NoSpecialChars;

class CouponController extends Controller
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


        $roles = Role::all();
        $types = [];
        foreach ($roles as $value) {
            $types[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }
               
        $coupons = Coupon::with('role')->withCommentCount();

        if (isset($request->s)) {
            $s = $request->s;
            
            $coupons = $coupons->orWhere('name','LIKE','%'.$request->s.'%')->orWhere('code','LIKE','%'.$request->s.'%')->orWhere('moq','LIKE','%'.$request->s.'%')->orWhere('rate','LIKE','%'.$request->s.'%')->orWhere('use_limit','LIKE','%'.$request->s.'%');
            
            $coupons = $coupons->orWhereHas('role', function($query) use ($s) {
                return $query->where('name','LIKE','%'.$s.'%');
            });

            // $coupons = $coupons->orWhereHas('couponLog', function ($query) use ($s) {
            // $query->where('coupons.code', '=', 'coupon_code');
            //  })->count();

            
        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }
        
        if ($ob == 'type') {
            $coupons = $coupons->orderBy(Role::select('name')->whereColumn('roles.id', 'coupons.role_id'),$o);
        }else{
            $coupons = $coupons->orderBy($ob, $o);
        }
        
        $coupons = $coupons->paginate(env('PAGINATE_NO_OF_ROWS'));

        $coupons->appends($request->except(['page']));


        // $count = $coupons->count();
        
        return Inertia::render('Coupons/Index', ['coupons' => $coupons,'s' => $s,'o' => $o,'ob' => $ob,
        'types'  => $types,'firstitem' => $coupons->firstItem()]);
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create(){
        
        $roles = Role::all();
        $types = [];
        foreach ($roles as $value) {
            $types[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }
        
        return Inertia::render('Coupons/Create',compact('types'));
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        
        $this->settingValidation($request);

        $data = $request->all();
        $data['user_id'] = auth()->id();
        $data['role_id'] = json_encode($data['role_id']);

        Coupon::create($data);

        return redirect()->route('coupons.index')->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Coupon $coupon){

       

        $code = $coupon['code'];

        $count = CouponLog::where('coupon_code', $code)->count();

        $coupon['role_id'] = json_decode($coupon['role_id']);
        
        $roles = Role::all();
        $types = [];
        foreach ($roles as $value) {
            $types[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

    
        return Inertia::render('Coupons/Edit', [
            'coupon' => $coupon,
            'types' => $types,
            'count' => $count,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Coupon $coupon)
    {

        $this->settingValidation($request);

        $data = $request->all();

        $data['role_id'] = json_encode($data['role_id']);

        $coupon->update($data);

        return redirect()->route('coupons.index')->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Coupon $coupon){
        $coupon->delete();
    
        return redirect()->route('coupons.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request){
        $this->validate($request, [
            'code'          => 'required',
            'name'          => 'required',
            'role_id'       => 'required',
            'moq'           => 'required|numeric|gt:0',
            'use_limit'     => 'required|numeric|gt:0',
            'rate'          => 'required|numeric|between:0.01,100',
            '*'             => new NoSpecialChars,
        ]);
    }
}
