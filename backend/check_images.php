<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$stmt = $db->query('SELECT product_id, image_url FROM product_images LIMIT 5');
$images = $stmt->fetchAll();

echo "Sample images:\n";
foreach ($images as $img) {
    echo $img['product_id'] . ': ' . $img['image_url'] . "\n";
}
?>