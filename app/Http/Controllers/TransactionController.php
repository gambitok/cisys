<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\License;
use App\Models\User;
use App\Models\GeneralSetting;
use App\Models\Product;
use App\Models\Transaction;

use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class TransactionController extends Controller{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){

        $s = '';
        $o = 'DESC';
        $ob = 'transaction_id';

        $licenses = Transaction::with(['user','product']);
                
        if (isset($request->s)) {
            $s = $request->s;

            $licenses = $licenses->orWhere('id','LIKE','%'.$request->s.'%')->orWhere('created_at','LIKE','%'.$request->s.'%')->orWhere('total','LIKE','%'.$request->s.'%');

            $licenses = $licenses->orWhereHas('user', function($query) use ($s) {
                return $query->where('username','LIKE','%'.$s.'%'); 
            });

            $licenses = $licenses->orWhereHas('product', function($query) use ($s) {
                return $query->where('name','LIKE','%'.$s.'%'); 
            });

        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'username') {
            $licenses = $licenses->orderBy(User::select($ob)->whereColumn('transactions.user_id', 'users.id'),$o);
        }else if($ob == 'product'){
            $licenses = $licenses->orderBy(Product::select('name')->whereColumn('transactions.product_id', 'products.id'),$o);
        }else{
            $licenses = $licenses->orderBy($ob, $o);
        }

        $licenses = $licenses->paginate(env('PAGINATE_NO_OF_ROWS'));
        
        $licenses->appends($request->except(['page']));

        
        return Inertia::render('Transactions/Index', ['licenses' => $licenses,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $licenses->firstItem()]);
    }
    

    public function refund($transaction_id){

        $transaction = Transaction::find($transaction_id);
        if ($transaction) {
            if ($transaction->payment_type == 2) {

                $stripe_envs = GeneralSetting::where('key','stripe_env')->first();
                if($stripe_envs['value'] == '1'){
                    $a = GeneralSetting::where('key','test_secretkey')->first();
                    $secretkey =  $a['value'];
                }else{
                    $a = GeneralSetting::where('key','live_secretkey')->first();
                    $secretkey =  $a['value'];
                }


                try {
                    $stripe = new \Stripe\StripeClient($secretkey);
                    $response = $stripe->refunds->create(['payment_intent' => $transaction->transaction_id]);
                    $transaction->refund = 1;
                    $transaction->save();

                    return redirect()->route('transactions.index')->with('success', 'Payment refunded. It may take a few days for the money to reach the customer account.');
                } catch(\Stripe\Exception\CardException $e) {
                    return redirect()->route('transactions.index')->with('error', $e->getError()->message);
                } catch (\Stripe\Exception\InvalidRequestException $e) {
                    return redirect()->route('transactions.index')->with('error', $e->getError()->message);
                } catch (Exception $e) {
                    return redirect()->route('transactions.index')->with('error', $e->getError()->message);
                }
            }else if ($transaction->payment_type == 3) {
                
                $transactionId = $transaction->transaction_id;
                $transactionTotal = $transaction->total;
                $provider = new PayPalClient();
                $provider->setApiCredentials(config('paypal'));
                $paypalToken = $provider->getAccessToken();
               
                $refundResponse = $provider->refundCapturedPayment($transactionId,$transactionId, $transactionTotal,'Refund by portal.cisys.us administration!');
                
                if (isset($refundResponse['error']['details'][0]['description'])) {
                    return redirect()->route('transactions.index')->with('error', $refundResponse['error']['details'][0]['description']);
                }else if (isset($refundResponse['error']['message'])) {
                    return redirect()->route('transactions.index')->with('error', $refundResponse['error']['message']);
                }else if(isset($refundResponse['status']) && $refundResponse['status'] == 'COMPLETED'){

                    $transaction->refund = 1;
                    $transaction->save();

                    return redirect()->route('transactions.index')->with('success', 'Payment refunded. It may take a few days for the money to reach the customer account.');
                }
                
            }
        }
        

        return redirect()->route('transactions.index')->with('error', 'Something went wrong!');
    }
}
