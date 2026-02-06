<?php
define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

try {
    $db->exec('ALTER TABLE product_images MODIFY image_url MEDIUMTEXT NOT NULL');
    echo "Altered product_images.image_url to MEDIUMTEXT\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>