<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TimeTable;
use App\CSVHandler;

class TimeTableController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return TimeTable::orderBy("created_at", "desc")->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //make sure only csv files can be passed 
        $request->validate([
            "file" => "required|file|mimes:csv,txt"
        ]);
        //
        if($request->has("file")){
            $file = $request->file("file");
            $parseResult = CSVHandler::parseCSV($file);

            if($parseResult["error"]){
                return response()->json($parseResult);
            }

            $timetable = new TimeTable();
            $timetable->invoices = $parseResult["data"];

            if($timetable->save()){
                return response()->json(
                    ["error" => false,
                    "data" => $timetable,]
                );
            }

            return response()->json([
                "error" => true,
                "message" => "Could not save the timetable",
            ]);
        }else{
            return response()->json([
                "error" => true,
                "message" => "No CSV found with request"
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $timetable = TimeTable::find($id);
        return response()->json([
            "error" => $timetable === null,
            "data" => $timetable,
            "message" => $timetable !== null ? "" : "No timetable found with given id"
        ], $timetable !== null ? 200 : 404);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $timetable = TimeTable::find($id);
        $delete_status = $timetable->delete();

        return response()->json([
            "error" => !$delete_status,
            "message" => $delete_status ? "Could not delete specified timetable" : "Timetable deleted"
        ], $delete_status ? 400 : 200);
    }
}
