<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Plan;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\Role;
use Arr;
use Hash;
use App\Rules\NoSpecialChars;
use App\Rules\PlanCheckCouponIsApplyableOrNot;
use Illuminate\Support\Facades\Log;

class PlanController extends Controller
{

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

        $plans = Plan::with(['role', 'product', 'coupon']);

        if (isset($request->s)) {
            $s = $request->s;

            $plans = $plans->orWhere('name', 'LIKE', '%' . $request->s . '%')
                ->orWhere('qty', 'LIKE', '%' . $request->s . '%')
                ->orWhere('price', 'LIKE', '%' . $request->s . '%');

            $plans = $plans->orWhereHas('role', function ($query) use ($s) {
                return $query->where('name', 'LIKE', '%' . $s . '%');
            });

            $plans = $plans->orWhereHas('product', function ($query) use ($s) {
                return $query->where('name', 'LIKE', '%' . $s . '%');
            });
        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'type') {
            $plans = $plans->orderBy(Role::select('name')->whereColumn('roles.id', 'plans.role_id'), $o);
        } elseif ($ob == 'product') {
            $plans = $plans->orderBy(Product::select('name')->whereColumn('products.id', 'plans.product_id'), $o);
        } else {
            $plans = $plans->orderBy($ob, $o);
        }

        $plans = $plans->paginate(env('PAGINATE_NO_OF_ROWS'));

        $plans->appends($request->except(['page']));

        $plans->map(function ($plan) {
            $roleIds = json_decode($plan->role_ids, true);

            if (!is_array($roleIds)) {
                $roleIds = [];
            }

            $plan->role_names = Role::whereIn('id', $roleIds)->pluck('name');

            return $plan;
        });

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            's' => $s,
            'o' => $o,
            'ob' => $ob,
            'firstitem' => $plans->firstItem()
        ]);
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        $user_type = Role::all();
        $types = [];
        foreach ($user_type as $value) {
            $types[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        $getProduct = Product::all();
        $products = [];
        foreach ($getProduct as $value) {
            $products[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        $getCoupon = Coupon::all();
        $coupons = [];
        foreach ($getCoupon as $value) {
            $coupons[] = [
                'value' => $value->id,
                'label' => $value->code,
            ];
        }

        return Inertia::render('Plans/Create',compact('types','products','coupons'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $this->settingValidation($request);

        $data = $request->all();
        $data['user_id'] = auth()->id();
        $data['role_id'] = $data['role_id'] ?? 0;
        $data['standalone'] = $data['standalone'] ?? 0;

        if (!is_array($data['role_ids'])) {
            $decoded = json_decode($data['role_ids'], true);
            $data['role_ids'] = array_values($decoded);
        }
        $data['role_ids'] = array_filter($data['role_ids'], fn($value) => !is_null($value));
        $data['role_ids'] = json_encode(array_values($data['role_ids']));

        Plan::create($data);

        return redirect()->route('plans.index')->with('success', 'Data inserted successfully!');
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Plan $plan)
    {
        $plan['role_ids'] = json_decode($plan['role_ids']);

        $user_type = Role::all();
        $types = [];
        foreach ($user_type as $value) {
            $types[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        $getProduct = Product::all();
        $products = [];
        foreach ($getProduct as $value) {
            $products[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }

        $getCoupon = Coupon::all();
        $coupons = [];
        foreach ($getCoupon as $value) {
            $coupons[] = [
                'value' => $value->id,
                'label' => $value->code,
            ];
        }

        return Inertia::render('Plans/Edit', [
            'plan'      => $plan,
            'types'     => $types,
            'products'  => $products,
            'coupons'   => $coupons,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Plan $plan)
    {
        $this->settingValidation($request);
        Log::info('Request data:', ['request' => $request->all()]);

        $data = $request->all();

        $data['role_id'] = $data['role_id'] ?? 0;
        $data['standalone'] = $data['standalone'] ?? 0;

        if (!is_array($data['role_ids'])) {
            $decoded = json_decode($data['role_ids'], true);
            $data['role_ids'] = array_values($decoded);
        }
        $data['role_ids'] = array_filter($data['role_ids'], fn($value) => !is_null($value));
        $data['role_ids'] = json_encode(array_values($data['role_ids']));

        Log::info('Role IDs before saving:', ['role_ids' => $data['role_ids']]);

        $plan->update($data);

        return redirect()->route('plans.index')->with('success', 'Plan updated successfully!');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Plan $plan)
    {
        $plan->delete();

        return redirect()->route('plans.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request): void
    {
        $this->validate($request, [
            'product_id'    => 'required|integer',
//            'role_id'       => 'required|integer',
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer'],
            'name'          => 'required|string|max:255',
            'qty'           => 'required|integer',
            'price'         => 'required|numeric',
            'standalone' => 'required|numeric|min:0',
            'standalone_status' => 'nullable|integer',
            'coupon_id'     => new PlanCheckCouponIsApplyableOrNot($request),
            '*'             => new NoSpecialChars,
        ], $this->customMessages());
    }

    protected function customMessages(): array
    {
        return [
            'standalone.gte' => 'The standalone field cannot be less than 0.',
        ];
    }
}
