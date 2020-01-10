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

				//Get account manager name.
				$user_id = Utils::getValue('user_id');
				$db->selectQuery('firstname,lastname','tbl_accounts WHERE id = '.$user_id.' LIMIT 1');
				$resUser  = $db->getFields();
				$acc_mngr = strtoupper($resUser['aaData'][0]['lastname']." ".$resUser['aaData'][0]['firstname']);

				$db->fields = null; //empty the previous result.

				//Check if account manager is exist in sales summary table.
				$db->selectQuery('*','sap_db.tbl_sales_summary_auto_import WHERE acc_manager = "'.$acc_mngr.'" '.$searchComp.' LIMIT 1');
				$isExist  = $db->getFields();

				if(count($isExist['aaData']) > 0){
					$db->fields = null; //empty the previous result.

						$db->selectQuery('1 AS id,
											YEAR(tsh.doc_date) AS doc_year,
											tsh.acc_manager,
											FORMAT(SUM(tsh.gross), 2) AS mtd_gross,
											FORMAT(SUM(tsh.vat), 2) AS mtd_vat,
											FORMAT(SUM(tsh.net), 2) AS mtd_net,
											tsh2.ytd_gross,
											tsh2.ytd_vat,
											tsh2.ytd_net','sap_db.tbl_sales_summary_auto_import tsh  
										LEFT JOIN 
											(SELECT 
												acc_manager,
												FORMAT(SUM(gross), 2) AS ytd_gross,
												FORMAT(SUM(vat), 2) AS ytd_vat,
												FORMAT(SUM(net), 2) AS ytd_net 
											FROM
												sap_db.tbl_sales_summary_auto_import
											WHERE fiscal_year = '.$year.' AND acc_manager="'.$acc_mngr.'" '.$searchComp.'
											) tsh2 
											ON tsh.acc_manager = tsh2.acc_manager 
											 WHERE tsh.fiscal_year ='.$year.'
											 AND tsh.month ="'.ucfirst($month).'" AND tsh.acc_manager="'.$acc_mngr.'" '.$joinSearchComp.'');
						$data = $db->getFields();
				}
				else{
					$data['aaData'] = array();
				}
			}
			else{
					//Executive report
					$db->selectQuery('1 AS id,
								acc.acc_manager,
								COALESCE(mtd_gross, "") AS mtd_gross,
								COALESCE(mtd_vat, "") AS mtd_vat,
								COALESCE(mtd_net, "") AS mtd_net,
								COALESCE(ytd_gross, "") AS ytd_gross,
								COALESCE(ytd_vat, "") AS ytd_vat,
								COALESCE(ytd_net, "") AS ytd_net','sap_db.tbl_sales_summary_auto_import acc 
								 LEFT JOIN (
									SELECT 
									acc_manager,
									FORMAT(SUM(gross),2) AS mtd_gross,
									FORMAT(SUM(vat),2) AS mtd_vat,
									FORMAT(SUM(net),2) AS mtd_net 
								FROM
									sap_db.tbl_sales_summary_auto_import tsh
								WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'
								GROUP BY acc_manager 
								) tsh ON acc.acc_manager = tsh.acc_manager
								LEFT JOIN (
								SELECT 
									acc_manager,
									FORMAT(SUM(gross),2) AS ytd_gross,
									FORMAT(SUM(vat),2) AS ytd_vat,
									FORMAT(SUM(net),2) AS ytd_net
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
								FORMAT(SUM(x.mtd_gross),2) AS total_mtd_gross,
								FORMAT(SUM(x.mtd_vat),2) AS total_mtd_vat,
								FORMAT(SUM(x.mtd_net),2) AS total_mtd_net,
								FORMAT(SUM(x.ytd_gross),2) AS total_ytd_gross,
								FORMAT(SUM(x.ytd_vat),2) AS total_ytd_vat,
								FORMAT(SUM(x.ytd_net),2) AS total_ytd_net
								FROM (
								SELECT acc.acc_manager,
								mtd_vat,
								mtd_gross,
								mtd_net,
								ytd_gross,
								ytd_vat,
								ytd_net AS ytd_net FROM sap_db.tbl_sales_summary_auto_import acc 
								LEFT JOIN 
									(SELECT 
										acc_manager,
										SUM(gross) AS mtd_gross,
										SUM(vat) AS mtd_vat,
										SUM(net) AS mtd_net 
									FROM
										sap_db.tbl_sales_summary_auto_import tsh 
									WHERE fiscal_year = '.$year.' AND month="'.ucfirst($month).'" '.$searchComp.'
									GROUP BY acc_manager) tsh 
									ON acc.acc_manager = tsh.acc_manager 
								LEFT JOIN 
									(SELECT 
										acc_manager,
										SUM(gross) AS ytd_gross,
										SUM(vat) AS ytd_vat,
										SUM(net) AS ytd_net 
									FROM
										sap_db.tbl_sales_summary_auto_import 
									WHERE fiscal_year='.$year.' '.$searchComp.'
									GROUP BY acc_manager) tsh2 
									ON acc.acc_manager = tsh2.acc_manager
								 GROUP BY acc.acc_manager 
								ORDER BY acc.acc_manager) X ORDER BY id, acc_manager');
}


//Data fetched from mysqli.
$data = $db->getFields();

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();


// Add Headers
$objPHPExcel->setActiveSheetIndex(0)
						->setCellValue('A3', 'Name')
						->setCellValue('B3', 'Gross')
						->setCellValue('C3', 'Vat')
						->setCellValue('D3', 'Net')
						->setCellValue('E3', 'Gross')
						->setCellValue('F3', 'Vat')
						->setCellValue('G3', 'Net');

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
							->setCellValue('B'.$ii, $data['aaData'][$i]['mtd_gross'])
							->setCellValue('C'.$ii, $data['aaData'][$i]['mtd_vat'])
							->setCellValue('D'.$ii, $data['aaData'][$i]['mtd_net'])
							->setCellValue('E'.$ii, $data['aaData'][$i]['ytd_gross'])
							->setCellValue('F'.$ii, $data['aaData'][$i]['ytd_vat'])
							->setCellValue('G'.$ii, $data['aaData'][$i]['ytd_net']);
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