<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Client;
use App\Models\Group;
use App\Models\User;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Illuminate\Support\Facades\Validator;
use Arr;
use Hash;

class ClientController extends Controller{
     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request){
        
        $s = '';
        $o = 'DESC';
        $ob = 'id';

        $clients = Client::with(['user','group']);
        
        if (isset($request->s)) {
            $s = $request->s;

            $clients = $clients->orWhere('client_id','LIKE','%'.$request->s.'%')->orWhere('server_id','LIKE','%'.$request->s.'%')->orWhere('name','LIKE','%'.$request->s.'%')->orWhere('ipaddress','LIKE','%'.$request->s.'%')->orWhere('os_version','LIKE','%'.$request->s.'%');

            $clients = $clients->orWhereHas('user', function($query) use ($s) {
                return $query->where('username','LIKE','%'.$s.'%'); 
            });

            $clients = $clients->orWhereHas('group', function($query) use ($s) {
                return $query->where('name','LIKE','%'.$s.'%'); 
            });


        }

        if (isset($request->o)) {
            $ob = $request->ob;
            $o = $request->o;
        }

        if ($ob == 'username') {
            $clients = $clients->orderBy(User::select($ob)->whereColumn('clients.user_id', 'users.id'),$o);
        }else if($ob == 'group'){
            $clients = $clients->orderBy(Group::select('name')->whereColumn('clients.group_id', 'groups.id'),$o);
        }else if($ob == 'setting'){
            $clients = $clients->orderBy(Group::select('settings.name')->join('settings', 'settings.id', '=', 'groups.setting_id')->whereColumn('clients.group_id', 'groups.id'),$o);
        }else{
            $clients = $clients->orderBy($ob, $o);
        }

        
        
        $clients = $clients->paginate(env('PAGINATE_NO_OF_ROWS'));
        
        $clients->appends($request->except(['page']));


        $group = Group::all();
        $groups = [];
        foreach ($group as $value) {
            $groups[] = [
                'value' => $value->id,
                'label' => $value->name,
            ];
        }


        return Inertia::render('Clients/Index', ['clients' => $clients,'groups'=>$groups,'s' => $s,'o' => $o,'ob' => $ob,'firstitem' => $clients->firstItem()]);
    }
    
    public function clientGroupsBind(Request $request) {
        $this->validate($request, [
            'group_id'    => 'required'
        ]);
        
        Client::whereIn('id',$request->clients)->update(['group_id'=>$request->group_id]);

        return redirect()->back()->with('success', 'Data updated successfully!');
    }

}
