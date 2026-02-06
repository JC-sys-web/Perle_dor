<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare('UPDATE admins SET password_hash = ? WHERE username = ?');
$stmt->execute([$hash, 'admin']);

echo "Admin password updated to 'admin123'\n";
?>