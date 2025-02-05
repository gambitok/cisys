<center>
    <div class="row">
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Usergroup
                </div>
                <div class="userValue">
                    {{ $rolename }}
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Fullname
                </div>
                <div class="userValue">
                    {{ $user->name }}
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
        <div class="col-md-4">
            <div class="popUserInfo">
                <div class="userTitle">
                    Username
                </div>
                <div class="userValue">
                    {{ $user->username }}
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
</center>
<style>
    .popUserInfo .userTitle {
        color: #808080;
        text-transform: uppercase;
    }
    .popUserInfo {
        padding: 30px 0px;
    }
</style>
