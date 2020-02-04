<?php
/**
* 06/01/2018
* Developed by: Delsan Web Development Team
*
* This file contains the json data format of Makati Branch stocks.
*
*/ 

require_once '../database.php';
require_once '../utils.php';


$search="";
$limit = "";
$totalData =0;
$totalFiltered =0;

$conn = Database::getInstance(); //For Searching.
if(Utils::getValue('serialnumber'))		{ $search ="AND ma.serialnumber ='".$conn->escapeString(Utils::getValue('serialnumber'))."'"; }
if(Utils::getValue('brand'))			{ $search .="AND ma.brand = '".$conn->escapeString(Utils::getValue('brand'))."'"; }
if(Utils::getValue('model'))			{ $search .="AND ma.model LIKE '%".$conn->escapeString(Utils::getValue('model'))."%'"; }
if(Utils::getValue('location'))			{ $search .="AND ma.location ='".$conn->escapeString(Utils::getValue('location'))."'"; }
if(Utils::getValue('date'))				{ $search .="AND ma.date_entered ='".$conn->escapeString(Utils::getValue('date'))."'"; }

			$requestData= $_REQUEST;
			// storing  request (ie, get/post) global array to a variable  
            $conn->selectQuery('ma.id','sap_db.tbl_invnt_machines_auto_import ma
            LEFT JOIN tbl_invnt_reservation a 
            ON ma.serialnumber = a.serial_number 
            WHERE NOT EXISTS( SELECT ir.serial_number FROM tbl_invnt_reservation ir WHERE ir.status = "CLOSE" AND ir.serial_number = ma.serialnumber GROUP BY ir.serial_number LIMIT 1) 
            GROUP BY ma.serialnumber');
			$totalData = $conn->getNumRows(); //getting total number records without any search.
			$conn->row_count = 0;
			$conn->fields = null;

			if( !empty($search) ) { // if there is a search parameter, $requestData['search']['value'] contains search parameter.

                $conn->selectQuery('ma.id','sap_db.tbl_invnt_machines_auto_import ma
                LEFT JOIN tbl_invnt_reservation a 
                ON ma.serialnumber = a.serial_number 
                WHERE NOT EXISTS( SELECT ir.serial_number FROM tbl_invnt_reservation ir WHERE ir.status = "CLOSE" AND ir.serial_number = ma.serialnumber GROUP BY ir.serial_number LIMIT 1 ) 
                '.$search.' 
                GROUP BY ma.serialnumber');
				$conn->fields = null;
				$totalFiltered  = $conn->getNumRows(); // when there is a search parameter then we have to modify total number filtered rows as per search result. 
			}
			else{
				$totalFiltered = $totalData;
			}
			
			if(intval($requestData['length']) >= 1 ) { $limit = ' LIMIT '.$requestData['start'].' ,'.$requestData['length'].''; }

				$conn->selectQuery('MAX( a.id) AS id_reservation, ma.id, ma.serialnumber, ma.brand, ma.model, ma.location, ma.date_entered,
                COALESCE((SELECT IF(ir.status = "REMOVE"," ", ir.status) AS STATUS FROM tbl_invnt_reservation ir WHERE ir.id= MAX( a.id)),"") AS label
                ','sap_db.tbl_invnt_machines_auto_import ma
                LEFT JOIN tbl_invnt_reservation a 
                ON ma.serialnumber = a.serial_number 
                WHERE NOT EXISTS( SELECT ir.serial_number FROM tbl_invnt_reservation ir WHERE ir.status = "CLOSE" AND ir.serial_number = ma.serialnumber GROUP BY ir.serial_number LIMIT 1) 
                '.$search.' 
                GROUP BY ma.serialnumber
                ORDER BY a.id DESC '.$limit.'');

				// $conn->selectQuery('ma.*, IF((SELECT serialnumber FROM tbl_invnt_reservation WHERE serial_number = ma.serialnumber AND (status = "" || status IS NULL) ) !="", "RESERVED", "" ) AS label, ','sap_db.tbl_invnt_machines_auto_import ma
				// 	WHERE ma.id > 0 '.$search.' '.$limit.'');
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