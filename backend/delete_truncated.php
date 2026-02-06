<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

// Delete truncated base64 images (shorter than 1000 chars, assuming valid ones are longer)
$stmt = $db->prepare("DELETE FROM product_images WHERE image_url LIKE 'data:image/%' AND LENGTH(image_url) < 1000");
$stmt->execute();

echo "Truncated base64 images deleted.\n";
?>