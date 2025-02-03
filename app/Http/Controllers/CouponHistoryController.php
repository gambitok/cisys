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
    public function index(Request $request)
    {
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $couponlogs = CouponLog::with(['user']);

        if (isset($request->s)) {
            $s = $request->s;

            $couponlogs = $couponlogs->orWhere('id','LIKE','%'.$request->s.'%')
                ->orWhere('product_name','LIKE','%'.$request->s.'%')
                ->orWhere('product_version','LIKE','%'.$request->s.'%')
                ->orWhere('product_edition','LIKE','%'.$request->s.'%')
                ->orWhere('plan_qty','LIKE','%'.$request->s.'%')
                ->orWhere('coupon_code','LIKE','%'.$request->s.'%')
                ->orWhere('created_at','LIKE','%'.$request->s.'%');

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
        } else {
            $couponlogs = $couponlogs->orderBy($ob, $o);
        }

        $couponlogs = $couponlogs->paginate(env('PAGINATE_NO_OF_ROWS'));

        $couponlogs->appends($request->except(['page']));

        return Inertia::render('CouponHistory/Index', [
            'couponlogs' => $couponlogs,
            's' => $s,
            'o' => $o,
            'ob' => $ob,
            'firstitem' => $couponlogs->firstItem()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'product_name' => 'required|string|max:255',
            'product_version' => 'required|string|max:255',
            'product_edition' => 'required|string|max:255',
            'plan_qty' => 'required|integer',
            'coupon_code' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $couponLog = CouponLog::create([
            'user_id' => $request->user_id,
            'product_name' => $request->product_name,
            'product_version' => $request->product_version,
            'product_edition' => $request->product_edition,
            'plan_qty' => $request->plan_qty,
            'coupon_code' => $request->coupon_code,
        ]);

        return response()->json(['couponLog' => $couponLog], 201);
    }

}
