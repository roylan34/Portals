<?php
/**
* 03/15/2017
*
* This file is contains reports table of All Stocks.
*
*/ 

require_once '../../database.php';
require_once '../../utils.php';

$search ="";
$db = Database::getInstance();


//SAP- Makati stocks Brand New
// SELECT id_brand AS brand, model, COUNT(*) AS total_model, "MAKATI" AS branch, "sap" AS sap
// FROM tbl_invnt_machines_auto_import
// GROUP BY model
// UNION ALL

$db->selectQuery2('SELECT branch, brand, model, id_branch_sort, SUM(total_model) AS total_model FROM (
SELECT id_brand AS brand, model, COUNT(*) AS total_model, "MAKATI" AS branch, 2 AS id_branch_sort
 FROM tbl_invnt_machines_auto_import
 GROUP BY model
 UNION ALL
SELECT br.brand_name AS brand, mo.model_name AS model, COUNT(*) AS total_model, brc.branch_name AS branch, brc.id AS id_branch_sort FROM tbl_invnt_machines im
LEFT JOIN tbl_branch brc ON im.id_branch = brc.id
LEFT JOIN tbl_brands br ON im.id_brand = br.id
LEFT JOIN tbl_model mo ON im.model = mo.id
LEFT JOIN tbl_invnt_status s ON im.id_status = s.id
WHERE im.is_delete = 0 AND (im.id_status = 0 OR s.status_type = "IN")
GROUP BY im.id_branch,im.model ORDER BY id_branch_sort, model) X GROUP BY branch, model ORDER BY id_branch_sort');
	$row = $db->getFields(); //Get all rows
	$data = array();


	   if($db->getNumRows() > 0){
			foreach ($row['aaData'] as $key => $value) {
				$data[$value['branch']][$value['brand']][$key]['model'] = $value['model'];
				$data[$value['branch']][$value['brand']][$key]['total_model'] = $value['total_model'];
			}
	   }

	print Utils::jsonEncode($data); 
	// echo "<pre>";
	// print_r($data);
	// echo "</pre>";