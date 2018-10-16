<?php

$conn = new connector();
$con = $conn->connect();

	//$filepath = "C:/wamp/www/mif/assets/php/auto_import/inventory/files/SAP_INV_Portal.csv";
	
	$filepath = "C:/SAP FILES/inventory/Inventory.csv";
	
	
	$SysDate = SysDate();
	$SysTime = SysTime();
	
	$counter_i = 0;
	//$counter_u = 0;
	$counter_t = 0;
	
	if (($getdata = fopen($filepath, "r")) !== FALSE) {
		
		// TRUNCATE
		$Qry_t = new Query();
		$Qry_t->table = "tbl_invnt_machines_auto_import";
		$rs_t = $Qry_t->exe_TRUNCATE($con);
		
		
		fgetcsv($getdata);
		//$vvv = array();
		//$vvv2 = array();
		while (($data = fgetcsv($getdata)) !== FALSE) {
			$fieldCount = count($data);
			for ($c=0; $c < $fieldCount; $c++){
				$columnData[$c] = $data[$c];
				$data_column = preg_replace('/\s+/', ' ', $columnData[$c]);
			/*if( $c==1 ){
					
					if($columnData[$c] == '- No Manufacturer -'){
						$data_column = 0;
					}
					
					$id_brand = 0;
					if(!empty($data_column)){//Select id brand.
						$Qry_brands = new Query();
						$Qry_brands->table = "tbl_brands";
						$Qry_brands->selected = "*";
						$Qry_brands->fields = "brand_name='".$data_column."'";
						$rs_brands = $Qry_brands->exe_SELECT($con);
						if(mysqli_num_rows($rs_brands) >= 1){
							while($row_brands=mysqli_fetch_array($rs_brands)){
								$id_brand = $row_brands['id'];
							}
						}
					}
					
					$columnData[$c] = $id_brand;
				}
				else if( $c==2 ){
										
					if($columnData[$c] == 0){
						
						if( $c==1 ){
					
							if($columnData[$c] == '- No Manufacturer -'){
								$data_column = 0;
							}
							
							$id_brand = 0;
							if(!empty($data_column)){
								$Qry_brands = new Query();
								$Qry_brands->table = "tbl_brands";
								$Qry_brands->selected = "*";
								$Qry_brands->fields = "brand_name='".$data_column."'";
								$rs_brands = $Qry_brands->exe_SELECT($con);
								if(mysqli_num_rows($rs_brands) >= 1){
									while($row_brands=mysqli_fetch_array($rs_brands)){
										$id_brand = $row_brands['id'];
									}
								}
							}
							
							//$columnData[$c] = $id_brand;
						}
						
						
						// $Qry_insert_model = new Query();
						// $Qry_insert_model->table = "tbl_model";
						// $Qry_insert_model->selected = "id_brand,
						// 							   model_name";
						// $Qry_insert_model->fields = "'".$id_brand."',
						// 							 '".$data_column."'";
						// $rs_insert_model = $Qry_insert_model->exe_INSERT($con);
						
						
					}
					
					$id_model = $data_column;
					if(!empty($data_column)){
						$Qry_model = new Query();
						$Qry_model->table = "tbl_model";
						$Qry_model->selected = "*";
						$Qry_model->fields = "model_name='".$data_column."'";
						$rs_model = $Qry_model->exe_SELECT($con);
						if(mysqli_num_rows($rs_model) >= 1){
							while($row_model=mysqli_fetch_array($rs_model)){
								$id_model = $row_model['id'];
								
							}
						}
					}
					$columnData[$c] = $id_model;
				}*/
				
			}
			
			// CONCAT white spaces
			$serialnumber = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[0]));
			$brand_name = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[1]));
			$model_name = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[2]));
			$location = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[3]));
			$date_entered = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[4]));
			
			
			// Checking for Duplicate data entries
			$filter_insert = 1;
			//$filter_update = 1;
			
			// $id_status = 0;
			// $id_branch = 2;
			// $id_condition = 1;
			
				
			$filter_truncate = 1;
			$counter_t++;
			
			
			// $Qry = new Query();
			// $Qry->table = "tbl_invnt_machines_auto_import";
			// $Qry->selected = "*";
			// $Qry->fields = "serialnumber='".$serialnumber."'";
			// $rs = $Qry->exe_SELECT($con);
			// //echo $company_name;
			// $count = mysqli_fetch_array($rs);			
			// if(count($count) == 0){		
		
				
				// INSERT 
				$Qry_i = new Query();
				$Qry_i->table = "tbl_invnt_machines_auto_import";
				$Qry_i->selected = "serialnumber,
									id_brand,
									model,
									location,
									date_entered";
				$Qry_i->fields = "'".$serialnumber."',
								  '".$brand_name."',
								  '".$model_name."',
								  '".$location."',
								  '".$date_entered."'";								
				$rs_i = $Qry_i->exe_INSERT($con);
				if($rs_i){
					$counter_i++;
					$filter_insert = 1;
				}else{
					$counter_i++;
					$filter_insert = 0;
				}
				
			// }
				
			
		}
			
		// Inserted output text
		if($filter_insert == 1){
			echo "*** AUTO IMPORT INVENTORY ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Row data inserted successfully.\r\n";
		}else{
			echo "*** AUTO IMPORT INVENTORY ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Error in inserted the data.\r\n";
		}
		
		
		// Updated output text
		/* if($filter_update == 1){
			echo $counter_u.' '."Row data updated successfully.\r\n";
			echo "**************************** END OF EXECUTION ****************************\r\n";
		}else{
			echo $counter_u.' '."Error in updated the data.\r\n";
			echo "**************************** END OF EXECUTION ****************************\r\n";
		} */
		
		// Truncate output text
		if($filter_truncate == 1){
			echo $counter_t.' '."Row data truncate successfully.\r\n";
			echo "**************************** END OF EXECUTION ****************************\r\n";
		}else{
			echo $counter_t.' '."Error in truncating the data.\r\n";
			echo "**************************** END OF EXECUTION ****************************\r\n";
		}
		
		

		fclose($getdata);	
		
	}
	
	
