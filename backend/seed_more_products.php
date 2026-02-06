<?php
/**
 * Script d'insertion de produits de démonstration
 * Insère 60 produits avec images placeholder
 */

define('PERLE_DOR', true);
require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$categories = [];
$stmt = $db->query('SELECT id FROM categories');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) $categories[] = $r['id'];
if (empty($categories)) {
    echo "Pas de catégories trouvées. Créez d'abord des catégories.\n";
    exit;
}

$insertProduct = $db->prepare('INSERT INTO products (id, name, price, category_id, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
$insertImage = $db->prepare('INSERT INTO product_images (id, product_id, image_url, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())');

$count = 60;
for ($i = 1; $i <= $count; $i++) {
    $prodId = Database::generateUUID();
    $name = "Produit de démonstration #" . ($i + 100); // offset to avoid clash with existing names
    $price = rand(10, 999) + (rand(0,99)/100);
    $category = $categories[array_rand($categories)];
    $desc = "Description générique pour $name";

    try {
        $insertProduct->execute([$prodId, $name, $price, $category, $desc]);

        // Ajouter 1 à 3 images placeholder par produit
        $imagesCount = rand(1,3);
        for ($j = 0; $j < $imagesCount; $j++) {
            $imgId = Database::generateUUID();
            // Utiliser via.placeholder.com pour images valides
            $imageUrl = 'https://via.placeholder.com/800x800.png?text=' . urlencode($name . ' ' . ($j+1));
            $insertImage->execute([$imgId, $prodId, $imageUrl, $j]);
        }

        echo "Inserted: $name (ID: $prodId)\n";
    } catch (Exception $e) {
        echo "Erreur insertion produit $name: " . $e->getMessage() . "\n";
    }
}

echo "Done. Inserted $count products.\n";
?>