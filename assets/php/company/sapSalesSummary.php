<?php

/**
* 12/14/2018
*
* This file contains the json data of Monthly and Yearly Sales Per Account.
*
*/

require_once '../database.php';
require_once '../utils.php';

$year 	= Utils::getValue('year');
$month 	= Utils::getValue('month');
$comp 	= Utils::getValue('company');
$acc_manager = Utils::getValue('acc_manager');
$action = Utils::getValue('action');
$conn 	= Database::getInstance();

$searchComp = "";
$joinSearchComp = "";
if($comp == "dosc" || $comp == "dbic"){  
	$searchComp 	= "AND company = '".$comp."'" ;
	$joinSearchComp = "AND tsh.company = '".$comp."'" ;
}

switch ($action ) {
	case 'sales-history-summary':
			$conn->selectQuery('acc.acc_manager,
								COALESCE(mtd_cancelled, "") AS mtd_cancelled,
								COALESCE(mtd_sales, "") AS mtd_sales,
								COALESCE(mtd_total, "") AS mtd_total,
								COALESCE(ytd_cancelled, "") AS ytd_cancelled,
								COALESCE(ytd_sales, "") AS ytd_sales,
								COALESCE(ytd_total, "") AS ytd_total','sap_db.tbl_sales_history_auto_import acc 
								 LEFT JOIN (
								  SELECT 
								  acc_manager,
								  FORMAT(SUM(cancelled),2) AS mtd_cancelled,
								  FORMAT(SUM(sales),2) AS mtd_sales,
								  FORMAT(SUM(total),2) AS mtd_total 
								FROM
								  sap_db.tbl_sales_history_auto_import tsh
								WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'
								GROUP BY acc_manager 
								) tsh ON acc.acc_manager = tsh.acc_manager
								LEFT JOIN (
								SELECT 
								  acc_manager,
								  FORMAT(SUM(cancelled),2) AS ytd_cancelled,
								  FORMAT(SUM(sales),2) AS ytd_sales,
								  FORMAT(SUM(total),2) AS ytd_total
								FROM
								  sap_db.tbl_sales_history_auto_import 
								  WHERE fiscal_year='.$year.' '.$searchComp.'
								  GROUP BY acc_manager 
								) tsh2 ON acc.acc_manager = tsh2.acc_manager
								GROUP BY acc.acc_manager
								ORDER BY acc.acc_manager');
								
								$resSummary = $conn->getFields();

							print Utils::jsonEncode($resSummary['aaData']);

		break;
	case 'sales-summary':
			$search = "";
			$allowed_user_type = array(2,3,4); //Sales, Relation, Techinical
			if(in_array(Utils::getValue('user_type'), $allowed_user_type)){

				//Get account manager name.
				$user_id = Utils::getValue('user_id');
				$conn->selectQuery('firstname,lastname','tbl_accounts WHERE id = '.$user_id.' LIMIT 1');
				$resUser  = $conn->getFields();
				$acc_mngr = strtoupper($resUser['aaData'][0]['lastname']." ".$resUser['aaData'][0]['firstname']);

				$conn->fields = null; //empty the previous result.

				//Check if account manager is exist in sales summary table.
				$conn->selectQuery('*','sap_db.tbl_sales_summary_auto_import WHERE acc_manager = "'.$acc_mngr.'" '.$searchComp.' LIMIT 1');
				$isExist  = $conn->getFields();

				if(count($isExist['aaData']) > 0){
					$conn->fields = null; //empty the previous result.

						$conn->selectQuery('1 AS id,
									    YEAR(tsh.doc_date) AS doc_year,
									    tsh.acc_manager,
									    FORMAT(SUM(tsh.sales), 2) AS mtd_sales,
									    FORMAT(SUM(tsh.cancelled), 2) AS mtd_cancelled,
									    FORMAT(SUM(tsh.total), 2) AS mtd_total,
									    tsh2.ytd_sales,
									    tsh2.ytd_cancelled,
									    tsh2.ytd_total','sap_db.tbl_sales_summary_auto_import tsh  
										LEFT JOIN 
										  (SELECT 
										    acc_manager,
										    FORMAT(SUM(sales), 2) AS ytd_sales,
										    FORMAT(SUM(cancelled), 2) AS ytd_cancelled,
										    FORMAT(SUM(total), 2) AS ytd_total 
										  FROM
										    sap_db.tbl_sales_summary_auto_import
										  WHERE fiscal_year = '.$year.' AND acc_manager="'.$acc_mngr.'" '.$searchComp.'
										  ) tsh2 
										  ON tsh.acc_manager = tsh2.acc_manager 
										   WHERE tsh.fiscal_year ='.$year.'
										   AND tsh.month ="'.ucfirst($month).'" AND tsh.acc_manager="'.$acc_mngr.'" '.$joinSearchComp.' ');
						$resSummary = $conn->getFields();
				}
				else{
					$resSummary['aaData'] = array();
				}
			}
			else{
					//Executive report
					$conn->selectQuery('1 AS id,
								acc.acc_manager,
								tsh.doc_year,
								COALESCE(mtd_sales, "") AS mtd_sales,
								COALESCE(IF(mtd_cancelled <= -1 , mtd_cancelled, null), "") AS mtd_cancelled,
								COALESCE(mtd_total, "") AS mtd_total,
								COALESCE(ytd_sales, "") AS ytd_sales,
								COALESCE(IF(ytd_cancelled != 0, ytd_cancelled, null), "") AS ytd_cancelled,
								COALESCE(ytd_total, "") AS ytd_total','sap_db.tbl_sales_summary_auto_import acc 
								 LEFT JOIN (
								  SELECT 
								  acc_manager,
								  YEAR(doc_date) AS doc_year,
								  FORMAT(SUM(sales),2) AS mtd_sales,
								  FORMAT(SUM(cancelled),2) AS mtd_cancelled,
								  FORMAT(SUM(total),2) AS mtd_total 
								FROM
								  sap_db.tbl_sales_summary_auto_import tsh
								WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'
								GROUP BY acc_manager 
								) tsh ON acc.acc_manager = tsh.acc_manager
								LEFT JOIN (
								SELECT 
								  acc_manager,
								  FORMAT(SUM(sales),2) AS ytd_sales,
								  FORMAT(SUM(cancelled),2) AS ytd_cancelled,
								  FORMAT(SUM(total),2) AS ytd_total
								FROM
								  sap_db.tbl_sales_summary_auto_import 
								  WHERE fiscal_year='.$year.' '.$searchComp.'
								  GROUP BY acc_manager 
								) tsh2 ON acc.acc_manager = tsh2.acc_manager
								GROUP BY acc.acc_manager
								UNION ALL
								SELECT
								2 AS id,
								"PAGE TOTAL" AS acc_manager,
								"" AS doc_year,
								FORMAT(SUM(x.mtd_sales),2) AS total_mtd_sales,
								FORMAT(SUM(x.mtd_cancelled),2) AS total_mtd_cancelled,
								FORMAT(SUM(x.mtd_total),2) AS total_mtd_total,
								FORMAT(SUM(x.ytd_sales),2) AS total_ytd_sales,
								FORMAT(SUM(x.ytd_cancelled),2) AS total_ytd_cancelled,
								FORMAT(SUM(x.ytd_total),2) AS total_ytd_total
								FROM (
								SELECT acc.acc_manager,
								tsh.doc_year,
								mtd_cancelled,
								mtd_sales,
								mtd_total,
								ytd_sales,
								ytd_cancelled,
								ytd_total AS ytd_total FROM sap_db.tbl_sales_summary_auto_import acc 
								LEFT JOIN 
								  (SELECT 
								    acc_manager,
								    YEAR(doc_date) AS doc_year,
								    SUM(sales) AS mtd_sales,
								    SUM(cancelled) AS mtd_cancelled,
								    SUM(total) AS mtd_total 
								  FROM
								    sap_db.tbl_sales_summary_auto_import tsh 
								  WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'
								  GROUP BY acc_manager) tsh 
								  ON acc.acc_manager = tsh.acc_manager 
								LEFT JOIN 
								  (SELECT 
								    acc_manager,
								    SUM(sales) AS ytd_sales,
								    SUM(cancelled) AS ytd_cancelled,
								    SUM(total) AS ytd_total 
								  FROM
								    sap_db.tbl_sales_summary_auto_import 
								  WHERE fiscal_year='.$year.' '.$searchComp.'
								  GROUP BY acc_manager) tsh2 
								  ON acc.acc_manager = tsh2.acc_manager
								 GROUP BY acc.acc_manager 
								ORDER BY acc.acc_manager) X ORDER BY id, acc_manager 
								');
								
								$resSummary = $conn->getFields();
						}

						print Utils::jsonEncode($resSummary['aaData']);

		break;
	case 'sales':
			$conn->selectQuery('company, customer, acc_type, acc_mngr_invoice, branch, acct_name, doc_date ,doc_num, FORMAT(sales,2) AS sales','sap_db.tbl_sales_summary_auto_import 
								WHERE sales > 0 AND acc_manager="'.$acc_manager.'" AND fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'');
							 
							 if($conn->getNumRows() > 0){
							 	$resMonth = $conn->getFields();
							 }
							 else{
							 	$resMonth['aaData'] = array();
							 }
							 print Utils::jsonEncode($resMonth);
        break;	
    case 'cancel':
            $conn->selectQuery('company, customer, acc_type, acc_mngr_invoice, branch, acct_name, doc_date ,doc_num, 
                                IF(cancelled <= -1, FORMAT(cancelled ,2), "") AS cancelled, 
                                IF(ref_inv > 0, ref_inv, "") AS ref_inv, 
                                IF(ref_doc_date != "0000-00-00", ref_doc_date, "") AS ref_doc_date ','sap_db.tbl_sales_summary_auto_import 
								WHERE cancelled <= 0  AND acc_manager="'.$acc_manager.'" AND fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'');
							 
							 if($conn->getNumRows() > 0){
							 	$resMonthCancel = $conn->getFields();
							 }
							 else{
							 	$resMonthCancel['aaData'] = array();
							 }
							 print Utils::jsonEncode($resMonthCancel);
		break;	
	case 'year':
                $conn->selectQuery('
                                customer,
                                company,
								FORMAT(SUM(CASE WHEN MONTH="Jan" THEN total END), 2) AS jan,
								FORMAT(SUM(CASE WHEN MONTH="Feb" THEN total END), 2) AS feb,
								FORMAT(SUM(CASE WHEN MONTH="Mar" THEN total END), 2) AS mar,
								FORMAT(SUM(CASE WHEN MONTH="Apr" THEN total END), 2) AS apr,
								FORMAT(SUM(CASE WHEN MONTH="May" THEN total END), 2) AS may,
								FORMAT(SUM(CASE WHEN MONTH="Jun" THEN total END), 2) AS jun,
								FORMAT(SUM(CASE WHEN MONTH="Jul" THEN total END), 2) AS jul,
								FORMAT(SUM(CASE WHEN MONTH="Aug" THEN total END), 2) AS aug,
								FORMAT(SUM(CASE WHEN MONTH="Sep" THEN total END), 2) AS sep,
								FORMAT(SUM(CASE WHEN MONTH="Oct" THEN total END), 2) AS _oct,
								FORMAT(SUM(CASE WHEN MONTH="Nov" THEN total END), 2) AS nov,
								FORMAT(SUM(CASE WHEN MONTH="Dec" THEN total END), 2) AS _dec','sap_db.tbl_sales_summary_auto_import 
								WHERE acc_manager="'.$acc_manager.'" AND fiscal_year = '.$year.' '.$searchComp.' GROUP BY customer');

								 if($conn->getNumRows() > 0){
								 	$resYear = $conn->getFields();
								 }
								 else{
								 	$resYear['aaData'] = array();
								 }
								 print Utils::jsonEncode($resYear);
		break;
	case 'list-year':
			$conn->selectQuery('fiscal_year','sap_db.tbl_sales_history_auto_import GROUP BY fiscal_year ORDER BY fiscal_year DESC');
							$listYear = $conn->getFields();
							 print Utils::jsonEncode($listYear['aaData']);
		break;
	default:
		throw new Exception("Missing action argument.");
		break;
}


function computedTotalSummary($data){
	$total = null;
	foreach ($data as $key => $value) {
		 $total['mtd_sales'][] 	= $value['mtd_sales'];
		 $total['mtd_cancelled'][] 	= $value['mtd_cancelled'];
		 $total['mtd_total'][] 	= $value['mtd_total'];
		 $total['ytd_sales'][] 	= $value['ytd_sales'];
		 $total['ytd_cancelled'][] 	= $value['ytd_cancelled'];
		 $total['ytd_total'][] 	= $value['ytd_total'];
	}
	
	return sumTotalSummary($total['mtd_sales']);
}

function sumTotalSummary($arrVal){
	if(is_array($arrVal)){
		return array_reduce($arrVal, function($carry, $item){
			$val_carry = doubleval($carry);
			$val_item = doubleval($item);
			$val_carry += $val_item;
			return $val_carry;
		});
	}
	throw new Exception('Argument must be an array.');
}