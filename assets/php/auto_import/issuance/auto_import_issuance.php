<?php

$conn = new connector();
$con = $conn->connect();

	//$filepath = "C:/wamp/www/mif/assets/php/auto_import/issuance/files/Issuance.csv";
	
	$filepath = "C:/SAP FILES/issuance/Issuance.csv";
	
	$SysDate = SysDate();
	$SysTime = SysTime();
	
	$counter_i = 0;
	$counter_u = 0;
	
	if(file_exists($filepath) && ($getdata = fopen($filepath, "r")) !== FALSE ) {
		
		fgetcsv($getdata);
		//$vvv = array();
		//$vvv2 = array();
		while (($data = fgetcsv($getdata)) !== FALSE) {
			$fieldCount = count($data);
			for ($c=0; $c < $fieldCount; $c++){
				$columnData[$c] = $data[$c];
				$data_column = preg_replace('/\s+/', ' ', $columnData[$c]);
			}
			
			// CONCAT white spaces
			$sap_code = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[0]));
			$company_name = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[1]));
			$ref_no = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[2]));
			$doc_date = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[3]));
			$item_code = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[5]));
			$brand = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[6]));
			$description = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[7]));
			$serial_number = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[8]));
			$transtype = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[9]));
			
			
			// Checking for Duplicate data entries
			$filter_insert = 1;
			// $filter_update = 1;
			
			// $Qry = new Query();
			// $Qry->table = "tbl_invnt_issuances_auto_import";
			// $Qry->selected = "*";
			// $Qry->fields = "serial='".$serial_number."'";
			// $rs = $Qry->exe_SELECT($con);
			// //echo $company_name;
			// $count = mysqli_fetch_array($rs);			
			// if(count($count) == 0){		
			//$count = mysqli_fetch_array($rs);
				// INSERT 			
				$Qry_i = new Query();
				$Qry_i->table = "tbl_invnt_issuances_auto_import";
				$Qry_i->selected = "sap_code,
									company_name,
									ref_no,
									doc_date,
									item_code,
									brand,
									description,
									serial,
									trans_type";
				$Qry_i->fields = "'".$sap_code."',
								  '".$company_name."',
								  '".$ref_no."',
								  '".$doc_date."',
								  '".$item_code."',
								  '".$brand."',
								  '".$description."',
								  '".$serial_number."',
								  '".$transtype."'";								
				$rs_i = $Qry_i->exe_INSERT($con);
				if($rs_i){
					$counter_i++;

					$filter_insert = 1;
				}else{
					$counter_i++;
					$filter_insert = 0;
				}
				
			// }else{
				
			// 	// UPDATE
			// 	$Qry_u = new Query();
			// 	$Qry_u->table = "tbl_invnt_issuances_auto_import";
			// 	$Qry_u->selected = "sap_code='".$sap_code."',
			// 						company_name='".$company_name."',
			// 						ref_no='".$ref_no."',
			// 						doc_date='".$doc_date."',
			// 						item_code='".$item_code."',
			// 						description='".$description."',
			// 						trans_type='".$transtype."'";								
			// 	$Qry_u->fields = "serial='".$serial_number."'";
			// 	$rs_u = $Qry_u->exe_UPDATE($con);
			// 	if($rs_u){
			// 		$counter_u++;
			// 		$filter_update = 1;
			// 	}else{
			// 		$counter_u++;
			// 		$filter_update = 0;
			// 	}
				
			// }		
		}
			
		// Inserted output text
		if($filter_insert == 1){
			echo "*** AUTO IMPORT ISSUANCE ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Row data inserted successfully.\r\n";
		}else{
			echo "*** AUTO IMPORT ISSUANCE ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Error in inserted the data.\r\n";
		}
		
		
		// // Updated output text
		// if($filter_update == 1){
		// 	echo $counter_u.' '."Row data updated successfully.\r\n";
		// 	echo "**************************** END OF EXECUTION ****************************\r\n";
		// }else{
		// 	echo $counter_u.' '."Error in updated the data.\r\n";
		// 	echo "**************************** END OF EXECUTION ****************************\r\n";
		// }
		

		fclose($getdata);	
		
	}else{
		
		echo "** AUTO IMPORT ISSUANCE ROW DATA TO MYSQL DATABASE **\r\n";
		echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
		echo "No file because it was deleted.\r\n";
		echo "*************************** END OF EXECUTION ***************************\r\n";
		
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