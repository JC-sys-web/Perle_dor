<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$db->exec('ALTER TABLE product_images MODIFY image_url TEXT NOT NULL');

echo "Table altered: image_url changed to TEXT.\n";
?>