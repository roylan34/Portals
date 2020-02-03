<?php
/**
* 07/26/2017
*
* This file is contains Add/Update/View/Validate of Current/Archive Inventory table.
*
*/ 

require_once '../database.php';
require_once '../utils.php';
require_once 'misc.php';



if(Utils::getIsset('action')){
	//For inputs
	$action     = Utils::getValue('action');
	$id_reserve = Utils::getValue('id_reserve');
	$serialnum  = Utils::getValue('serialnum');
	$acct_mgnr  = Utils::getValue('acct_mgnr');
	$comp 	 		= Utils::getValue('comp');
	$date_reserved 	= Utils::getValue('date_reserved');
	$create_by 		= Utils::getValue('create_by');
	$status 		= Utils::getValue('status');
	$branch 		= Utils::getValue('branch');
	$date_entered = Utils::getSysDate().' '.Utils::getSysTime();

	$db         = Database::getInstance();

	switch ($action) {
		case 'add':
	          	$arr_serialnum 	 = explode(',',Utils::uppercase($serialnum));
		        $is_duplicate_sn = Utils::chckDuplicateArrayVal($arr_serialnum);
                $reserved_sn 	 = Utils::chckDuplicateArrayVal(checkSnReserved($arr_serialnum, $db, 'add'));
                $db->fields = null;
		        if(count($is_duplicate_sn) > 0){ //Count if has value mean has duplicate SN.
		          	$data['aaData'][] = "Duplicate S/N: <em>" . implode(',',$is_duplicate_sn)."</em>";
		        }
		        else if(count($reserved_sn) > 0){
		        	$data['aaData'][] = "Already reserved S/N: <em>" . implode(',',$reserved_sn)."</em>";
		        }
		        else{
					$db->insertMultipleByUniqueQuery('tbl_invnt_reservation','serial_number, id_acc_mngr, id_company, date_reserved, id_created_by, branch, created_at', $arr_serialnum,
								   '"'.$acct_mgnr.'",
								  "'.$comp.'",
								  "'.$date_reserved.'",
								  "'.$create_by.'", 
								  "'.$branch.'", 
								  NOW()');
					$data = $db->getFields();
				}
                  	print Utils::jsonEncode($data);
			break;
		case 'update':
					if($id_reserve){
						$sn = Utils::uppercase($serialnum);
						$reserved_sn = checkSnReserved($sn, $db, 'update');

						if(count($reserved_sn) > 0){
							$data['aaData'][] = "Already reserved S/N: <em>" . implode(',',$reserved_sn)."</em>";
						}
						else{
							$db->updateQuery('tbl_invnt_reservation','serial_number = "'.$sn.'", 
															id_acc_mngr 	= "'.$acct_mgnr.'",
															id_company 	 	= "'.$comp.'",
															date_reserved 	= "'.$date_reserved.'",
															branch 			= "'.$branch.'"'
											    			,'id = "'.$id_reserve.'"');
							$data = $db->getFields();
					 	}

					 	print Utils::jsonEncode($data);
				 	}
			break;
		case 'update_status':
					if($id_reserve){
						$db->updateQuery('tbl_invnt_reservation','status = "'.Utils::uppercase($status).'"','id = "'.$id_reserve.'"');
				 		print Utils::jsonEncode($db->getFields());
				 	}
			break;
		case 'view-id':
					$db->selectQuery("*","tbl_invnt_reservation WHERE id = ".$id_reserve."");
					 print Utils::jsonEncode($db->getFields());
					
			break;	
		default:
			 throw new Exception($action." action doesn't exist.");
			break;
	}


}

function checkSnReserved($sn, $db, $action){

	switch ($action) {
		case 'add':
				$db->selectQuery("serial_number","tbl_invnt_reservation WHERE (status = 'RESERVED' || status = 'CLOSE') AND serial_number IN ('".implode("','",$sn)."')");
				$res_sn = $db->getFields();
				if($db->getNumRows() > 0){
					 return array_map(function($val){
								return $val['serial_number'];
							}, $res_sn['aaData']); //Return as single dimension array.
				}
				else{
					return array();
				}
			
			break;
		case 'update':
				$sn_old = Utils::getValue('sn_old');

				if($sn_old != $sn){
					$db->selectQuery("serial_number","tbl_invnt_reservation WHERE (status = 'RESERVED' || status = 'CLOSE') AND serial_number ='".$sn."' LIMIT 1");
					$res_sn = $db->getFields();
					if($db->getNumRows() > 0){
						return $res_sn['aaData'][0];
					}
					else{
						return array();
					}
				}
				else{
					return array();
				}


			break;
		default:
			throw new Exception("Action type not found.");
			
			break;
	}


}

