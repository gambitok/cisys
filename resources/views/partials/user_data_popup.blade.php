<div style="text-align: center;">
    <div class="row">
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    User group
                </div>
                <div class="userValue">
                    {{ $rolename }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Full name
                </div>
                <div class="userValue">
                    {{ $user->name }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    First name
                </div>
                <div class="userValue">
                    {{ $user->firstname }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Last name
                </div>
                <div class="userValue">
                    {{ $user->lastname }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Title
                </div>
                <div class="userValue">
                    {{ $user->title }}
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Email
                </div>
                <div class="userValue">
                    {{ $user->email }}
                </div>
            </div>
        </div>
        @if(!empty($user->work_email))
            <div class="col-md-4">
                <div class="popUserInfo">
                    <div class="userTitle">
                        Work Email
                    </div>
                    <div class="userValue">
                        {{ $user->work_email }}
                    </div>
                </div>
            </div>
        @endif
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Username
                </div>
                <div class="userValue">
                    <a href="{{ url('licenses?user_id=' . $user->id) }}">
                        {{ $user->username }}
                    </a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Active
                </div>
                <div class="userValue">
                    {{ $user->status ? 'yes' : 'no' }}
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .popUserInfo .userTitle {
        color: #808080;
        text-transform: uppercase;
    }
    .popUserInfo {
        padding: 30px 0;
    }
</style>
