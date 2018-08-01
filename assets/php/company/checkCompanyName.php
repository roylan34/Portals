<?php
/*
* This file check if Client name is already exist.
* 
*/

require_once '../database.php';
require_once '../utils.php';

$db = Database::getInstance();

//For action check_exist validation.
$new_client   = Utils::getValue('txtEditCompany');
$old_client   = Utils::getValue('old_client');
$action_validate = Utils::getValue('action_validate');

$db->selectQuery('company_name','tbl_company WHERE company_name ="'.$new_client.'" LIMIT 0,1');
if($db->getNumRows() > 0){
	if($action_validate == 'add'){
		   echo 'false';
		// echo "Company name is already exist.";
	}
	else{
		if(strtolower($old_client) == strtolower($new_client)){
			echo 'true';
		}else{
			echo 'false';
			// echo "Company name is already exist.";
		}
	}
}
else{
	echo 'true';
}