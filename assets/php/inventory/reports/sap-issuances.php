<?php
/**
* 03/15/2017
*
* This file is contains reports table of SAP Issuances.
*
*/ 

require_once '../../database.php';
require_once '../../utils.php';

$search ="";
$db = Database::getInstance();

	$search = "";
	if(Utils::getValue('date')){  $search = "WHERE doc_date LIKE '%".Utils::getValue('date')."%'";  }
	$db->selectQuery("  brand, item_code AS model, COUNT(*) total_model ","sap_db.tbl_invnt_issuances_auto_import $search
						GROUP BY item_code ORDER BY model");
	$row = $db->getFields(); //Get all rows
	$data = array();

	   if($db->getNumRows() > 0){
			foreach ($row['aaData'] as $key => $value) {
				$data[$value['brand']][$key]['model'] = $value['model'];
				$data[$value['brand']][$key]['total_model'] = $value['total_model'];
			}
	   }
	// print_r($data); 
	print Utils::jsonEncode($data); 