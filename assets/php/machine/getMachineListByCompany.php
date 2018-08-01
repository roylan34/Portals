<?php
/**
* 01/25/2017
*
* This file contains the json data format of all printer list by company.
*
*/ 

require_once '../database.php';
require_once '../utils.php';
require_once '../machine/misc.php';



$search = '';
$conn   = Database::getInstance();

if(Utils::getValue('company_id'))     { $search .="AND m.company_id ='".$conn->escapeString(Utils::getValue('company_id'))."'"; }
if(Utils::getValue('branch'))         { $search .="AND m.branches IN (".$conn->escapeString(Utils::getValue('branch')).")"; }
//For Filter Machine
if(Utils::getIsset('serialnumber') && !Utils::isEmpty(Utils::getValue('serialnumber')))  { $search .="AND m.serialnumber ='".$conn->escapeString(Utils::getValue('serialnumber'))."'"; }
if(Utils::getIsset('category') && !Utils::isEmpty(Utils::getValue('category')))          { $search .="AND m.category ='".$conn->escapeString(Utils::getValue('category'))."'"; } 
if(Utils::getIsset('type') && !Utils::isEmpty(Utils::getValue('type')))                  { $search .="AND m.type ='".$conn->escapeString(Utils::getValue('type'))."'"; } 
if(Utils::getIsset('company') && !Utils::isEmpty(Utils::getValue('company')))            { $search .="AND m.company_id ='".$conn->escapeString(Utils::getValue('company'))."'"; } 
if(Utils::getIsset('brand') && !Utils::isEmpty(Utils::getValue('brand')))    	         { $search .="AND m.brand =".$conn->escapeString(Utils::getValue('brand')).""; } //For searching brand only
if(Utils::getIsset('model') && !Utils::isEmpty(Utils::getValue('model')))   	         { $search .=" AND m.model ='".$conn->escapeString(Utils::getValue('model'))."'"; } //For searching model only

	$conn->selectQuery('    m.id,
							m.company_id,
							com.company_name,
							m.client_category,
							m.brand, 
							m.model, 
							(SELECT GROUP_CONCAT(t.toner_code SEPARATOR "<br>") AS toner_code FROM tbl_toner_model tm
							LEFT JOIN tbl_toner t ON tm.toner_id = t.id
							WHERE tm.model = m.model) as toner_code, 
							m.category, 
							m.type, 
							m.serialnumber, 
							m.page_count, 
							m.location_area, 
							m.department, 
							m.no_of_user,
							m.remarks, 
							m.date_installed, 
							m.unit_owned_by, 
							m.billing_type,
							m.status_machine,
							b.branch_name AS branches,
							br.brand_name AS brand_name,
							com.date_last_visit,
							CONCAT(ac.firstname," ",ac.lastname) AS account_manager','tblmif m 
								LEFT JOIN tbl_location b ON m.branches = b.id 
								LEFT JOIN tbl_brands br ON m.brand = br.id
								LEFT JOIN tbl_company com ON m.company_id = com.id
								LEFT JOIN tbl_client_accounts ca ON com.id_client_mngr = ca.id
								LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
								WHERE m.status_machine = 0 '.$search.' ORDER BY com.company_name ASC');

	$res = $conn->getFields();
	$data['aaData'] = array();

	if($conn->getNumRows() > 0){
		foreach ($res['aaData'] as $key => $val) {
			$data['aaData'][] = array(
								'id' => $val['id'],
								//'company_name' => getOnlyCompanyName($val['company_id'],$conn),
								'company_name' => $val['company_name'],
								'company_id' => $val['company_id'],
								'client_category' => $val['client_category'],
								'brand' => $val['brand'],
								'category' => $val['category'],
								'type' => $val['type'],
								'model' => $val['model'],
								'toner' => $val['toner_code'],
								'serialnumber' => $val['serialnumber'],
								'page_count' => $val['page_count'],
								'location_area' => $val['location_area'],
								'department' => $val['department'],
								'no_of_user' => $val['no_of_user'],
								'remarks' => $val['remarks'],
								'date_installed' => $val['date_installed'],
								'unit_owned_by' => $val['unit_owned_by'],
								'billing_type' => $val['billing_type'],
								'branches' => $val['branches'],
								'status_machine' => $val['status_machine'],
								'brand_name' => $val['brand_name'],
								'account_manager' => $val['account_manager'],
								'date_last_visit' => $val['date_last_visit']
		                     );
		}
	}

 	print Utils::jsonEncode($data);
	

