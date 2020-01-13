<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TimeTable extends Model
{
    //
    protected $fillable = ["identifier", "invoices"];

    public function __construct()
    {
        $this->attributes["identifier"] = "Invoices: ".date('Y-m-d H:i:s');
    }

    protected $casts = [
        "invoices" => "array"
    ];
}
