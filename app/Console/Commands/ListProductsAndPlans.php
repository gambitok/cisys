<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Plan;

class ListProductsAndPlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'list:products-and-plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all products and plans';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $products = Product::all();
        $plans = Plan::all();

        $this->info('Products:');
        foreach ($products as $product) {
            $this->info("ID: {$product->id}, Name: {$product->name}, User ID: {$product->user_id}");
        }

        $this->info('Plans:');
        foreach ($plans as $plan) {
            $this->info("ID: {$plan->id}, Name: {$plan->name}, Product ID: {$plan->product_id}, Price: {$plan->price}");
        }

        return 0;
    }
}
