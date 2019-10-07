<?php
/**
* 10/27/2019
* Developed by: Delsan Web Development Team
*
* This file contains the json data format of all company list.
*
*/ 

require_once '../database.php';
require_once '../utils.php';

$search="";
$has_user = "";
$limit = "";
$totalData =0;
$totalFiltered =0;
$status = '';
$qry_status = '';
$conn = Database::getInstance(); //For Searching.
if(Utils::getValue('serial_no'))		{ $search .="AND ir.serial_number ='".$conn->escapeString(Utils::getValue('serial_no'))."'"; }
if(Utils::getValue('comp'))				{ $search .="AND c.company_name LIKE '%".$conn->escapeString(Utils::getValue('comp'))."%'"; }
if(Utils::getValue('date_reserved'))	{ $search .="AND ir.date_reserved LIKE '%".$conn->escapeString(Utils::getValue('date_reserved'))."%'"; }
if(Utils::getValue('acct_mngr'))		{ $search .="AND CONCAT_WS(' ', ac.firstname, ac.lastname) LIKE '%".$conn->escapeString(Utils::getValue('acct_mngr'))."%'";}
if(Utils::getValue('status'))			{ $search .="AND ir.status = '".$conn->escapeString(Utils::getValue('status'))."'"; }

$requestData= $_REQUEST;

switch (Utils::getValue('action_view')) {
	case 'current':
				// storing  request (ie, get/post) global array to a variable  
				$conn->selectQuery('*','tbl_invnt_reservation WHERE status="" || status is null ');
				$totalData = $conn->getNumRows(); //getting total number records without any search.
				$conn->row_count = 0;
				$conn->fields = null;

				if( !empty($search) ) { // if there is a search parameter.

				$conn->selectQuery('ir.*','tbl_invnt_reservation ir 
							LEFT JOIN tbl_company c ON ir.id_company = c.id
							LEFT JOIN tbl_client_accounts ca ON ir.id_acc_mngr = ca.id
							LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
				  			WHERE ir.id > 0 AND (ir.status="" || ir.status is null) '.$search.' ');

					$conn->fields = null;
					$totalFiltered  = $conn->getNumRows(); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
				}
				else{
					$totalFiltered = $totalData;
				}
				
				if(intval($requestData['length']) >= 1 ) { $limit = 'LIMIT '.$requestData['start'].' ,'.$requestData['length'].''; }

				$conn->selectQuery('ir.id, ir.serial_number, c.company_name, ir.date_reserved, CONCAT(ac.firstname," ", ac.lastname) AS acct_mngr, ir.status,
									DATEDIFF(DATE_FORMAT(ir.date_reserved, "%y-%m-%d"), NOW()) AS aging','tbl_invnt_reservation ir 
									LEFT JOIN tbl_company c ON ir.id_company = c.id
									LEFT JOIN tbl_client_accounts ca ON ir.id_acc_mngr = ca.id
									LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
						  			WHERE ir.id > 0 AND (ir.status="" || ir.status is null) '.$search.' ORDER BY ir.id DESC '.$limit.'');
				$row = $conn->getFields(); //Get all rows

				if($conn->getNumRows() > 0 ){
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
				} 
				else{ 
					$json_data = array("draw" =>  0,"recordsTotal" => 0, "recordsFiltered" => 0, "records" => array());
					$json_data['aaData'] = array(); 
				}

				 print Utils::jsonEncode($json_data);  // send data as json format.
			
		break;

	case 'archive':
				$conn->selectQuery('*','tbl_invnt_reservation WHERE status IN ("REMOVE", "CLOSE") ');
				$totalData = $conn->getNumRows(); //getting total number records without any search.
				$conn->row_count = 0;
				$conn->fields = null;

				if( !empty($search) ) { // if there is a search parameter.

				$conn->selectQuery('ir.*','tbl_invnt_reservation ir 
							LEFT JOIN tbl_company c ON ir.id_company = c.id
							LEFT JOIN tbl_client_accounts ca ON ir.id_acc_mngr = ca.id
							LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
				  			WHERE ir.id > 0 AND ir.status IN ("REMOVE", "CLOSE") '.$search.' ');

					$conn->fields = null;
					$totalFiltered  = $conn->getNumRows(); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
				}
				else{
					$totalFiltered = $totalData;
				}
				
				if(intval($requestData['length']) >= 1 ) { $limit = 'LIMIT '.$requestData['start'].' ,'.$requestData['length'].''; }

				$conn->selectQuery('ir.id, ir.serial_number, c.company_name, ir.date_reserved, CONCAT(ac.firstname," ", ac.lastname) AS acct_mngr, ir.status','tbl_invnt_reservation ir 
									LEFT JOIN tbl_company c ON ir.id_company = c.id
									LEFT JOIN tbl_client_accounts ca ON ir.id_acc_mngr = ca.id
									LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
						  			WHERE ir.id > 0 AND ir.status IN ("REMOVE", "CLOSE") '.$search.' ORDER BY ir.id DESC '.$limit.'');
				$row = $conn->getFields(); //Get all rows

				if($conn->getNumRows() > 0 ){
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
				} 
				else{ 
					$json_data = array("draw" =>  0,"recordsTotal" => 0, "recordsFiltered" => 0, "records" => array());
					$json_data['aaData'] = array(); 
				}

				 print Utils::jsonEncode($json_data);  // send data as json format.
		break;
	default:
		 throw new Exception("Error Processing Request");
		break;
}




