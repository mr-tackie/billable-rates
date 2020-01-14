<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\CSVHandler;
use Illuminate\Http\UploadedFile;

class CSVHandlerTest extends TestCase
{
    /**
     * @test
     * A csv file must be passed to parseCSV function.
     *
     * @return void
     */
    public function file_must_be_a_csv(){
        $file = UploadedFile::fake()->create('file.pdf', 0, 'application/pdf');
        $result = CSVHandler::parseCSV($file);

        $this->assertTrue($result['error']);
        $this->assertEquals($result['message'], "Provide a valid CSV file");
    }

    /**
     * @test
     * A valid file must be passed
     * 
     */
    public function param_must_be_a_file(){
        $result = CSVHandler::parseCSV("some random string");

        $this->assertTrue($result['error']);
        $this->assertEquals($result['message'], "A file must be passed as an argument");
    }

    public function csv_file_must_match_required_format(){
        $file = UploadedFile::fake()->create('file.pdf', 0, 'application/pdf');
        $result = CSVHandler::parseCSV($file);

        $this->assertTrue($result['error']);
        $this->assertEquals($result['message'], "Provide a valid CSV file");
    }
}
