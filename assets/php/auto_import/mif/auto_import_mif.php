<?php

$conn = new connector();
$con = $conn->connect();
	
	//$filepath = "C:/wamp/www/mif/assets/php/auto_import/mif/files/SAP_MIF_Portal.csv";
	
	$filepath = "C:/SAP FILES/mif/SAP_MIF_Portal.csv";
	
	$SysDate = SysDate();
	$SysTime = SysTime();
	
	$counter_i = 0;
	$counter_u = 0;
	
	if (($getdata = fopen($filepath, "r")) !== FALSE) {
			
		fgetcsv($getdata);  
		//$vvv = array();
		//$vvv2 = array();
		while (($data = fgetcsv($getdata)) !== FALSE) {
			$fieldCount = count($data);
			for ($c=0; $c < $fieldCount; $c++) {
				$columnData[$c] = $data[$c];			
				$data_column = preg_replace('/\s+/', ' ', $columnData[$c]);
				if( $c==6 ){
					$id_am = 0;
					if(!empty($data_column)){
						$Qry_am = new Query();
						$Qry_am->table = "tbl_client_accounts";
						$Qry_am->selected = "*";
						$Qry_am->fields="CONCAT(lastname,' ',firstname) = '".$data_column."' ";
						$rs_am = $Qry_am->exe_SELECT($con);
						if(mysqli_num_rows($rs_am) >= 1){									
							while($row_am=mysqli_fetch_array($rs_am)){
								$id_am = $row_am['id'];
							}		
						}
					}	

					//array_push( $vvv[$columnData[$c]] ,$columnData[$c] );	
					$columnData[$c] = $id_am;
					
				}else if( $c==4 ){
					
					if($columnData[$c] == 'MANILA'){
						$data_column = 'MNL';
					}				
					
					$id_loc = 0;
					if(!empty($data_column)){
						$Qry_loc = new Query();
						$Qry_loc->table = "tbl_location";
						$Qry_loc->selected = "*";
						$Qry_loc->fields="branch_name = '".$data_column."' ";
						$rs_loc = $Qry_loc->exe_SELECT($con);
						if(mysqli_num_rows($rs_loc) >= 1){									
							while($row_loc=mysqli_fetch_array($rs_loc)){
								$id_loc = $row_loc['id'];
							}		
						}
					}

					//array_push( $vvv[$columnData[$c]] ,$columnData[$c] );	
					$columnData[$c] = $id_loc;
				}	
	
				//$columnData[$c] = preg_replace('/\s+/', '', $columnData[$c]);		
				
			}	
			
			// CONCAT white spaces
			$sap_code = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[0]));
			$company_name = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[1]));
			$client_category = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[2]));
			$address = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[3]));
			$location = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[4]));
			$contact_no = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[5]));
			$account_manager = preg_replace('/\s+/', ' ', str_replace("'", "",$columnData[6]));	

		
			//$import_data[]="('".$option_name."','".$option_value."')";
			
			//echo $columnData[$c];
			
			// Checking for Duplicate data entries
			$filter_insert = 1;
			$filter_update = 1;
			
			$Qry = new Query();
			$Qry->table = "tbl_company_auto_import";
			$Qry->selected = "*";
			$Qry->fields = "sap_code='".$sap_code."' AND company_name='".$company_name."'";
			$rs = $Qry->exe_SELECT($con);
			//echo $company_name;
			$count = mysqli_fetch_array($rs);			
			if(count($count) == 0){		
			//$count = mysqli_fetch_array($rs);
				// INSERT 
				$Qry_i = new Query();
				$Qry_i->table = "tbl_company_auto_import";
				$Qry_i->selected = "sap_code,
									company_name,
									client_category,
									address,
									branches,
									contact_no,
									id_client_mngr,
									status";
				$Qry_i->fields = "'".$sap_code."',
								  '".$company_name."',
								  '".$client_category."',
								  '".$address."',
								  '".$location."',
								  '".$contact_no."',
								  '".$account_manager."',
								  '1'";	
				$rs_i = $Qry_i->exe_INSERT($con);
				if($rs_i){
					$counter_i++;
					$filter_insert = 1;
				}else{
					$counter_i++;
					$filter_insert = 0;
				}
				
			}else{
				
				// UPDATE
				$Qry_u = new Query();
				$Qry_u->table = "tbl_company_auto_import";
				$Qry_u->selected = "client_category='".$client_category."',
									address='".$address."',
									contact_no='".$contact_no."',
									id_client_mngr='".$account_manager."'";
				$Qry_u->fields = "sap_code='".$sap_code."' AND company_name='".$company_name."'";
				$rs_u = $Qry_u->exe_UPDATE($con);
				if($rs_u){
					$counter_u++;
					$filter_update = 1;
				}else{
					$counter_u++;
					$filter_update = 0;
				}
				
			}		
			
		}
		
		// Inserted output text
		if($filter_insert == 1){
			echo "*** AUTO IMPORT MIF ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Row data inserted successfully.\r\n";
		}else{
			echo "*** AUTO IMPORT MIF ROW DATA TO MYSQL DATABASE ***\r\n";
			echo "DATE:".' '.$SysDate.' '."TIME:".' '.$SysTime."\r\n";
			echo $counter_i.' '."Error in inserted the data.\r\n";
		}
		
		
		// Updated output text
		if($filter_update == 1){
			echo $counter_u.' '."Row data updated successfully.\r\n";
			echo "*********************** END OF EXECUTION ***********************\r\n";
		}else{
			echo $counter_u.' '."Error in updated the data.\r\n";
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