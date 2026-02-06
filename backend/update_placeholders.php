<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

// Update placeholder images to use a real placeholder service
$stmt = $db->prepare("UPDATE product_images SET image_url = CONCAT('https://via.placeholder.com/400x400/', LPAD(FLOOR(RAND() * 999999), 6, '0'), '/ffffff/000000?text=Produit') WHERE image_url = '/placeholder.svg'");
$stmt->execute();

echo "Placeholder images updated to real URLs.\n";
?>