<?php



// require './assets/php/database.php';
require './assets/php/utils.php';


// $db = Database::getInstance();

// $db->selectQuery('id, password', 'tbl_accounts');
// $result = $db->getFields();

// //Decrypt each row by updating.
// foreach ($result['aaData'] as $key => $value) {
//     $db->updateQuery('tbl_accounts', 'password = "'.Utils::decrypt($value['password']).'"', 'id='.$value['id'].'');
// }

echo Utils::decrypt('2u6RiaCJ0UwShsMd12/D+7iuzoxhQnW0ACh2doYfTmA=');

