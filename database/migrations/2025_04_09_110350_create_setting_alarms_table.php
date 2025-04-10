<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setting_alarms', function (Blueprint $table) {
            $table->id();
            $table->integer('alarm_code');
            $table->string('alarm_message', 255);
            $table->integer('alarm_height');
            $table->integer('alarm_border');
            $table->string('alarm_color', 20);
            $table->string('alarm_center_text', 255);
            $table->string('alarm_right_text', 255);
            $table->string('alarm_text_color', 255);
            $table->integer('alarm_text_size')->default(0);
            $table->integer('alarm_heartbeat')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_alarms');
    }
};
