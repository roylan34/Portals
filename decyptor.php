<?php




require './assets/php/database.php';
require './assets/php/utils.php';


$db = Database::getInstance();

$db->selectQuery('id, password', 'tbl_accounts');
$result = $db->getFields();

//Encrypt each row by updating.
foreach ($result['aaData'] as $key => $value) {
    $db->updateQuery('tbl_accounts', 'password = "'.Utils::encrypt($value['password']).'"', 'id='.$value['id'].'');
}
