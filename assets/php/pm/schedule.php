<?php
/**
* 07/26/2017
*
* This file is contains Add/Update/View of Schedule.
*
*/ 

require_once '../database.php';
require_once '../utils.php';



if(Utils::getIsset('action')){
	//For inputs
	$action     	= Utils::getValue('action');
	$id_sched 		= Utils::getValue('id_pm');
	$pmnumber 		= Utils::getValue('pmnumber');
	$company  		= Utils::getValue('company');
	$sched_date  	= Utils::getValue('sched_date');
	$technician 	= Utils::getValue('technician');
	$contact_name  	= Utils::getValue('contact_name');
	$contact_no 	= Utils::getValue('contact_no');
	$email  		= Utils::getValue('email');
	$department  	= Utils::getValue('department');
	$branch  		= Utils::getValue('branch');
	$user_id  		= Utils::getValue('user_id');
	$date_entered = Utils::getSysDate();
	$time_entered = Utils::getSysTime();

	$db = Database::getInstance();
	$search ="";


	switch ($action) {
		case 'add':
		        $add_pm_no = generatePmNo($db);
				$db->fields = null;

				$db->insertQuery('tbl_pm_schedule','pm_number, company_id, schedule_date, technician, date_entered, time_entered, contact_name, contact_number, email_address,
													department, created_by, branch  ',
												'"'.$add_pm_no.'",
												"'.$company.'",
												"'.$sched_date.'",
												"'.$technician.'",
												"'.$date_entered.'",
												"'.$time_entered.'",
												"'.$contact_name.'",
												"'.$contact_no.'",
												"'.$email.'",
												"'.$department.'",
												"'.$user_id.'",
												"'.$branch.'"');
                  		print Utils::jsonEncode($db->getFields());
			break;
		case 'edit':
					if($id_sched){
						$db->updateQuery('tbl_pm_schedule','company_id = "'.$company.'", 
														schedule_date = "'.$sched_date.'",
														technician 	 = "'.$technician.'",
														contact_name = "'.$contact_name.'",
														contact_number  = "'.$contact_no.'",
														email_address = "'.$email.'",
														department = "'.$department.'"'
										    			,'id = "'.$id_sched.'"');
				 		print Utils::jsonEncode($db->getFields());
				 	}
			break;
		case 'view-id':
					$db->selectQuery("id, pm_number, company_id, schedule_date, technician, CONCAT(date_entered,' ', time_entered) AS date_entered,
									  contact_name, contact_number, email_address, department"," tbl_pm_schedule
									WHERE id = ".$id_sched."");
					 print Utils::jsonEncode($db->getFields());
					
			break;	
		case 'update_cancel':
					if($id_sched){
						$is_cancel = checkIsCancel($pmnumber, $db);
						if($is_cancel['aaData']['result'] == 'true'){
							$db->updateQuery('tbl_pm_schedule','status = "cancel"','id = "'.$id_sched.'"');
						}

				 		print Utils::jsonEncode($is_cancel);	
				 	}
			break;
		case 'update_close':
					if($id_sched){
						$is_done = checkIsDone($pmnumber, $db);
						if($is_done['aaData']['result'] == 'true'){
							$db->updateQuery('tbl_pm_schedule','status = "close"','id = "'.$id_sched.'"');
						}

				 		print Utils::jsonEncode($is_done);	
				 	}
			break;		
		default:
			 throw new Exception($action." action doesn't exist.");
			break;
	}


}

function generatePmNo($db){
	$db->selectQuery('*','tbl_pm_schedule');
	$res = intval($db->getNumRows()) + 1;

	date_default_timezone_set('Asia/Manila');
	$info = getdate();
	$date = $info['mday'];
	$month = $info['mon'];
	$year = $info['year'];

	return 'PM'.$year.$date.$month.'-'.$res;
}


function checkIsCancel($pm_num,$db){
	$res = null;
	if(!Utils::isEmpty($pm_num)){
		$db->selectQuery("COUNT(*) AS total_pending ","tbl_pm_machines  
			WHERE pm_number = '".$pm_num."'");
		$res = $db->getFields();

		if($res['aaData'][0]['total_pending'] == 0){ //If 0 = no pending.
			$res = array('aaData' => array(
				'result' =>  'true',
				'message' => 'Request has been successfully cancelled see at Archived.'		
			));
		}else{
			$res = array('aaData' => array(
				'result' =>  'false',
				'message' => "Unable to cancel request because already in-progress."
			));
		}
	}
	return $res;

}

function checkIsDone($pm_num, $db){
	$status = null;
	if(!Utils::isEmpty($pm_num)){
		$db->selectQuery("( CASE
			WHEN pm.pm_number = '".$pm_num."' && (SELECT COUNT(*) FROM tbl_pm_machines WHERE is_delete = 'no' AND pm_number = '".$pm_num."' AND (time_in IS NULL || time_out IS NULL) ) > 0 THEN 'in-progress'
			WHEN pm.pm_number = '".$pm_num."' && (SELECT COUNT(*) FROM tbl_pm_machines WHERE is_delete = 'no' AND pm_number = '".$pm_num."' AND (time_in IS NOT NULL && time_out IS NOT NULL) ) > 0 THEN 'done'
			ELSE 'no-pm'
			END
			) AS status","tbl_pm_schedule ps
			LEFT JOIN tbl_pm_machines pm ON ps.pm_number = pm.pm_number
			WHERE ps.pm_number = '".$pm_num."' GROUP BY ps.pm_number");
		$status = $db->getFields();

		if($status['aaData'][0]['status'] == 'done'){ 
			$status = array('aaData' => array(
				'status' => $status['aaData'][0]['status'],
				'result' =>  'true',
				'message' => 'PM Close see at Archived.'
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