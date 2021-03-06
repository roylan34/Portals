<?php
/**
* 01/17/2019
* Developed by: Delsan Web Development Team
*
* This file contains the json data format of Sales Details.
*
*/ 

require_once '../database.php';
require_once '../utils.php';


$search="";
$limit = "";
$totalData =0;
$totalFiltered =0;
$conn = Database::getInstance(); //For Searching.

$user_id = $conn->escapeString(Utils::getValue('user_id'));

if(Utils::getValue('company'))		{ $search .="AND company_name LIKE '%".$conn->escapeString(Utils::getValue('company'))."%'"; }
// if(Utils::getValue('acc_manager'))	{ $search .="AND acc_manager LIKE '%".$conn->escapeString(Utils::getValue('acc_manager'))."%'"; }
if(Utils::getValue('fiscal_year'))	{ $search .="AND fiscal_year ='".$conn->escapeString(Utils::getValue('fiscal_year'))."'"; }
if(Utils::getValue('month'))		{ $search .="AND month = '".$conn->escapeString(Utils::getValue('month'))."'"; }

			$requestData= $_REQUEST;

			//Sum of Vat, Gross & NetSales
			if(!Utils::isEmpty($user_id)){
				$conn->selectQuery('FORMAT(SUM(ROUND(vat,2)),2) AS total_vat, FORMAT(SUM(ROUND(gross,2)),2) AS total_gross, FORMAT(SUM(ROUND(net,2)),2) AS total_net ','sap_db.tbl_sales_history_auto_import WHERE id > 0 AND acc_manager=(SELECT UPPER(CONCAT(lastname,"  ",firstname)) AS fullname FROM tbl_accounts WHERE id ='.$user_id.') ');
				$totalSales = $conn->getFields(); //Get all rows
				$conn->fields = null;
				
			}

			// storing  request (ie, get/post) global array to a variable  
			$conn->selectQuery('*','sap_db.tbl_sales_history_auto_import WHERE id > 0 AND acc_manager=(SELECT UPPER(CONCAT(lastname,"  ",firstname)) AS fullname FROM tbl_accounts WHERE id ='.$user_id.')');
			$totalData = $conn->getNumRows(); //getting total number records without any search.
			$conn->row_count = 0;
			$conn->fields = null;

			if( !empty($search) ) { // if there is a search parameter, $requestData['search']['value'] contains search parameter.

			$conn->selectQuery('*','sap_db.tbl_sales_history_auto_import WHERE id > 0 AND acc_manager=(SELECT UPPER(CONCAT(lastname,"  ",firstname)) AS fullname FROM tbl_accounts WHERE id ='.$user_id.') '.$search.'' );

				$conn->fields = null;
				$totalFiltered  = $conn->getNumRows(); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
			}
			else{
				$totalFiltered = $totalData;
			}
			
			if(intval($requestData['length']) >= 1 ) { $limit = ' LIMIT '.$requestData['start'].' ,'.$requestData['length'].''; }

				$conn->selectQuery('id, sap_code,company_name,acc_manager,fiscal_year,month,doc_num,doc_date,baseref,customer_po,item_code,description,quantity,pricevat,FORMAT(vat,2) AS vat,FORMAT(gross,2) AS gross, FORMAT(net, 2) AS net','sap_db.tbl_sales_history_auto_import 
										WHERE id > 0 AND acc_manager=(SELECT UPPER(CONCAT(lastname,"  ",firstname)) AS fullname FROM tbl_accounts WHERE id ='.$user_id.') '.$search.' '.$limit.'');
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
							"records"         => $data,   // data array,
							"totalSales"	  => $totalSales['aaData'][0]
							);
			} 
			else{ 
				$json_data = array("draw" =>  0,"recordsTotal" => 0, "recordsFiltered" => 0, "records" => array(), "totalSales"	=> array("total_vat"=> 0, "total_gross"=>0, "total_net"=>0) );
			}

				print Utils::jsonEncode($json_data);  // send data as json format.