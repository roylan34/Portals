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


// $db->selectQuery2('SELECT branch, brand, model, id_branch_sort, SUM(bn) AS bn, SUM(rf) AS rf, SUM(total_model) AS total_model FROM (
// SELECT imai.id_brand AS brand, imai.model, COUNT(*) AS total_model, br.branch_name AS branch, br.id AS id_branch_sort,
// COUNT(*) AS bn,
// 0 AS rf
//  FROM tbl_invnt_machines_auto_import imai
//  LEFT JOIN tbl_invnt_machines_saploc ims ON imai.location = ims.branch
//  LEFT JOIN tbl_branch br ON ims.equiv_id_branch = br.id
//  GROUP BY br.id, imai.model
//  UNION ALL
// SELECT br.brand_name AS brand, mo.model_name AS model, COUNT(*) AS total_model, brc.branch_name AS branch, brc.id AS id_branch_sort,
// SUM(im.id_condition = 1 ) AS bn,
// SUM(im.id_condition = 2 ) AS rf
//  FROM tbl_invnt_machines im
// LEFT JOIN tbl_branch brc ON im.id_branch = brc.id
// LEFT JOIN tbl_brands br ON im.id_brand = br.id
// LEFT JOIN tbl_model mo ON im.model = mo.id
// LEFT JOIN tbl_invnt_status s ON im.id_status = s.id
// WHERE im.is_delete = 0 AND (im.id_status = 0 OR s.status_type = "IN")
// GROUP BY im.id_branch,im.model ORDER BY id_branch_sort, model) X GROUP BY branch, model ORDER BY id_branch_sort');

// $db->selectQuery2('SELECT branch, brand, model, id_branch_sort, SUM(id_condition = 1) AS bn, SUM(id_condition = 2) AS rf, COUNT(*) AS total_model FROM (
// SELECT imai.serialnumber, imai.id_brand AS brand, imai.model, br.branch_name AS branch, br.id AS id_branch_sort,
//  1 AS id_condition
//  FROM tbl_invnt_machines_auto_import imai
//  LEFT JOIN tbl_invnt_machines_saploc ims ON imai.location = ims.branch
//  LEFT JOIN tbl_branch br ON ims.equiv_id_branch = br.id
//  UNION ALL
// SELECT im.serialnumber, br.brand_name AS brand, mo.model_name AS model, brc.branch_name AS branch, brc.id AS id_branch_sort,
//  im.id_condition
//  FROM tbl_invnt_machines im
// LEFT JOIN tbl_branch brc ON im.id_branch = brc.id
// LEFT JOIN tbl_brands br ON im.id_brand = br.id
// LEFT JOIN tbl_model mo ON im.model = mo.id
// LEFT JOIN tbl_invnt_status s ON im.id_status = s.id
// WHERE NOT EXISTS(SELECT serialnumber FROM tbl_invnt_machines_auto_import ina WHERE im.serialnumber = ina.serialnumber) 
// AND im.is_delete = 0 AND (im.id_status = 0 OR s.status_type = "IN")
// ) X GROUP BY branch, model ORDER BY brand, model');

$db->selectQuery2('SELECT branch, brand, model, id_branch_sort, SUM(id_condition = 1) AS bn, SUM(id_condition = 2) AS rf, COUNT(*) AS total_model FROM (
SELECT imai.serialnumber, imai.brand, imai.model, br.branch_name AS branch, br.id AS id_branch_sort,
 1 AS id_condition
 FROM sap_db.tbl_invnt_machines_auto_import imai
 LEFT JOIN tbl_invnt_machines_saploc ims ON imai.location = ims.branch
 LEFT JOIN tbl_branch br ON ims.equiv_id_branch = br.id) X GROUP BY branch,model ORDER BY brand, model');
	$row = $db->getFields(); //Get all rows
	$data = array();

	  	if($db->getNumRows() > 0){

			foreach ($row['aaData'] as $key => $value) {
				$data[$value['brand']][$value['model']]['total']['bn'][] = $value['bn'];
				$data[$value['brand']][$value['model']]['total']['rf'][] = $value['rf'];
				$data[$value['brand']][$value['model']]['total'][$value['branch']]['bn'] = $value['bn'];
				$data[$value['brand']][$value['model']]['total'][$value['branch']]['rf'] = $value['rf'];
			}
	   	}
		print Utils::jsonEncode($data); 