<?php
/**
* 01/25/2017
*
* This file contains the json data format of login.
*
*/

require_once 'database.php';
require_once 'utils.php';

if(Utils::getIsset('username') || Utils::getIsset('password')){

	$username = Utils::getValue('username');
	$password = Utils::getValue('password');
	$db = Database::getInstance();

	if($username && $password){
		$db->selectQuery('a.id, a.username,a.password,a.firstname,a.middlename,a.lastname,a.location,a.branches,app.app_mif, app.app_inventory, app.app_mrf, app.app_pm,
								(SELECT CONVERT(GROUP_CONCAT(id SEPARATOR ",") USING "utf8") FROM tbl_company WHERE id_client_mngr = ca.id) AS company, 
								a.accountrole, a.status,a.created_at,a.updated AS updated_at,"" AS position,"" AS is_client_user, a.branches_mrf, a.account_type, acct.acc_mrf_flags, a.email, a.branch_pm,
								tap.app_mif As action_mif, tap.app_invnt As action_invnt, tap.app_mrf As action_mrf, tap.app_pm As action_pm, acct.acc_mif_flags',
			                   'tbl_accounts a 
			                    LEFT JOIN tbl_app_module app ON a.id = app.account_id 
			                    LEFT JOIN tbl_account_type acct ON a.account_type = acct.id
			                    LEFT JOIN tbl_app_action tap ON tap.id_account = a.id
			                    LEFT JOIN tbl_client_accounts ca ON a.id = ca.account_id
			                    WHERE a.username = "'.$db->escapeString($username).'" && a.password = "'.Utils::encrypt($password).'"');
		$result = $db->getFields();
		
		if(count($result['aaData']) == 0){
			 print Utils::jsonEncode($data = array('aaData' => array('status' => 'empty')));
		}
		else 
		{
			if($result['aaData'][0]['status'] == 1){
				print Utils::jsonEncode($result);
			}else {
				print Utils::jsonEncode($data = array('aaData' => array('status' => 'inactive')));
			}
		}

	} 
	else 
	{ print Utils::jsonEncode($data = array('aaData' => array('status' => 'empty'))); }

}