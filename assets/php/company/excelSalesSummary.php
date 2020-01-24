<?php

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Asia/Manila');

if (PHP_SAPI == 'cli')
	die('This should only be run from a Web Browser');

require_once '../database.php';
require_once '../utils.php';
/** Include PHPExcel */
require_once '../phpexcel/PHPExcel-1.8/Classes/PHPExcel.php';

$db = Database::getInstance();
$year ="";
$month ="";
$comp 	= Utils::getValue('company');
$searchComp = "";
$joinSearchComp = "";
if($comp == "dosc" || $comp == "dbic"){  
	$searchComp 	= "AND company = '".$comp."'" ;
	$joinSearchComp = "AND tsh.company = '".$comp."'" ;
}

if(Utils::getValue('year'))	   { $year = $db->escapeString(Utils::getValue('year')); }
if(Utils::getValue('month'))   { $month = $db->escapeString(Utils::getValue('month')); }

			$allowed_user_type = array(2,3,4); //Sales, Relation, Techinical
			if(in_array(Utils::getValue('user_type'), $allowed_user_type)){

                //Get logged in account manager name.
				$user_id = Utils::getValue('user_id');
				$db->selectQuery('UPPER(CONCAT(lastname," ",firstname)) AS logged_mngr','tbl_accounts WHERE id = '.$user_id.' LIMIT 1');
				$resUser  = $db->getFields();
                $acc_mngr = $resUser['aaData'][0]['logged_mngr'];

                
				//Check if account manager is exist in sales summary table.
				$db->selectQuery('*','sap_db.tbl_sales_summary_auto_import WHERE acc_manager = "'.$acc_mngr.'" '.$searchComp.' LIMIT 1');
				$isExist  = $db->getFields();

				if(count($isExist['aaData']) > 0){
                    $db->fields = null; //empty the previous result.
                    
                        $view_tag_acc = array($acc_mngr);
                        //View other sales summary report
                        //Get tag account manager.
                        $db->selectQuery('app_reports','tbl_app_action WHERE id_account= '.$user_id.' LIMIT 1');
                        $resTag  = $db->getFields();

                        if(count($resTag['aaData']) > 0){
                            $tag_mngr = json_decode($resTag['aaData'][0]['app_reports']);
                            $parse_tag_mngr = ($tag_mngr && property_exists($tag_mngr, 'tag_acct_mgr') ? $tag_mngr->tag_acct_mgr : null);
                            $db->fields = null; //empty the previous result.

                            if($parse_tag_mngr != null){
                                $strTag = implode($parse_tag_mngr, ',');

                                $db->selectQuery('UPPER(CONCAT(ac.lastname," ", ac.firstname)) AS acct_mngr','tbl_client_accounts ca
                                LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
                                WHERE ca.id IN ('.$strTag.') ');
                                $resTagName  = $db->getFields();
                
                                $view_tag_acc = array_merge( $view_tag_acc, array_column($resTagName['aaData'], 'acct_mngr'));
                            }

                        }
                        $db->fields = null; //empty the previous result.
						$db->selectQuery('1 AS id,
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
										WHERE fiscal_year = '.$year.' AND acc_manager IN ("'.implode($view_tag_acc, '","').'") '.$searchComp.'
										GROUP BY acc_manager ) tsh2 
										ON tsh.acc_manager = tsh2.acc_manager 
										WHERE tsh.fiscal_year ='.$year.'
										AND tsh.month ="'.ucfirst($month).'" AND tsh.acc_manager IN ("'.implode($view_tag_acc, '","').'") '.$joinSearchComp.' GROUP BY tsh.acc_manager');
						$resSummary = $db->getFields();
				}
				else{
					$resSummary['aaData'] = array();
				}
			}
			else{
                //Executive report
                $db->selectQuery('1 AS id,
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
                        COALESCE(FORMAT(SUM(x.mtd_sales),2), "") AS total_mtd_sales,
                        COALESCE(FORMAT(SUM(x.mtd_cancelled),2), "") AS total_mtd_cancelled,
                        COALESCE(FORMAT(SUM(x.mtd_total),2), "") AS total_mtd_total,
                        COALESCE(FORMAT(SUM(x.ytd_sales),2), "") AS total_ytd_sales,
                        COALESCE(FORMAT(SUM(x.ytd_cancelled),2), "") AS total_ytd_cancelled,
                        COALESCE(FORMAT(SUM(x.ytd_total),2), "") AS total_ytd_total
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
            }


//Data fetched from mysqli.
$data = $db->getFields();

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();


// Add Headers
$objPHPExcel->setActiveSheetIndex(0)
						->setCellValue('A3', 'Name')
						->setCellValue('B3', 'Sales')
						->setCellValue('C3', 'Cancelled')
						->setCellValue('D3', 'Total')
						->setCellValue('E3', 'Sales')
						->setCellValue('F3', 'Cancelled')
						->setCellValue('G3', 'Total');

$sheet = $objPHPExcel->getActiveSheet();

$style = array(
	 'alignment' => array(
		'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
	 )
);

$sheet->setCellValue('B1',"FISCAL YEAR: {$year}");
$sheet->setCellValue('B2','MONTH: '.strtoupper($month));
//Merged Cells
$sheet->mergeCells('B1:D1');
$sheet->mergeCells('B2:D2');
$sheet->getStyle('B1:D1')->applyFromArray($style);
$sheet->getStyle('B2:D2')->applyFromArray($style);

$sheet->setCellValue('E2',"YTD: {$year}");
//Merged Cells
$sheet->mergeCells('E1:G1');
$sheet->mergeCells('E2:G2');
$sheet->getStyle('E1:G1')->applyFromArray($style);
$sheet->getStyle('E2:G2')->applyFromArray($style);

//Bold Column Headers
$sheet->getStyle('A3:G3')->getFont()->setBold(true);

// Miscellaneous glyphs, UTF-8
for ($i=0; $i < count($data['aaData']) ; $i++) { 
	$ii =  $i+4;
	$objPHPExcel->setActiveSheetIndex(0)
							->setCellValue('A'.$ii, $data['aaData'][$i]['acc_manager'])
							->setCellValue('B'.$ii, $data['aaData'][$i]['mtd_sales'])
							->setCellValue('C'.$ii, $data['aaData'][$i]['mtd_cancelled'])
							->setCellValue('D'.$ii, $data['aaData'][$i]['mtd_total'])
							->setCellValue('E'.$ii, $data['aaData'][$i]['ytd_sales'])
							->setCellValue('F'.$ii, $data['aaData'][$i]['ytd_cancelled'])
							->setCellValue('G'.$ii, $data['aaData'][$i]['ytd_total']);
}

// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Sales Summary');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

$dateNow = Utils::getSysDate();
// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition: attachment;filename= Sales Summary {$dateNow}.xlsx");
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

if($objWriter->save('php://output')){
	print Utils::jsonEncode(array('status'=>'success'));
}else{
	 print Utils::jsonEncode(array('status'=>'error'));
}
exit;