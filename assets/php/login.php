<?php
/**
* 01/25/2017
*
* This file contains the json data format of login.
*
*/

require_once 'database.php';
require_once 'utils.php';
require_once 'jwt.php';

if(Utils::getIsset('username') || Utils::getIsset('password')){

	$username = Utils::getValue('username');
	$password = Utils::getValue('password');
	$db = Database::getInstance();

	if($username && $password){
		$db->selectQuery('a.id AS user_id,CONCAT(a.firstname," ",a.lastname) AS fullname, a.location, a.branches AS branch, app.app_mif, app.app_inventory, app.app_mrf, app.app_pm, app.app_reports,
								(SELECT CONVERT(GROUP_CONCAT(id SEPARATOR ",") USING "utf8") FROM tbl_company WHERE id_client_mngr = ca.id) AS companies, 
								a.accountrole AS user_role, a.status, a.branches_mrf AS branch_mrf, a.account_type AS user_type, a.mrf_type AS user_mrf_flag, a.email, a.branch_pm,
								tap.app_mif As action_mif, tap.app_invnt As action_invnt, tap.app_mrf As action_mrf, tap.app_pm As action_pm, tap.app_reports As action_reports, acct.acc_mif_flags AS user_mif_flag, a.pm_type',
			                   'tbl_accounts a 
			                    LEFT JOIN tbl_app_module app ON a.id = app.account_id 
			                    LEFT JOIN tbl_account_type acct ON a.account_type = acct.id
			                    LEFT JOIN tbl_app_action tap ON tap.id_account = a.id
			                    LEFT JOIN sap_db.tbl_client_accounts ca ON a.id = ca.account_id
			                    WHERE a.username = "'.$db->escapeString($username).'" && a.password = "'.Utils::encrypt($password).'"');
		$result = $db->getFields();
		
		if(count($result['aaData']) == 0){
			 print Utils::jsonEncode($data = array('aaData' => array('status' => 'empty')));
		}
		else 
		{
			if($result['aaData'][0]['status'] == 1){
				//session_start();

				$res = $result['aaData'][0];
				$data = array(
					'aaData' => array(
						'user_id' 	=>	$res['user_id'],
						'fullname' 	=>	$res['fullname'],
						'location' 	=>	$res['location'],
						'app_module' 	=> array('app_mif' => $res['app_mif'], 'app_invnt' => $res['app_inventory'], 'app_mrf' => $res['app_mrf'], 'app_pm' => $res['app_pm'], 'app_reports' => $res['app_reports'] ),
						'app_module_action' 	=> array('action_mif' => $res['action_mif'], 'action_invnt' => $res['action_invnt'], 'action_mrf' => $res['action_mrf'], 'action_pm' => $res['action_pm'], 'action_reports' => $res['action_reports'] ),
						'companies' 	=>	$res['companies'],
						'user_role' 	=>	$res['user_role'],
						'user_id' 		=>	$res['user_id'],
						'branch' 		=>	$res['branch'],
						'branch_pm' 	=>	$res['branch_pm'],
						'branch_mrf' 	=>	$res['branch_mrf'],
						'user_type' 	=>	$res['user_type'],
						'user_mrf_flag' =>	$res['user_mrf_flag'],
						'user_mif_flag' =>	$res['user_mif_flag'],
						'email' 		=>	$res['email'],
						'pm_type' 		=>	$res['pm_type']
					)
				);
				
				// $jwt = '';
				// if(Utils::isEmpty($res['token'])){
				// 	//Update column token

				// 	$jwt = JWT::encode($data);
				// 	$db->updateQuery('tbl_accounts','token = "'.$jwt.'"','id = "'.$res['user_id'].'"');
	
				// }else{
				// 	$jwt = $res['token'];
				// }

				$jwt = JWT::encode($data);
				//$_SESSION['token'] = $jwt;

				$data['aaData']['token'] = $jwt;

				print Utils::jsonEncode($data);
			}else {
				print Utils::jsonEncode($data = array('aaData' => array('status' => 'inactive')));
			}
		}

	} 
	else 
	{ print Utils::jsonEncode($data = array('aaData' => array('status' => 'empty'))); }

}