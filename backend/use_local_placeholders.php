<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$stmt = $db->prepare("UPDATE product_images SET image_url = '/logo.jpeg' WHERE image_url LIKE 'https://via.placeholder.com/%'");
$updated = $stmt->execute();

if ($updated) {
    echo "Updated placeholder images to /logo.jpeg\n";
} else {
    echo "No updates made or error.\n";
}

// Show sample rows
$stmt = $db->query("SELECT product_id, image_url FROM product_images LIMIT 10");
$rows = $stmt->fetchAll();
foreach ($rows as $r) {
    echo $r['product_id'] . ' -> ' . $r['image_url'] . "\n";
}
?>