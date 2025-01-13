<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CommonController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('ping', [CommonController::class, 'index']);
Route::post('authenticate', [CommonController::class, 'authenticate']);


Route::middleware('checkapitoken')->group(function () {
    
    Route::post('upload-device-list', [CommonController::class, 'uploadDeviceList']);
    Route::post('download-device-setting', [CommonController::class, 'downloadDeviceSetting']);

});