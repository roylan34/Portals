<?php

$conn = new connector();
$con = $conn->connect();
	
	//$filepath = "C:/wamp/www/mif/assets/php/auto_import/account_manager/files/AcctManager.csv";
	
	$filepath = "C:/SAP FILES/account_manager/AcctManager.csv";
	
	$SysDate = SysDate();
	$SysTime = SysTime();
	
	$datetime = $SysDate.' '.$SysTime;
	
	// Counter variable in insert
	$counter_i_act = 0;
	$counter_i_cact = 0;
	
	// Counter variable in update
	$counter_u_act = 0;
	$counter_u_cact = 0;
	
	
	if (($getdata = fopen($filepath, "r")) !== FALSE) {
			
		fgetcsv($getdata);  
		//$vvv = array();
		//$vvv2 = array();
		while (($data = fgetcsv($getdata)) !== FALSE) {
			$fieldCount = count($data);
			for ($c=0; $c < $fieldCount; $c++) {
				$columnData[$c] = $data[$c];			
				$data_column = preg_replace('/\s+/', ' ', $columnData[$c]);		
				
				
			}	
			
			// CONCAT white spaces
			$code = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[0]));
			$lastname = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[1]));
			$firstname = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[2]));
			$email = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[3]));
			

			
		
			//$import_data[]="('".$option_name."','".$option_value."')";
			
			//echo $columnData[$c];
			
			// Filtering in insert
			$filter_insert_act = 1;
			$filter_insert_cact = 1;
			
			// Filtering in update
			$filter_update_act = 1;
			$filter_update_cact = 1;
			
			
			$Qry = new Query();
			$Qry->table = "tbl_accounts";
			$Qry->selected = "*";
			$Qry->fields = "firstname='".ucfirst($firstname)."' AND lastname='".ucfirst($lastname)."'";
			$rs = $Qry->exe_SELECT($con);
			//echo $company_name;
			$count = mysqli_fetch_array($rs);			
			if(count($count) == 0){		
			
				//$count = mysqli_fetch_array($rs);
			
				$username = strtolower(ucfirst($firstname).'.'.ucfirst($lastname));
				$password = encrypt('20.dbic.18');
				

				// INSERT in tbl_accounts
				$Qry_act = new Query();
				$Qry_act->table = "tbl_accounts";
				$Qry_act->selected = "username,
									password,
									firstname,
									lastname,
									email,
									accountrole,
									account_type,
									status,
									created_at";
				$Qry_act->fields = "'".$username."',
								  '".$password."',
								  '".ucfirst($firstname)."',
								  '".ucfirst($lastname)."',
								  '".$email."',
								  'User',
								  '2',
								  '1',
								  '".$datetime."'";	
				$rs_act = $Qry_act->exe_INSERT($con);
				if($rs_act){
					
					$counter_i_act++;
					$filter_insert_act = 1;
					
					
					// INSERT in tbl_client_accounts
					$lastId = mysqli_insert_id($con);
					
					$Qry_cact = new Query();
					$Qry_cact->table = "tbl_client_accounts";
					$Qry_cact->selected = "account_id,
										   username,
										   firstname,
										   lastname,
										   status,
										   created_at";
					$Qry_cact->fields = "'".$lastId."',
										 '".$username."',
										 '".ucfirst($firstname)."',
										 '".ucfirst($lastname)."',
										 '1',
										 '".$datetime."'";
					$rs_cact = $Qry_cact->exe_INSERT($con);
					if($rs_cact){
						
						$counter_i_cact++;
						$filter_insert_cact = 1;
						
					}else{
						
						$counter_i_cact++;
						$filter_insert_cact = 0;
						
					}
					
					
				}else{
					$counter_i_act++;
					$filter_insert_act = 0;
				}
				
			}
			
		}
		
		// Inserted output text
		if($filter_insert_act == 1 && $filter_insert_cact == 1){
			echo "*** AUTO IMPORT ACCOUNT MANAGER ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i_act.' '."tbl_accounts Row data inserted successfully.\r\n";
			echo $counter_i_cact.' '."tbl_client_accounts Row data inserted successfully.\r\n";
		}else{
			echo "*** AUTO IMPORT ACCOUNT MANAGER ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i_act.' '."tbl_accounts Error in inserting the data.\r\n";
			echo $counter_i_cact.' '."tbl_client_accounts Error in inserting the data.\r\n";
		}
		
		
		// Updated output text
		if($filter_update_act == 1 && $filter_update_cact == 1){
			echo $counter_u_act.' '."tbl_accounts Row data updated successfully.\r\n";
			echo $counter_u_cact.' '."tbl_client_accounts Row data updated successfully.\r\n";
			echo "*********************** END OF EXECUTION ***********************\r\n";
		}else{
			echo $counter_u_act.' '."tbl_accounts Error in updated the data.\r\n";
			echo $counter_u_cact.' '."tbl_client_accounts Error in updated the data.\r\n";
			echo "*********************** END OF EXECUTION ***********************\r\n";
		}
		

		fclose($getdata);
	}
	
mysqli_close($con);		


	
class connector{
		
	public $host = "localhost";					
	public $dbname = "dbmif";			
	public $name = "root";						
	public $pass = "waterfront07";
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


function encrypt($text){ 

	$crypt_key = "@gTSqK82GADBp.1";
	return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $crypt_key, $text, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)))); 

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