mysqli_close($con);		
	

class connector{
		
	public $host = "localhost";					
	public $dbname = "dbmif";			
	public $name = "root";						
	public $pass = "";
	function connect(){
		$conn = mysqli_connect("$this->host", "$this->name", "$this->pass","$this->dbname");
		if (!$conn)
		{
			die('Could not connect: ' . mysqli_connect_error());
		}
		return $conn;
	}
}	


class Query{
	
	public $table;
	public $fields;
	public $selected;
	
	
	/* --------------------------- SELECT QUERY -------------------------------------------- */
	function exe_SELECT($con){
		$quer_y = "SELECT ".$this->selected." FROM ".$this->table." WHERE ".$this->fields;
		return mysqli_query($con, $quer_y);
	}
	/* --------------------------- END of SELECT QUERY -------------------------------------------- */
	
	/* --------------------------- INSERT QUERY -------------------------------------------- */
	function exe_INSERT($con){
		$quer_y = "INSERT INTO ".$this->table." (".$this->selected.") VALUES (".$this->fields.")";
		return mysqli_query($con, $quer_y);
	}
	/* --------------------------- END of INSERT QUERY -------------------------------------------- */
	
	/* --------------------------- UPDATE QUERY -------------------------------------------- */
	function exe_UPDATE($con){
		$quer_y = "UPDATE ".$this->table." SET ".$this->selected." WHERE ".$this->fields;
		return mysqli_query($con, $quer_y);
	}
	/* --------------------------- END of UPDATE QUERY -------------------------------------------- */
	
	function exe_TRUNCATE($con){
		$quer_y = "TRUNCATE TABLE ".$this->table;
		return mysqli_query($con, $quer_y);
	}
	/* --------------------------- END of TRUNCATE QUERY -------------------------------------------- */
	
	/* --------------------------- DELETE QUERY -------------------------------------------- */
	function exe_DELETE($con){
		$quer_y = "DELETE FROM ".$this->table." WHERE ".$this->fields;
		return mysqli_query($con, $quer_y);
	}
	/* --------------------------- END of DELETE QUERY -------------------------------------------- */
}


function SysDate(){
	date_default_timezone_set('Asia/Manila');
	$info = getdate();
	$date = $info['mday'];
	$month = $info['mon'];
	$year = $info['year'];
	$dat_e = $year."-".$month."-".$date;
	$date_2 = date_create($dat_e);
	if(!empty($year) && !empty($month) && !empty($date)){
		return date_format($date_2,"Y-m-d");
	}else{
		return date_format($date_2,"Y-m-d");
	}
}

function SysTime(){

	date_default_timezone_set('Asia/Manila');
	$info = getdate();
	$hour = $info['hours'];
	$min = $info['minutes'];
	$sec = $info['seconds'];
	$time = $hour.":".$min.":00";
	if(!empty($hour) && !empty($min) && !empty($sec)){
		return $time;
	}else{
		return $time;
	}
}




?>