<?php

namespace Tests\Feature;

use App\TimeTable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TimeTableResourceTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     * A basic feature test example.
     *
     * @return void
     */
    public function a_timetable_can_be_added()
    {
        $file = UploadedFile::fake()->create('file.csv', 0, 'text/csv');

        $response = $this->post('/api/timetables', [
            "file" => $file
        ]);

        $response->assertOk();
        $this->assertCount(1, TimeTable::all());
    }

    /**
     * @test
     * 
     * A test to ensure that uploaded file must be csv
     * @return void
     */
    public function a_timetable_must_be_csv(){
        $file = UploadedFile::fake()->create('file.pdf', 0, 'application/pdf');

        $response = $this->post('/api/timetables', [
            "file" => $file
        ]);

        $response->assertSessionHasErrors('file');
    }

    /**
     * 
     * @test
     * 
     * A test to ensure that file must exist
     */
    public function a_file_must_exist(){
        $response = $this->post('/api/timetables');

        $response->assertSessionHasErrors('file');
    }

    /**
     * 
     * @test
     * 
     * Ensure that an array of type TimeTable is returned when get is called
     */

     public function a_valid_collection_should_be_returned_when_get_is_called(){
        $this->withoutExceptionHandling();

        $file = UploadedFile::fake()->create('file.csv', 0, 'text/csv');

        $this->post('/api/timetables', [
            "file" => $file
        ]);

         $response = $this->get('/api/timetables');

         $response->assertOk();
         $data = $response->original;
         $this->assertInstanceOf('\Illuminate\Database\Eloquent\Collection', $data);

         $timetable = $data[0];
         $this->assertInstanceOf('\App\TimeTable', $timetable);
     }

     /**
      * @test
      */
     public function a_timetable_must_be_returned_when_requested(){
        $this->withoutExceptionHandling();
        $file = UploadedFile::fake()->create('file.csv', 0, 'text/csv');

        $this->post('/api/timetables', [
            "file" => $file
        ]);
        $timetable = TimeTable::first();

        $response = $this->get('/api/timetables/'.$timetable->id);
        $this->assertFalse($response->original['error']);
        $this->assertInstanceOf('\App\TimeTable', $response->original['data']);
     }
}
