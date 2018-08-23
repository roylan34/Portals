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

$search ="";
$db = Database::getInstance();
 if(Utils::getValue('form_no'))		{ $search = $db->escapeString(Utils::getValue('form_no')); }

//Data fetched from mysqli.
$db->storProc('explode_serialnum',$search);
$data = $db->getFields();

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// // Set document properties
// $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
// 							 ->setLastModifiedBy("Maarten Balliauw")
// 							 ->setTitle("Office 2007 XLSX Test Document")
// 							 ->setSubject("Office 2007 XLSX Test Document")
// 							 ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
// 							 ->setKeywords("office 2007 openxml php")
// 							 ->setCategory("Test result file");

// Add Headers
$objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'Company name')
            ->setCellValue('B1', 'Serial Number')
            ->setCellValue('C1', 'Brand')
            ->setCellValue('D1', 'Model');

// Miscellaneous glyphs, UTF-8
for ($i=0; $i < count($data['aaData']) ; $i++) { 
	$ii = $i+2;
	$objPHPExcel->setActiveSheetIndex(0)
	            ->setCellValue('A'.$ii, $data['aaData'][$i]['company'])
	            ->setCellValue('B'.$ii, $data['aaData'][$i]['serialnum'])
	            ->setCellValue('C'.$ii, $data['aaData'][$i]['brand'])
	            ->setCellValue('D'.$ii, $data['aaData'][$i]['model']);
}

// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Machine Delivered');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="'.$search.'".xlsx');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;
