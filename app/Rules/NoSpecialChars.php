<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\Rule;

class NoSpecialChars implements Rule
{  
    public function __construct() {
  
    }

    /* public function passes($attribute, $value) {
        if (is_array($value)) {
            $value = implode("",$value);
        }
        return !preg_match('/[<>!$^]/', $value);
    }
  
    public function message() {
        return 'The :attribute may not contain special characters like (`<`,`>`,`!`,`$`,`^`).';
    } */

    public function passes($attribute, $value) {
        if (is_array($value)) {
            $value = implode("",$value);
        }

        if ($attribute == 'email' || $attribute == 'work_email') {
            return !preg_match('/[\\$&,;=?|\'<>^*%!:]/', $value);
        }else if($attribute == 'download_url'){
            return !preg_match('/[\\$&,;=?|\'<>^*%!]/', $value);
        }else if($attribute == 'site_icon' || $attribute == 'site_logo' || $attribute == 'header_script' || $attribute == 'footer_script' || $attribute == 'password'){
            return true;
        }else{
            return !preg_match('/[\\$&,;=?|\'<>^*%!:@]/', $value);
        }

    }
  
    public function message() {
        // return 'The :attribute may not contain special characters like (`<`,`>`,`!`,`$`,`^`).';
        return 'The :attribute only allows the following special characters. (_-+()[])';
    }
}
