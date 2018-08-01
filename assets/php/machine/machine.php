<?php
/**
* 03/15/2017
*
* This file is contains Add/Update/View/Validate of Machine table.
*
*/ 

require_once '../database.php';
require_once '../utils.php';
require_once 'misc.php';

if(Utils::getIsset('action')){
$action     = Utils::getValue('action');
$id       	= Utils::getValue('idmachine');
$company_id = Utils::getValue('company_id');
$serialnum 	= Utils::getValue('serialnum');
$brand 		= Utils::getValue('brand');
$model 		= Utils::getValue('model');
$category 	= Utils::getValue('category');
$type 		= Utils::getValue('type');
$pagecount 	= Utils::getValue('pagecount');
$location 	= Utils::getValue('location');
$department = Utils::getValue('department');
$nouser 	= Utils::getValue('nouser');
$remarks 	= Utils::getValue('remarks');  
$dateinstalled= Utils::getValue('dateinstall'); 
$billing	= Utils::getValue('billing'); 
$branch   	= Utils::getValue('branch'); 
$unit_own   = Utils::getValue('unit_own'); 
$user_id    = Utils::getValue('user_id');
$date_now 	= Utils::getSysDate().' '.Utils::getSysTime();  

	$db = Database::getInstance();

	//For action check_exist validation.
	$new_serial   = Utils::getValue('txtSerialNum');
	$old_serial   = Utils::getValue('old_serial');
	$action_exist = Utils::getValue('action_exist');

	switch ($action) {
		case 'add':
				$db->insertQuery('tblmif','company_id,serialnumber,brand,model,category,type,page_count,location_area,department,no_of_user,remarks,date_installed,billing_type,branches,unit_owned_by,date_created,date_in',
												  '"'.$company_id.'",
												  "'.Utils::upperCase(trim($serialnum)).'",
												  "'.$brand.'",
												  "'.Utils::upperCase($model).'",
												  "'.Utils::upperCase($category).'",
												  "'.Utils::upperCase($type).'",
												  "'.$pagecount.'",
												  "'.Utils::upperCase($location).'",
												  "'.Utils::upperCase($department).'",
												  "'.$nouser.'",
												  "'.Utils::upperCase($remarks).'",
												  "'.$dateinstalled.'",
												  "'.Utils::upperCase($billing).'",
												  "'.$branch.'",
												  "'.Utils::upperCase($unit_own).'",
												  "'.$date_now.'",
												  "'.$date_now.'"');
				 $last_id   = $db->getLastId();
				 machineLogs($company_id,$last_id,$serialnum,$user_id,'CREATE',$db);//Insert machine logs.
				
				print Utils::jsonEncode($db->getFields());

			break;
		case 'update':
				if(getCompanyStatus($company_id,$db) == 1 ){//Check if company is blocked.
						$db->updateQuery('tblmif','company_id		= "'.$company_id.'",
												     brand 		 	= "'.$brand.'",
												     category 		= "'.Utils::upperCase($category).'",
												     type 		 	= "'.Utils::upperCase($type).'",	
												     page_count 	= "'.$pagecount.'",				     
												     model 		 	= "'.Utils::upperCase($model).'",
												     serialnumber 	= "'.Utils::upperCase(trim($serialnum)).'",
												     location_area 	= "'.Utils::upperCase($location).'",
												     department 	= "'.Utils::upperCase($department).'",
												     no_of_user 	= "'.$nouser.'",
												     remarks 		= "'.Utils::upperCase($remarks).'",
												     date_installed = "'.$dateinstalled.'",
												     billing_type 	= "'.Utils::upperCase($billing).'",
												     branches  		= "'.$branch.'",
												     unit_owned_by  = "'.Utils::upperCase($unit_own).'"'
												     ,'id = "'.$id.'"');
					    $res['aaData'][0]['status'] = 1; // Active
					    machineLogs($company_id,$id,$serialnum,$user_id,'UPDATE',$db);//Insert machine logs.

				  	}else{
				  		$res['aaData'][0]['status'] = 0; //Blocked
				  	}

					print Utils::jsonEncode($res);

			break;
		case 'view_id':
				$db->selectQuery('*','tblmif WHERE id = "'.$id.'" LIMIT 0,1');
				$res = $db->getFields();
				$data = array();

				foreach ($res['aaData'] as $key => $val) {
					$data['aaData'][] = array(
											'id' => $val['id'],
											// 'company_name' => getOnlyCompanyName($val['company_id'],$conn),
											'company_id' => $val['company_id'],
											'client_category' => $val['client_category'],
											// 'address' => $val['address'],
											'brand' => $val['brand'],
											'category' => $val['category'],
											'type' => $val['type'],
											'model' => $val['model'],
											'serialnumber' => $val['serialnumber'],
											'page_count' => $val['page_count'],
											'location_area' => $val['location_area'],
											'department' => $val['department'],
											'no_of_user' => $val['no_of_user'],
											'remarks' => $val['remarks'],
											'date_installed' => $val['date_installed'],
											'unit_owned_by' => $val['unit_owned_by'],
											'billing_type' => $val['billing_type'],
											'branches' => $val['branches']
					                     );
				}

			 	print Utils::jsonEncode($data);
			
			break;	
		case 'check_exist':
				$db->selectQuery('serialnumber','tblmif WHERE serialnumber ="'.$new_serial.'" LIMIT 0,1');
				if($db->getNumRows() > 0){
					if($action_exist == 'add'){
						   echo 'false';
					}
					else{
						if(strtolower($old_serial) == strtolower($new_serial)){
							echo 'true';
						}else{
							echo 'false';
						}
					}
				}
				else{
					echo 'true';
				}

			break;
		default:
			 throw new Exception($action." action doesn't exist.");
			break;
	}
}