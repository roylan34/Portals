<?php
/**
* 07/26/2017
*
* This file is contains Add/Update/View of PM.
*
*/ 

require_once '../database.php';
require_once '../utils.php';


if(Utils::getIsset('action')){
	//For inputs
	$action     	= Utils::getValue('action');
	$serialnum 		= Utils::getValue('serialnum');
	$pmnumber 		= Utils::getValue('pmnumber');
	$pm_id  		= Utils::getValue('pm_id');
	$company_id  	= Utils::getValue('company_id');
	$manufacture  	= Utils::getValue('manufacture');
	$remarks  		= Utils::getValue('remarks');
	$page  			= Utils::getValue('page');
	$toner  	= Utils::getValue('toner');
	$time_in  	= Utils::getValue('time_in');
	$time_out  	= Utils::getValue('time_out');

	$date_entered = Utils::getSysDate();
	$time_entered = Utils::getSysTime();

	$db = Database::getInstance();
	$search ="";


	switch ($action) {
		case 'add':
				$db->customQuery('INSERT INTO tbl_pm_machines (pm_number, company_id, brand, model, serialnumber, location_area, no_of_user, date_installed, unit_owned, created_date )
								 SELECT "'.$pmnumber.'", company_id, brand, model, serialnumber, location_area, no_of_user, date_installed, unit_owned_by, NOW() FROM tblmif
								 WHERE company_id = '.$company_id.' AND serialnumber IN ("'.$serialnum.'")');
                print Utils::jsonEncode($db->getFields());
			break;
		case 'update':
					if($pm_id){

						$db->updateQuery('tbl_pm_machines','manufacture_date = "'.$manufacture.'", 
														remarks 	= "'.$remarks.'",
														page_count 	= "'.$page.'",
														toner_use	= "'.$toner.'",
														time_in  	= "'.$time_in.'",
														time_out 	= "'.$time_out.'"'
										    			,'id = "'.$pm_id.'"');
				 		$resPM = $db->getFields();
				 		if($resPM['aaData'][0] == 'success'){ //For development.
				 			$db->fields = null;

				 				//Update status.
								$is_done = checkIsDone($pmnumber, $db);
								if($is_done['aaData']['status'] == 'complete'){
									$db->updateQuery('tbl_pm_schedule','status = "complete"','pm_number = "'.$pmnumber.'"');
									//echo 'complete';
								}else if($is_done['aaData']['status'] == 'in-progress'){
									$db->updateQuery('tbl_pm_schedule','status = "in-progress"','pm_number = "'.$pmnumber.'"');
									//echo 'in-progress';
								}
								else{ exit; }
						 		
				 		}
				 		print Utils::jsonEncode($resPM);	
				 	}
			break;
		case 'view-id':
					$db->selectQuery("pm.pm_number, pm.id, pm.serialnumber, br.brand_name, pm.model, pm.manufacture_date, pm.remarks, pm.page_count, pm.toner_use, pm.time_in, pm.time_out"," tbl_pm_machines pm
									LEFT JOIN tbl_brands br ON pm.brand = br.id
									WHERE pm.id = ".$pm_id."");
					 print Utils::jsonEncode($db->getFields());
					
			break;
		case 'add-pm':
				$db->customQuery('INSERT INTO tbl_pm_machines (pm_number, company_id, brand, model, serialnumber, location_area, no_of_user, date_installed, unit_owned, created_date )
								 SELECT "'.$pmnumber.'", company_id, brand, model, serialnumber, location_area, no_of_user, IF(date_installed, date_installed, NULL) AS date_installed, unit_owned_by, NOW() FROM tblmif
								 WHERE company_id = '.$company_id.' AND serialnumber IN ("'.$serialnum.'")');
                print Utils::jsonEncode($db->getFields());
			break;		
		default:
			 throw new Exception($action." action doesn't exist.");
			break;
	}


}


function checkIsDone($pm_num, $db){
	$status = null;
	if(!Utils::isEmpty($pm_num)){
		$db->selectQuery("( CASE
			WHEN pm.pm_number = '".$pm_num."' && (SELECT COUNT(*) FROM tbl_pm_machines WHERE pm_number = '".$pm_num."' AND ((time_in IS NULL || time_out IS NULL) || (time_in = '0000-00-00 00:00:00' || time_out = '0000-00-00 00:00:00')) ) > 0 THEN 'in-progress'
			WHEN pm.pm_number = '".$pm_num."' && (SELECT COUNT(*) FROM tbl_pm_machines WHERE pm_number = '".$pm_num."' AND ((time_in IS NOT NULL && time_out IS NOT NULL) || (time_in != '0000-00-00 00:00:00' && time_out != '0000-00-00 00:00:00')) ) > 0 THEN 'complete'
			ELSE 'no-pm'
			END
			) AS status","tbl_pm_schedule ps
			LEFT JOIN tbl_pm_machines pm ON ps.pm_number = pm.pm_number
			WHERE ps.pm_number = '".$pm_num."' GROUP BY ps.pm_number");
		$status = $db->getFields();

		if($status['aaData'][0]['status'] == 'complete'){ 
			$status = array('aaData' => array(
				'status' => $status['aaData'][0]['status'],
				'result' =>  'true',
				'message' => 'PM Done see at Archived.'
			));
		}
		else if($status['aaData'][0]['status'] == 'in-progress'){ 
			$status = array('aaData' => array(
				'status' => $status['aaData'][0]['status'],
				'result' =>  'false',
				'message' => 'PM in-progress.'
			));
		}
		else{
			$status = array('aaData' => array(
				'status' => $status['aaData'][0]['status'],
				'result' =>  'false',
				'message' => "No machines added in PM."
			));
		}
	}
	return $status;
}