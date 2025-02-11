<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Setting;
use App\Models\Group;
use App\Models\Client;
use App\Models\License;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\CouponLog;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Role;
use App\Models\Plan;
use Arr;
use Hash;

class DashboardController extends Controller
{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $userController = new UserController;
        $permissions = $userController->checkRoleGetApi($request);

        $dataStastics = [];

        if (isset($permissions['roles']['settings']) && $permissions['roles']['settings'] == 2) {
            $dataStastics[] = [
                'name' => 'Settings',
                'count' => Setting::count(),
                'icon' => 'bi bi-gear-wide-connected',
                'link' => route('settings.index'),
            ];
        }

        if (isset($permissions['roles']['groups']) && $permissions['roles']['groups'] == 2) {
            $dataStastics[] = [
                'name' => 'Groups',
                'count' => Group::count(),
                'icon' => 'bi bi-diagram-3-fill',
                'link' => route('groups.index'),
            ];
        }

        if (isset($permissions['roles']['clients']) && $permissions['roles']['clients'] == 2) {
            $dataStastics[] = [
                'name' => 'Clients',
                'count' => Client::count(),
                'icon' => 'bi bi-people',
                'link' => route('clients.index'),
            ];
        }

        if (isset($permissions['roles']['licenses']) && $permissions['roles']['licenses'] == 2) {
            $dataStastics[] = [
                'name' => 'Licenses',
                'count' => License::count(),
                'icon' => 'bi bi-patch-check',
                'link' => route('licenses.index'),
            ];
        }

        if (isset($permissions['roles']['products']) && $permissions['roles']['products'] == 2) {
            $dataStastics[] = [
                'name' => 'Softwares',
                'count' => Product::count(),
                'icon' => 'bi bi-archive',
                'link' => route('products.index'),
            ];
        }

        if (isset($permissions['roles']['coupons']) && $permissions['roles']['coupons'] == 2) {
            $dataStastics[] = [
                'name' => 'Coupons',
                'count' => Coupon::count(),
                'icon' => 'bi bi-gift',
                'link' => route('coupons.index'),
            ];
        }

        if (isset($permissions['roles']['coupon-history']) && $permissions['roles']['coupon-history'] == 2) {
            $dataStastics[] = [
                'name' => 'Used Coupons',
                'count' => CouponLog::count(),
                'icon' => 'bi bi-list-check',
                'link' => route('coupon-history.index'),
            ];
        }

        if (isset($permissions['roles']['transactions']) && $permissions['roles']['transactions'] == 2) {
            $dataStastics[] = [
                'name' => 'Transactions',
                'count' => Transaction::count(),
                'icon' => 'bi bi-card-checklist',
                'link' => route('transactions.index'),
            ];
        }

        if (isset($permissions['roles']['users']) && $permissions['roles']['users'] == 2) {
            $dataStastics[] = [
                'name' => 'Users',
                'count' => User::count(),
                'icon' => 'bi bi-people-fill',
                'link' => route('users.index'),
            ];
        }

        if (isset($permissions['roles']['roles']) && $permissions['roles']['roles'] == 2) {
            $dataStastics[] = [
                'name' => 'User Groups',
                'count' => Role::count(),
                'icon' => 'bi bi-person-lines-fill',
                'link' => route('roles.index'),
            ];
        }

        if (isset($permissions['roles']['plans']) && $permissions['roles']['plans'] == 2) {
            $dataStastics[] = [
                'name' => 'Package',
                'count' => Plan::count(),
                'icon' => 'bi bi-box2-heart',
                'link' => route('plans.index'),
            ];
        }

        return Inertia::render('Dashboard', ['datastastics' => $dataStastics]);
    }

}
