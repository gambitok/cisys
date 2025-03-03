<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\LicenseController;
use App\Http\Controllers\CouponHistoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\IconController;
use App\Http\Middleware\CheckRouteByRole;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SubMenuController;
use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
    | Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/* Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
}); */

Route::get('/verify-email-edit/{token}', [UserController::class, 'verifyEmail'])->name('verify-email');

/* Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard'); */
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/auth/google', [GoogleController::class, 'googlepage'])->name('authlogin');
Route::get('/auth/google/callback', [GoogleController::class, 'googlecallback']);

Route::middleware('auth', 'verified')->group(function () {

    Route::get('/home', function () {
        if (Auth::user()->role) {
            $rolename = Auth::user()->role->name;
        }else{
            $rolename = '-';
        }
        return Inertia::render('Home',['rolename'=>$rolename]);
    })->name('home');

    Route::middleware('role')->group(function () {

        Route::resource('settings', SettingController::class);

        Route::post('settings-multiple-delete', [SettingController::class, 'settingsMultipleDelete'])->name('settings.multiple.delete');

        Route::resource('groups', GroupController::class);

        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('client-groups-bind', [ClientController::class, 'clientGroupsBind'])->name('clients.client-groups-bind');
        Route::post('client-settings-bind', [ClientController::class, 'clientsSettingsBind'])->name('clients.client-settings-bind');
        Route::post('clients-multiple-delete', [ClientController::class, 'clientsMultipleDelete'])->name('clients.multiple.delete');

        Route::resource('users', UserController::class);
        Route::post('users-multiple-delete', [UserController::class, 'usersMultipleDelete'])->name('users.multiple.delete');
        Route::get('user-genreate-key/{id}', [UserController::class, 'userGenreateKey'])->name('user-genreate-key');

        Route::resource('roles', RoleController::class);

        Route::resource('products', ProductController::class);

        Route::post('products-multiple-delete', [ProductController::class, 'productsMultipleDelete'])->name('products.multiple.delete');

        Route::resource('coupons', CouponController::class);

        Route::resource('plans', PlanController::class);

        Route::resource('menus', MenuController::class);

        Route::get('licenses', [LicenseController::class, 'index'])->name('licenses.index');
        Route::get('licenses/create', [LicenseController::class, 'create'])->name('licenses.create');
        Route::post('licenses/store', [LicenseController::class, 'store'])->name('licenses.store');
        Route::post('licenses/bind-server-id', [LicenseController::class, 'bindServerID'])->name('licenses.bind-server-id');
        Route::post('licenses/download-license', [LicenseController::class, 'downloadLicense'])->name('licenses.download-license');

        Route::post('licenses/validate-server-id', [LicenseController::class, 'validateServerID'])->name('licenses.validate-server-id');
        Route::post('licenses/check-coupon-valid', [LicenseController::class, 'checkCouponValid'])->name('licenses.check-coupon-valid');

        Route::get('coupon-history', [CouponHistoryController::class, 'index'])->name('coupon-history.index');

        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
        Route::post('transactions-refund/{id}', [TransactionController::class, 'refund'])->name('transactions.refund');

        Route::get('icons', [IconController::class, 'index'])->name('icons.index');

        Route::get('general-setting', [SettingController::class, 'generalSetting'])->name('general-setting.index');

        Route::post('general-setting', [SettingController::class, 'generalSettingSubmit'])->name('setting.general.store');
    });

    Route::controller(StripePaymentController::class)->group(function(){
        Route::post('stripe', 'stripe')->name('stripe.payment');
        Route::get('stripe/{plan_id}/{expiry_year}', 'stripeReturnUrl')->name('stripe.returnurl');
        Route::post('stripecreate', 'stripecreate');
    });

    Route::post('paypal-process', [PayPalController::class, 'processTransaction'])->name('paypalProcess');
    Route::get('paypal-success/{plan_id}/{expiry_year}', [PayPalController::class, 'successTransaction'])->name('paypalSuccess');
    Route::get('paypal-cancel', [PayPalController::class, 'cancelTransaction'])->name('paypalCancel');

    Route::get('submenu/{menuid}/create', [SubMenuController::class,'create'])->name('submenu.create');
    Route::post('submenu/store', [SubMenuController::class,'store'])->name('submenu.store');
    Route::get('submenu/{id}/edit', [SubMenuController::class,'edit'])->name('submenu.edit');
    Route::put('submenu/{menu}/update', [SubMenuController::class,'update'])->name('submenu.update');
    Route::delete('submenu/{menu}/destroy', [SubMenuController::class,'destroy'])->name('submenu.destroy');

    Route::post('groups-multiple-delete', [GroupController::class, 'groupsMultipleDelete'])->name('groups.multiple.delete');
    Route::post('groups-bind', [GroupController::class, 'groupsBind'])->name('groups.bind');

    Route::get('checkRoleGetApi', [UserController::class, 'checkRoleGetApi'])->name('checkRoleGetApi');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/get-user-data-popup/{id}', [UserController::class, 'getUserDataPopup'])->name('get-user-data-popup');
});

require __DIR__.'/auth.php';




