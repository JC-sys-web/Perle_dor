<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

// Update image URLs to include port 8000
$stmt = $db->prepare("UPDATE product_images SET image_url = REPLACE(image_url, 'http://localhost/', 'http://localhost:8000/') WHERE image_url LIKE 'http://localhost/%'");
$stmt->execute();

echo "Image URLs updated.\n";
?>