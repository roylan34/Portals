<?php

require_once '../database.php';
require_once '../utils.php';


$id = Utils::getValue('id_reservation');
$conn = Database::getInstance(); //For Searching.

if($id){

    $conn->selectQuery('ir.serial_number, CONCAT(ac.firstname," ", ac.lastname) AS acct_mngr, c.company_name, ir.date_reserved, ir.created_at','tbl_invnt_reservation ir 
        LEFT JOIN tbl_company c ON ir.id_company = c.id
        LEFT JOIN sap_db.tbl_client_accounts ca ON ir.id_acc_mngr = ca.id
        LEFT JOIN tbl_accounts ac ON ca.account_id = ac.id
        WHERE ir.id = '.$id.' LIMIT 1');
        $row = $conn->getFields(); 
        print Utils::jsonEncode($row);  // send data as json format.
                                      
}else{
    throw new Exception('ID argument is missing.');
}


