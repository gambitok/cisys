<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('setting_screens', function (Blueprint $table) {
            $table->integer('alarm_height')->after('alarm_message');
            $table->integer('alarm_border')->after('alarm_height');
            $table->string('alarm_color', 20)->after('alarm_border');
            $table->string('alarm_center_text', 255)->after('alarm_color');
            $table->string('alarm_right_text', 255)->after('alarm_center_text');
            $table->string('alarm_text_color', 255)->after('alarm_right_text');
            $table->integer('alarm_text_size')->default(0)->after('alarm_text_color');
            $table->integer('alarm_heartbeat')->default(0)->after('alarm_text_size');
        });
    }

    public function down()
    {
        Schema::table('setting_screens', function (Blueprint $table) {
            $table->dropColumn([
                'alarm_height',
                'alarm_border',
                'alarm_color',
                'alarm_center_text',
                'alarm_right_text',
                'alarm_text_color',
                'alarm_text_size',
                'alarm_heartbeat'
            ]);
        });
    }
};
