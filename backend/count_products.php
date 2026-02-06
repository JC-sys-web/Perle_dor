<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();
$stmt = $db->query('SELECT COUNT(*) as c FROM products');
$c = $stmt->fetch();
echo 'Products count: ' . $c['c'] . "\n";
?>