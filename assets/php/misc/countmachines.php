<?php
/**
* 03/18/2017
*
* This file contains the json data format of total machines.
* 
*/

require_once '../database.php';
require_once '../utils.php';

$branch = Utils::getValue('branch');
$branchMachine = ($branch == '1' ? 'WHERE status_machine = 0 AND company_id > 0 ' : 'WHERE branches IN ('.$branch.') AND status_machine = 0 AND company_id > 0');
$branchCompany = ( $branch == '1' ? '' : ' WHERE id IN (SELECT DISTINCT id_company FROM tbl_company_branches WHERE id_branches IN ('.$branch.'))');


$db = Database::getInstance();
$db->selectQuery('count(id) as total_mif','tblmif '.$branchMachine.'');
$resMachine = $db->getFields();//Total MIF count.
$db->fields = null;

$db->selectQuery('SUM(STATUS =1 ) active,  SUM(STATUS =0 ) blocked','tbl_company'.$branchCompany.'');
$resClient = $db->getFields(); //Total client count.

$total   = number_format($resMachine['aaData'][0]['total_mif']);
$active  = number_format($resClient['aaData'][0]['active']);
$blocked = number_format($resClient['aaData'][0]['blocked']);

print Utils::jsonEncode(array($total, $active, $blocked));