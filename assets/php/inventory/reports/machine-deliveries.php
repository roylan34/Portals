<?php
/**
* 10/08/2019
*
* This file is contains reports table of Machine Deliveries.
*
*/ 

require_once '../../database.php';
require_once '../../utils.php';

$search ="";
$db = Database::getInstance();

	$search = "";
	if(Utils::getValue('date')){  $search = "AND doc_date LIKE '%".Utils::getValue('date')."%'";  }
	$db->selectQuery("firm_name, model, COUNT(*) total_model ","tbl_receipts_auto_import WHERE trans_type='MACHINE ISSUES' $search
						GROUP BY model ORDER BY model");
	$row = $db->getFields(); //Get all rows
	$data = array();

	   if($db->getNumRows() > 0){
			foreach ($row['aaData'] as $key => $value) {
				$data[$value['firm_name']][$key]['model'] = $value['model'];
				$data[$value['firm_name']][$key]['total_model'] = $value['total_model'];
			}
	   }
	// print_r($data); 
	print Utils::jsonEncode($data); 