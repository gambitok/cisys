<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PayPalController extends Controller{
    public function processTransaction(Request $request){
        $provider = new PayPalClient();
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('paypalSuccess',[$request->plan_id,$request->expiry_year]).'?subtotal='.$request->subtotal.'&couponcode='.$request->couponcode.'&serverqty='.$request->serverqty,
                "cancel_url" => route('paypalCancel'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->ammount
                    ]
                ]
            ]
        ]);
        if (isset($response['id']) && $response['id'] != null) {
            // redirect to approve href
            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    return redirect()->away($links['href']);
                }
            }
            return redirect()
                ->route('licenses.create')
                ->with('error', 'Something went wrong.');
        } else {
            return redirect()
                ->route('licenses.create')
                ->with('error', $response['message'] ?? 'Something went wrong.');
        }
    }
    /**
     * success transaction.
     *
     * @return \Illuminate\Http\Response
     */
    public function successTransaction(Request $request,$plan_id,$expiry_year)
    {
        
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request['token']);
        
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            
            $this->createLicense($plan_id, 3, $response['purchase_units'][0]['payments']['captures'][0]['id'], $expiry_year, $request->subtotal, $request->couponcode,$request->serverqty);
            
            return redirect()
                ->route('licenses.index')
                ->with('success', 'License purchased successfully!');
        } else {
            return redirect()
                ->route('licenses.create')
                ->with('error', $response['message'] ?? 'Something went wrong please try again later!');
        }
    }
    /**
     * cancel transaction.
     *
     * @return \Illuminate\Http\Response
     */
    public function cancelTransaction(Request $request)
    {
        return redirect()
            ->route('licenses.index')
            ->with('error', $response['message'] ?? 'You have canceled the transaction.');
    }
}