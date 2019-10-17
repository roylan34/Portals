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
$acc_manager = Utils::getValue('acc_manager');
$action = Utils::getValue('action');
$conn 	= Database::getInstance();


switch ($action ) {
	case 'sales-history-summary':
			$conn->selectQuery('acc.acc_manager,
								COALESCE(mtd_vat, "") AS mtd_vat,
								COALESCE(mtd_gross, "") AS mtd_gross,
								COALESCE(mtd_net, "") AS mtd_net,
								COALESCE(ytd_vat, "") AS ytd_vat,
								COALESCE(ytd_gross, "") AS ytd_gross,
								COALESCE(ytd_net, "") AS ytd_net','tbl_sales_history_auto_import acc 
								 LEFT JOIN (
								  SELECT 
								  acc_manager,
								  FORMAT(SUM(vat),2) AS mtd_vat,
								  FORMAT(SUM(gross),2) AS mtd_gross,
								  FORMAT(SUM(net),2) AS mtd_net 
								FROM
								  tbl_sales_history_auto_import tsh
								WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" 
								GROUP BY acc_manager 
								) tsh ON acc.acc_manager = tsh.acc_manager
								LEFT JOIN (
								SELECT 
								  acc_manager,
								  FORMAT(SUM(vat),2) AS ytd_vat,
								  FORMAT(SUM(gross),2) AS ytd_gross,
								  FORMAT(SUM(net),2) AS ytd_net
								FROM
								  tbl_sales_history_auto_import 
								  WHERE fiscal_year='.$year.'
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
				$conn->selectQuery('*','tbl_sales_summary_auto_import WHERE acc_manager = "'.$acc_mngr.'" LIMIT 1');
				$isExist  = $conn->getFields();

				if(count($isExist['aaData']) > 0){
					$conn->fields = null; //empty the previous result.

						$conn->selectQuery('1 AS id,
									    YEAR(tsh.doc_date) AS doc_year,
									    tsh.acc_manager,
									    FORMAT(SUM(tsh.gross), 2) AS mtd_gross,
									    FORMAT(SUM(tsh.vat), 2) AS mtd_vat,
									    FORMAT(SUM(tsh.net), 2) AS mtd_net,
									    tsh2.ytd_gross,
									    tsh2.ytd_vat,
									    tsh2.ytd_net','tbl_sales_summary_auto_import tsh  
										LEFT JOIN 
										  (SELECT 
										    acc_manager,
										    FORMAT(SUM(gross), 2) AS ytd_gross,
										    FORMAT(SUM(vat), 2) AS ytd_vat,
										    FORMAT(SUM(net), 2) AS ytd_net 
										  FROM
										    tbl_sales_summary_auto_import
										  WHERE fiscal_year = '.$year.' AND acc_manager="'.$acc_mngr.'"
										  ) tsh2 
										  ON tsh.acc_manager = tsh2.acc_manager 
										   WHERE tsh.fiscal_year ='.$year.'
										   AND tsh.month ="'.ucfirst($month).'" AND tsh.acc_manager="'.$acc_mngr.'"');
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
								COALESCE(mtd_gross, "") AS mtd_gross,
								COALESCE(mtd_vat, "") AS mtd_vat,
								COALESCE(mtd_net, "") AS mtd_net,
								COALESCE(ytd_gross, "") AS ytd_gross,
								COALESCE(ytd_vat, "") AS ytd_vat,
								COALESCE(ytd_net, "") AS ytd_net','tbl_sales_summary_auto_import acc 
								 LEFT JOIN (
								  SELECT 
								  acc_manager,
								  YEAR(doc_date) AS doc_year,
								  FORMAT(SUM(gross),2) AS mtd_gross,
								  FORMAT(SUM(vat),2) AS mtd_vat,
								  FORMAT(SUM(net),2) AS mtd_net 
								FROM
								  tbl_sales_summary_auto_import tsh
								WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" 
								GROUP BY acc_manager 
								) tsh ON acc.acc_manager = tsh.acc_manager
								LEFT JOIN (
								SELECT 
								  acc_manager,
								  FORMAT(SUM(gross),2) AS ytd_gross,
								  FORMAT(SUM(vat),2) AS ytd_vat,
								  FORMAT(SUM(net),2) AS ytd_net
								FROM
								  tbl_sales_summary_auto_import 
								  WHERE fiscal_year='.$year.'
								  GROUP BY acc_manager 
								) tsh2 ON acc.acc_manager = tsh2.acc_manager
								GROUP BY acc.acc_manager
								UNION ALL
								SELECT
								2 AS id,
								"PAGE TOTAL" AS acc_manager,
								"" AS doc_year,
								FORMAT(SUM(x.mtd_gross),2) AS total_mtd_gross,
								FORMAT(SUM(x.mtd_vat),2) AS total_mtd_vat,
								FORMAT(SUM(x.mtd_net),2) AS total_mtd_net,
								FORMAT(SUM(x.ytd_gross),2) AS total_ytd_gross,
								FORMAT(SUM(x.ytd_vat),2) AS total_ytd_vat,
								FORMAT(SUM(x.ytd_net),2) AS total_ytd_net
								FROM (
								SELECT acc.acc_manager,
								tsh.doc_year,
								mtd_vat,
								mtd_gross,
								mtd_net,
								ytd_gross,
								ytd_vat,
								ytd_net AS ytd_net FROM tbl_sales_summary_auto_import acc 
								LEFT JOIN 
								  (SELECT 
								    acc_manager,
								    YEAR(doc_date) AS doc_year,
								    SUM(gross) AS mtd_gross,
								    SUM(vat) AS mtd_vat,
								    SUM(net) AS mtd_net 
								  FROM
								    tbl_sales_summary_auto_import tsh 
								  WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" 
								  GROUP BY acc_manager) tsh 
								  ON acc.acc_manager = tsh.acc_manager 
								LEFT JOIN 
								  (SELECT 
								    acc_manager,
								    SUM(gross) AS ytd_gross,
								    SUM(vat) AS ytd_vat,
								    SUM(net) AS ytd_net 
								  FROM
								    tbl_sales_summary_auto_import 
								  WHERE fiscal_year='.$year.'
								  GROUP BY acc_manager) tsh2 
								  ON acc.acc_manager = tsh2.acc_manager
								 GROUP BY acc.acc_manager 
								ORDER BY acc.acc_manager) X ORDER BY id, acc_manager 
								');
								
								$resSummary = $conn->getFields();
						}

						print Utils::jsonEncode($resSummary['aaData']);

		break;
	case 'month':
			$conn->selectQuery('company, customer, doc_date ,doc_num, FORMAT(gross,2) AS gross, FORMAT(vat,2) AS vat, FORMAT(net,2) AS net','tbl_sales_summary_auto_import 
								WHERE acc_manager="'.$acc_manager.'" AND fiscal_year = '.$year.' AND month="'.ucfirst($month).'" ');
							 
							 if($conn->getNumRows() > 0){
							 	$resMonth = $conn->getFields();
							 }
							 else{
							 	$resMonth['aaData'] = array();
							 }
							 print Utils::jsonEncode($resMonth);
		break;	
		case 'year':
				$conn->selectQuery('customer,
								FORMAT(SUM(CASE WHEN MONTH="Jan" THEN net END), 2) AS jan,
								FORMAT(SUM(CASE WHEN MONTH="Feb" THEN net END), 2) AS feb,
								FORMAT(SUM(CASE WHEN MONTH="Mar" THEN net END), 2) AS mar,
								FORMAT(SUM(CASE WHEN MONTH="Apr" THEN net END), 2) AS apr,
								FORMAT(SUM(CASE WHEN MONTH="May" THEN net END), 2) AS may,
								FORMAT(SUM(CASE WHEN MONTH="Jun" THEN net END), 2) AS jun,
								FORMAT(SUM(CASE WHEN MONTH="Jul" THEN net END), 2) AS jul,
								FORMAT(SUM(CASE WHEN MONTH="Aug" THEN net END), 2) AS aug,
								FORMAT(SUM(CASE WHEN MONTH="Sep" THEN net END), 2) AS sep,
								FORMAT(SUM(CASE WHEN MONTH="Oct" THEN net END), 2) AS _oct,
								FORMAT(SUM(CASE WHEN MONTH="Nov" THEN net END), 2) AS nov,
								FORMAT(SUM(CASE WHEN MONTH="Dec" THEN net END), 2) AS _dec','tbl_sales_summary_auto_import 
								WHERE acc_manager="'.$acc_manager.'" AND fiscal_year = '.$year.' GROUP BY customer');

								 if($conn->getNumRows() > 0){
								 	$resYear = $conn->getFields();
								 }
								 else{
								 	$resYear['aaData'] = array();
								 }
								 print Utils::jsonEncode($resYear);
		break;
	case 'list-year':
			$conn->selectQuery('fiscal_year','tbl_sales_history_auto_import GROUP BY fiscal_year ORDER BY fiscal_year DESC');
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
		 $total['mtd_gross'][] 	= $value['mtd_gross'];
		 $total['mtd_vat'][] 	= $value['mtd_vat'];
		 $total['mtd_net'][] 	= $value['mtd_net'];
		 $total['ytd_gross'][] 	= $value['ytd_gross'];
		 $total['ytd_vat'][] 	= $value['ytd_vat'];
		 $total['ytd_net'][] 	= $value['ytd_net'];
	}
	
	return sumTotalSummary($total['mtd_gross']);
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