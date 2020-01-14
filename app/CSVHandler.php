<?php

namespace App;

class CSVHandler
{
    public static function parseCSV($file)
    {
        try {
            $extension = $file->getClientOriginalExtension();
        $line = 0;
        $parsed_data = array();

        if ($extension === "csv") {
            if (($handle = fopen($file, "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    if ($line == 0) {
                        if (
                            strtolower($data[0]) !== "employee id"
                            || strpos(strtolower($data[1]), "billable rate") === false
                            || strtolower($data[2]) !== "project"
                            || strtolower($data[3]) !== "date"
                            || strtolower($data[4]) !== "start time"
                            || strtolower($data[5]) !== "end time"
                            || count($data) !== 6
                        ) {
                            return array("error" => true, "message" => "Format of csv file does not match required format");
                        }
                    } else {
                        $current_company = strtolower($data[2]);
                        $start_time = strtotime($data[3] . " " . $data[4]);
                        $end_time = strtotime($data[3] . " " . $data[5]);
                        $hours = ($end_time - $start_time) / 3600;

                        if (isset($parsed_data[$current_company])) {
                            $parsed_data[$current_company]["data"][] = array(
                                "employee_id" => $data[0],
                                "no_of_hours" => $hours,
                                "unit_price" => $data[1],
                                "cost" => $data[1] * $hours
                            );
                        } else {
                            $parsed_data[$current_company] = array(
                                "name" => $data[2],
                                "data" => array(
                                    array(
                                        "employee_id" => $data[0],
                                        "no_of_hours" => $hours,
                                        "unit_price" => $data[1],
                                        "cost" => $data[1] * $hours
                                    )
                                )
                            );
                        }
                    }

                    $line++;
                }
                fclose($handle);
                
                return array("error" => false, "data" => array_values($parsed_data));
            }
        } else {
            return array("error" => true, "message" => "Provide a valid CSV file");
        }
        } catch (\Throwable $th) {
            return array("error" => true, "message" => "A file must be passed as an argument");
        }
    }
}
