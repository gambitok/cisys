<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Rules\NoSpecialChars;
use App\Models\Product;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;

class ProductController extends Controller
{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        
        $products = new Product;

        if (isset($request->s)) {
            $s = $request->s;

            $products = $products->orWhere('name','LIKE','%'.$request->s.'%')->orWhere('price','LIKE','%'.$request->s.'%')->orWhere('version','LIKE','%'.$request->s.'%')->orWhere('edition','LIKE','%'.$request->s.'%')->orWhere('os','LIKE','%'.$request->s.'%')->orWhere('unit','LIKE','%'.$request->s.'%')->orWhere('tax','LIKE','%'.$request->s.'%');

        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

       
        $products = $products->orderBy($ob, $o);
        
        $products = $products->paginate(env('PAGINATE_NO_OF_ROWS'));
        
        $products->appends($request->except(['page']));


        return Inertia::render('Products/Index', ['products' => $products,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $products->firstItem()]);
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create(){
        return Inertia::render('Products/Create');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request){
        
        $this->settingValidation($request);

        $data = $request->all();
        $data['user_id'] = auth()->id();
        
        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Data inserted successfully!');
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit(Product $product){
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update(Request $request, Product $product)
    {

        $this->settingValidation($request);
        
        $product->update($request->all());

        return redirect()->route('products.index')->with('success', 'Data updated successfully!');
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function destroy(Product $product){
        $product->delete();
    
        return redirect()->route('products.index')->with('success', 'Data deleted successfully!');
    }

    public function settingValidation($request){
        $this->validate($request, [
            'name'          => 'required',
            'price'         => 'required',
            'version'       => 'required',
            'edition'       => 'required',
            'os'            => 'required',
            'unit'          => 'required',
            'tax'           => 'required',
            'download_url'  => 'required',
            '*'             => new NoSpecialChars,
        ]);
    }
    
    public function productsMultipleDelete(Request $request){
        foreach ($request->products as $value) {
            $product = Product::find($value);
            $product->delete();
        }
    
        return redirect()->route('products.index')->with('success', 'Data deleted successfully!');
    }
}
