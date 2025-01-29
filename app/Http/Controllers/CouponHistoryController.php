<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\CouponLog;
use App\Models\User;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;

class CouponHistoryController extends Controller{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $couponlogs = CouponLog::with(['user']);
                
        if (isset($request->s)) {
            $s = $request->s;

            $couponlogs = $couponlogs->orWhere('id','LIKE','%'.$request->s.'%')->orWhere('product_name','LIKE','%'.$request->s.'%')->orWhere('product_version','LIKE','%'.$request->s.'%')->orWhere('product_edition','LIKE','%'.$request->s.'%')->orWhere('plan_qty','LIKE','%'.$request->s.'%')->orWhere('coupon_code','LIKE','%'.$request->s.'%')->orWhere('created_at','LIKE','%'.$request->s.'%');

            $couponlogs = $couponlogs->orWhereHas('user', function($query) use ($s) {
                return $query->where('username','LIKE','%'.$s.'%'); 
            });

        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'username') {
            $couponlogs = $couponlogs->orderBy(User::select($ob)->whereColumn('coupon_logs.user_id', 'users.id'),$o);
        }else{
            $couponlogs = $couponlogs->orderBy($ob, $o);
        }

        $couponlogs = $couponlogs->paginate(env('PAGINATE_NO_OF_ROWS'));
        
        $couponlogs->appends($request->except(['page']));
        
        return Inertia::render('CouponHistory/Index', ['couponlogs' => $couponlogs,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $couponlogs->firstItem()]);
    }
    
}
