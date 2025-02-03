<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Plan;
use App\Models\License;
use App\Models\User;
use App\Models\Setting;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Auth;

class LicenseController extends Controller{
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

        $licenses = License::with(['user','transaction']);

        if (isset($request->s)) {
            $s = $request->s;

            $licenses = $licenses->orWhere('id','LIKE','%'.$request->s.'%')->orWhere('plan_id','LIKE','%'.$request->s.'%')->orWhere('device_count','LIKE','%'.$request->s.'%')->orWhere('server_id','LIKE','%'.$request->s.'%')->orWhere('buy_date','LIKE','%'.$request->s.'%')->orWhere('expiration_date','LIKE','%'.$request->s.'%');

            $licenses = $licenses->orWhereHas('user', function($query) use ($s) {
                return $query->where('username','LIKE','%'.$s.'%');
            });
        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'username') {
            $licenses = $licenses->orderBy(User::select($ob)->whereColumn('licenses.user_id', 'users.id'),$o);
        } else {
            $licenses = $licenses->orderBy($ob, $o);
        }

        $licenses = $licenses->paginate(env('PAGINATE_NO_OF_ROWS'));

        $licenses->appends($request->except(['page']));

        return Inertia::render('Licenses/Index', ['licenses' => $licenses,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $licenses->firstItem()]);
    }

    public function create()
    {
        $user = Auth::user();
        $role_id = $user->role_id;

        /* $user_type = UserType::all();
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
        } */

        $all_plans = Plan::with(['coupon', 'product'])->orderBy('id')->get();
        $plans = [];

        foreach ($all_plans as $value) {
            // Skip plans based on the user's role_id
            if (($role_id == 14 && $value->role_id == 1) ||
                ($role_id == 16 && in_array($value->role_id, [1, 14]))) {
                continue;
            }

            $plans[] = [
                'value' => $value->id,
                'label' => $value->name,
                'standalone' => $value->standalone,
            ];
        }

        return Inertia::render('Licenses/Create', compact('plans', 'all_plans'));
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'plan_id' => 'required',
        ]);

        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $transaction_id_gen = '';
        for ($i = 0; $i < 16; $i++)
            $transaction_id_gen .= $characters[mt_rand(0, 61)];

        $transaction_id = $request->plan_id.'_'.$transaction_id_gen;

        $this->createLicense($request->plan_id, $payment_type = 1, $transaction_id, $request->expiry_year);

        return redirect()->route('licenses.index')->with('success', 'License purchased successfully!');
    }

    public function bindServerID(Request $request)
    {
        if (isset($request['license_id'])) {
            $license = License::find($request['license_id']);
            $license->server_id = $request['server_id'];
            $license->server_file_cer = $request['server_file_cer'];
            $license->buy_date = date("Y-m-d H:i:s");

            $expiry_year = $license->expiry_year;
            if ($expiry_year == 0) {
                $expiration_date = date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s"). ' + 14 days'));

            } else {
                $expiration_date = date('Y-m-d H:i:s', strtotime(date("Y-m-d H:i:s"). ' + '.$expiry_year.' year'));
            }

            $license->expiration_date = $expiration_date;

            $license->save();

            $json = [
                'buy_date' => date("Y-m-d H:i:s"),
                'expiration_date' => $expiration_date,
                'license_id' => $request['license_id'],
            ];

        }
        echo json_encode($json);
        exit;
    }

    public function downloadLicense(Request $request)
    {
        if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
            $server = 0;
        } else {
            $server = 1;
        }

        /* $returnjson = [
            'success' => 1,
            'message' => '',
            'downloadfiles' => [],
        ]; */

        $public_key_filename = 'licenses_download_key/ylswaeqwyn_public_key.pem';

        $downloadfiles = [];

        foreach ($request->licenses as $license_id) {

            $license = License::find($license_id);

            $cert_filename = $license->server_file_cer;

            if ($server) {

                // loading signed certificate details
                $signed_cert = openssl_x509_parse(file_get_contents($cert_filename));

                // validating signed certificate

                // Load and parse the certificate
                $certResource = openssl_x509_read(file_get_contents($cert_filename));

                // Load and parse the public key
                $publicKeyResource = openssl_pkey_get_public(file_get_contents($public_key_filename));

                // Verify the certificate against the public key
                $verifyResult = openssl_x509_verify($certResource, $publicKeyResource);

            } else {
                $verifyResult = 1;
            }

            // Check the verification result
            if ($verifyResult === 1) {
                $downloadfiles[] = [
                    'success' => 1,
                    'license_id' => $license_id,
                    'message' => 'Certificate downloaded is done.',
                    'cert_filename' => $cert_filename,
                ];
            } elseif ($verifyResult === 0) {
                $downloadfiles[] = [
                    'success' => 0,
                    'license_id' => $license_id,
                    'message' => 'Certificate ('.$cert_filename.'): [INVALID] The certificate is invalidated against the public key of the SCM.',
                    'cert_filename' => $cert_filename,
                ];
            } else {
                $downloadfiles[] = [
                    'success' => 0,
                    'license_id' => $license_id,
                    'message' => 'Certificate ('.$cert_filename.'): verifiaction encountered an error.',
                    'cert_filename' => $cert_filename,
                ];
            }
        }

        $returnjson['downloadfiles'] = $downloadfiles;

        echo json_encode($returnjson);
        exit;
    }

    public function validateServerID(Request $request)
    {
        $samearray = array_diff_assoc($request->all(), array_unique($request->all()));

        $licenses = [];

        foreach ($request->all() as $key => $value) {
            $success = 1;
            $message = '';

            if (in_array($value, $samearray)) {
                $success = 0;
                $message = 'This server id input box same value another input box!';
            }
            /* else {
               $license = License::where('server_id',$value)->first();
               if ($license) {
                   $success = 0;
                   $message = 'This server id exits another license!';
               }
            }*/

            $licenses[] = [
                'success'       => $success,
                'license_id'    => $key,
                'server_id'     => $value,
                'message'       => $message,
            ];
        }

        echo json_encode($licenses);
        exit;
    }

    function checkCouponValid(Request $request)
    {
        $couponcode = $request->couponcode;
        $customclients = $request->customclients;

        $responce = $this->checkCouponValiedOrNot($couponcode,$customclients);

        echo json_encode($responce);
        exit;
    }

}
