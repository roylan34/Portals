<?php
/*
* This file container json format of PM History.
* 
*/

require_once '../database.php';
require_once '../utils.php';

$search = "";
$conn   = Database::getInstance();


// storing  request (ie, get/post) global array to a variable  
$requestData= $_REQUEST;
$conn->selectQuery('pm.*','tbl_pm_machines pm
LEFT JOIN tbl_pm_schedule ps ON pm.pm_number = ps.pm_number
LEFT JOIN tbl_company com ON pm.company_id = com.id
LEFT JOIN tbl_pm_technician pt ON pm.pm_number = pt.pm_number
LEFT JOIN tbl_accounts ac ON pt.technician = ac.id
WHERE pm.mif_id ='.$requestData['mif_id'].' AND ps.status = "close" GROUP BY pm.pm_number');
$totalData = $conn->getNumRows(); //getting total number records without any search.
$conn->row_count = 0;
$conn->fields = null;

if( !empty($requestData['search']['value']) ) {   // if there is a search parameter, $requestData['search']['value'] contains search parameter
	$search.=" AND ( CONCAT_WS(' ',ac.firstname,ac.lastname) LIKE '%".$conn->escapeString($requestData['search']['value'])."%' ";
	$search.=" OR com.company_name  LIKE '%".$conn->escapeString($requestData['search']['value'])."%' ";
	$search.=" OR ps.schedule_date  LIKE '%".$conn->escapeString($requestData['search']['value'])."%' ";
	$search.=" OR pm.remarks LIKE '%".$conn->escapeString($requestData['search']['value'])."%') ";

$conn->selectQuery('pm.*',
	'tbl_pm_machines pm
	LEFT JOIN tbl_pm_schedule ps ON pm.pm_number = ps.pm_number
	LEFT JOIN tbl_company com ON pm.company_id = com.id
	LEFT JOIN tbl_pm_technician pt ON pm.pm_number = pt.pm_number
	LEFT JOIN tbl_accounts ac ON pt.technician = ac.id
	WHERE pm.mif_id = '.$requestData['mif_id'].' '.$search.' AND ps.status = "close" GROUP BY pm.pm_number');

	$conn->fields = null;
	$totalFiltered  = $conn->getNumRows(); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
}
else{
	$totalFiltered = $totalData;
}

$conn->selectQuery('com.company_name, ps.schedule_date, GROUP_CONCAT(CONCAT(ac.firstname," ", ac.lastname) SEPARATOR "<br>") AS technician, pm.remarks, pm.page_count, pm.time_in, pm.time_out',
	'tbl_pm_machines pm
	LEFT JOIN tbl_pm_schedule ps ON pm.pm_number = ps.pm_number
	LEFT JOIN tbl_company com ON pm.company_id = com.id
	LEFT JOIN tbl_pm_technician pt ON pm.pm_number = pt.pm_number
	LEFT JOIN tbl_accounts ac ON pt.technician = ac.id
	WHERE pm.mif_id ="'.$requestData['mif_id'].'" AND ps.status = "close" GROUP BY pm.pm_number '.$search.'  ORDER BY pm.id DESC LIMIT '.$requestData['start'].' ,'.$requestData['length'].'');
$row = $conn->getFields(); //Get all rows


$data = array();
$nestedData=array(); 
	foreach($row['aaData'] as $index=>$value) { // preparing an array
		$nestedData[$index] = $value;
	}
	$data = $nestedData; 
	

$json_data = array(
			"draw"            => intval( $requestData['draw'] ),   // for every request/draw by clientside , they send a number as a parameter, when they recieve a response/data they first check the draw number, so we are sending same number in draw. 
			"recordsTotal"    => intval( $totalData ),  // total number of records
			"recordsFiltered" => intval( $totalFiltered ), // total number of records after searching, if there is no searching then totalFiltered = totalData
			"records"         => $data   // data array,
			);

print Utils::jsonEncode($json_data);  // send data as json format



