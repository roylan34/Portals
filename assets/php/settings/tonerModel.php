<?php
/**
* 03/15/2017
*
* This file is contains Add/Update/View/Validate of Toner table.
*
*/ 

require_once '../database.php';
require_once '../utils.php';



if(Utils::getIsset('action')){
	$action     = Utils::getValue('action');
	$tonerid    = Utils::getValue('tonerid');
	$toner  	= Utils::getValue('toner');
	$model 		= Utils::getValue('model');
	$old_model 	= Utils::getValue('old_model');
	$type 		= Utils::getValue('type');
	$date_created = Utils::getSysDate().' '.Utils::getSysTime();  
	$db         = Database::getInstance();

	//For action check_exist validation.
	$new_toner 	     = Utils::getValue('txtSettingsToner');
	$old_toner 	 	 = Utils::getValue('old_toner');
	$action_validate = Utils::getValue('action_validate');

	$selected_model = (!empty($model) ? explode(",",$model) : array());
	$old_model_exp = (!empty($old_model) ? explode(",",$old_model) : array());

	switch ($action) {
		case 'add':
				//For development.
				$db->insertQuery('tbl_toner','toner_code,type,created_at','"'.Utils::upperCase($toner).'", "'.$type.'","'.$date_created.'"');
				$last_id = $db->getLastId();

				if(count($selected_model) > 0){
					foreach($selected_model AS $key => $models){
				        	$db->insertQuery('tbl_toner_model','model, toner_id, created_at',
													  '"'.trim($models).'",
													  "'.$last_id.'",
													  "'.$date_created.'"');
				    }
				}
				print Utils::jsonEncode($db->getFields());

			break;
		case 'update':
				$db->updateQuery('tbl_toner','toner_code = "'.$toner.'", type = "'.$type.'"','id ="'.$tonerid.'"');

				//Adding/Deleting Company branch
				if(count($selected_model) >= count($old_model_exp)){
				    foreach($selected_model AS $key => $val_selected){
				        if(!in_array($val_selected, $old_model_exp)){
				        	$db->insertQuery('tbl_toner_model','toner_id, model, created_at',
													  '"'.$tonerid.'",
													  "'.trim($val_selected).'",
													  "'.$date_created.'"');
				       }
				    }
				}else{
				      foreach($selected_model AS $key => $val_selected){
				        if(!in_array($val_selected, $old_model_exp)){
				        	$db->insertQuery('tbl_toner_model','toner_id, model, created_at',
													  '"'.$tonerid.'",
													  "'.trim($val_selected).'",
													  "'.$date_created.'"');
				       }
				    }
				}

				if(count($old_model_exp) <= count($selected_model)){
				    foreach($old_model_exp AS $key => $val_selected){
				        if(!in_array($val_selected, $selected_model)){
				        	$db->deleteQuery('tbl_toner_model','toner_id ="'.$tonerid.'" AND model = "'.$val_selected.'"');//Delete the record 
				       }
				    }
				}else{
				    foreach($old_model_exp AS $key => $val_selected){
				        if(!in_array($val_selected, $selected_model)){
				        	$db->deleteQuery('tbl_toner_model','toner_id ="'.$tonerid.'" AND model= "'.$val_selected.'"');//Delete the record 
				       }
				    }
				}
			 	print Utils::jsonEncode($db->getFields());

			break;
		case 'view-id':
				$db->selectQuery('t.id,t.toner_code, t.type, GROUP_CONCAT(tm.model SEPARATOR ",") as model','tbl_toner t LEFT JOIN tbl_toner_model tm ON t.id = tm.toner_id WHERE t.id ="'.$toner.'" GROUP BY t.id');
				print Utils::jsonEncode($db->getFields());
			
			break;	
		case 'view-all':
				$db->selectQuery('t.id,t.toner_code, t.type, GROUP_CONCAT(tm.model SEPARATOR "<br>") as model','tbl_toner t LEFT JOIN tbl_toner_model tm ON t.id = tm.toner_id GROUP BY t.id ORDER BY id'); //Group by Toner code
				print Utils::jsonEncode($db->getFields());
			
			break;
		case 'check_exist':
				$db->selectQuery('*','tbl_toner WHERE toner_code ="'.$new_toner.'"');
				if($db->getNumRows() > 0){
					if($action_validate == "add"){
						echo json_encode(array("<strong>Toner name is already exist.</strong>"));
					}
					else{
						if(strtolower($old_toner) == strtolower($new_toner)){
							echo "true";
						}else{
							echo json_encode(array("<strong>Toner name is already exist.</strong>"));
						}
					}
				}
				else{
					echo "true";
				}

			break;
		case 'view-model':
				$db->selectQuery('DISTINCT model','tblmif ORDER BY model'); //Group by Toner code
				print Utils::jsonEncode($db->getFields());
		break;
		default:
			 throw new Exception($action." action doesn't exist.");
			break;
	}


}

