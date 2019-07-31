<?php
/**
* 01/25/2017
*
* This file contains the json data format of all account type by flag.
*
*/

require_once '../../database.php';
require_once '../../utils.php';

$data = array();


	$db = Database::getInstance();
	$db->selectQuery('*','tbl_account_type');
	$res = $db->getFields();

	foreach ($res['aaData'] as $key => $value) {
		$data[$key]['id'] = $value['id'];
		$data[$key]['dept'] = $value['acc_name'];
		$data[$key]['mif_flag'] = $value['acc_mif_flags'];
	}
	 
	print Utils::jsonEncode($data);