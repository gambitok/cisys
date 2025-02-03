<?php

namespace App\Http\Controllers;

use App\Models\Setting;
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

class ClientController extends Controller
{

     /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $search = '';
        $order = 'DESC';
        $orderBy = 'id';

        $clients = Client::with(['user', 'group']);

        if (isset($request->s)) {
            $search = $request->s;

            $clients = $clients
                ->orWhere('client_id', 'LIKE', '%' . $request->s . '%')
                ->orWhere('server_id', 'LIKE', '%' . $request->s . '%')
                ->orWhere('name', 'LIKE', '%' . $request->s . '%')
                ->orWhere('ipaddress', 'LIKE', '%' . $request->s . '%')
                ->orWhere('os_version', 'LIKE', '%' . $request->s . '%')
                ->orWhereHas('user', function ($query) use ($search) {
                    return $query->where('username', 'LIKE', '%' . $search . '%');
                })
                ->orWhereHas('group', function ($query) use ($search) {
                    return $query->where('name', 'LIKE', '%' . $search . '%');
                });
        }

        if (isset($request->o)) {
            $orderBy = $request->ob;
            $order = $request->o;
        }

        switch ($orderBy) {
            case 'username':
                $clients = $clients->orderBy(User::select($orderBy)->whereColumn('clients.user_id', 'users.id'), $order);
                break;
            case 'group':
                $clients = $clients->orderBy(Group::select('name')->whereColumn('clients.group_id', 'groups.id'), $order);
                break;
            case 'setting':
                $clients = $clients->orderBy(
                    Group::select('settings.name')
                        ->join('settings', 'settings.id', '=', 'groups.setting_id')
                        ->whereColumn('clients.group_id', 'groups.id'),
                    $order
                );
                break;
            default:
                $clients = $clients->orderBy($orderBy, $order);
                break;
        }

        $clients = $clients->paginate(env('PAGINATE_NO_OF_ROWS'));

        $clients->appends($request->except(['page']));

        $users = User::withTrashed()->get()->keyBy('id');

        $groups = Group::with('user')->get()->map(function ($group) use ($users) {
            $userName = isset($users[$group->user_id]) ? $users[$group->user_id]->name : 'Unknown user';

            return [
                'value' => $group->id,
                'label' => "{$userName}: {$group->name}",
            ];
        })->values();

        $settings = Setting::with('user')->get()->map(function ($setting) use ($users) {
            $userName = isset($users[$setting->user_id]) ? $users[$setting->user_id]->name : 'Unknown user';

            return [
                'value' => $setting->id,
                'label' => "{$userName}: {$setting->name}",
            ];
        })->values();

        return Inertia::render(
            'Clients/Index',
            [
                'clients' => $clients,
                'groups' => $groups,
                'settings' => $settings,
                's' => $search,
                'o' => $order,
                'ob' => $orderBy,
                'firstitem' => $clients->firstItem(),
            ]
        );
    }

    public function clientGroupsBind(Request $request)
    {
        $this->validate($request, [
            'group_id'    => 'required'
        ]);

        Client::whereIn('id', $request->clients)->update(['group_id' => $request->group_id]);

        return redirect()->back()->with('success', 'Data updated successfully!');
    }

    public function clientsSettingsBind(Request $request)
    {
        $this->validate($request, [
            'setting_id' => 'required'
        ]);

        $groupIds = Client::whereIn('id', $request->clients)->pluck('group_id')->unique();

        Group::whereIn('id', $groupIds)->update(['setting_id' => $request->setting_id]);

        return redirect()->back()->with('success', 'Data updated successfully!');
    }

    public function clientsMultipleDelete(Request $request)
    {
        foreach ($request->clients as $value) {
            $client = Client::find($value);

            if ($client) {
                $client->delete();
            }
        }

        return redirect()->route('clients.index')->with('success', 'Data deleted successfully!');
    }

}
