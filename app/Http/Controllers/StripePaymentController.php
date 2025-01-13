<?php

namespace App\Http\Controllers;
     
use Illuminate\Http\Request;
use Session;
use Stripe;
use Inertia\Inertia;
use App\Models\GeneralSetting;

     
class StripePaymentController extends Controller{

    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function stripe(Request $request){
        return view('stripe', ['ammount' => $request->ammount,'plan_id' => $request->plan_id,'expiry_year' => $request->expiry_year,'subtotal' => $request->subtotal,'couponcode' => $request->couponcode,'serverqty' => $request->serverqty]);
    }

    public function stripecreate(Request $request){

        $stripe_envs = GeneralSetting::where('key','stripe_env')->first();

        if($stripe_envs['value'] == '1'){
            $a = GeneralSetting::where('key','test_secretkey')->first();

            $secretkey =  $a['value'];

        }else{
            $a = GeneralSetting::where('key','live_secretkey')->first();

            $secretkey =  $a['value'];

        }



        
        $stripe = new Stripe\StripeClient($secretkey);
        
        try {
            // retrieve JSON from POST body
            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            // Create a PaymentIntent with amount and currency
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => $request->ammount * 100,
                'currency' => 'inr',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            $output = [
                'clientSecret' => $paymentIntent->client_secret,
            ];

            echo json_encode($output);
        } catch (Error $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function stripeReturnUrl(Request $request,$plan_id,$expiry_year){
       
        if (isset($request->redirect_status) && $request->redirect_status == 'succeeded') {
           
            $this->createLicense($plan_id, 2, $request->payment_intent, $expiry_year,$request->subtotal,$request->couponcode,$request->serverqty);

            return redirect()->route('licenses.index')->with('success', 'License purchased successfully!');

        }else{

            return redirect()->route('licenses.create')->with('error', 'Something went wrong please try again later!');

        }
        
    }
    
    
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    /* public function stripePost(Request $request){

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
    
        Stripe\Charge::create ([
                "amount" => 100 * 100,
                "currency" => "usd",
                "source" => $request->stripeToken,
                "description" => "Test payment from itsolutionstuff.com." 
        ]);
      
        Session::flash('success', 'Payment successful!');
              
        return back();
    } */
}
