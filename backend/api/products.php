<?php
/**
 * PERLE D'OR - API Products
 * CRUD complet pour les produits
 */

$db = Database::getInstance();

try {
    switch ($method) {
    case 'GET':
        if ($id) {
            // Obtenir un produit spécifique
            $stmt = $db->prepare('
                SELECT p.*, c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
            ');
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            
            if (!$product) {
                Database::sendError('Produit non trouvé', 404);
            }
            
            // Récupérer les images
            $stmt = $db->prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order');
            $stmt->execute([$id]);
            $product['images'] = array_column($stmt->fetchAll(), 'image_url');
            
            Database::sendResponse($product);
        } else {
            // Liste des produits avec filtres
            $categoryId = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = max(1, min(100, intval($_GET['limit'] ?? 10)));
            $offset = ($page - 1) * $limit;
            
            $where = [];
            $params = [];
            
            if ($categoryId) {
                $where[] = 'p.category_id = ?';
                $params[] = $categoryId;
            }
            
            if ($search) {
                $where[] = '(p.name LIKE ? OR p.description LIKE ?)';
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
            
            // Compter le total
            $stmt = $db->prepare("SELECT COUNT(*) FROM products p $whereClause");
            $stmt->execute($params);
            $total = $stmt->fetchColumn();
            
            // Récupérer les produits
            $stmt = $db->prepare("
                SELECT p.*, c.name as category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                $whereClause
                ORDER BY p.created_at DESC
                LIMIT $limit OFFSET $offset
            ");
            $stmt->execute($params);
            $products = $stmt->fetchAll();
            
            // Récupérer les images pour chaque produit
            foreach ($products as &$product) {
                $stmt = $db->prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order');
                $stmt->execute([$product['id']]);
                $product['images'] = array_column($stmt->fetchAll(), 'image_url');
            }
            
            Database::sendResponse([
                'data' => $products,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => (int)$total,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        }
        break;
        
    case 'POST':
        Auth::requireAuth();
        $data = Database::getRequestData();
        
        // Validation
        if (empty($data['name']) || !isset($data['price']) || empty($data['categoryId'])) {
            Database::sendError('Nom, prix et catégorie requis', 400);
        }
        
        $productId = Database::generateUUID();
        
        $stmt = $db->prepare('
            INSERT INTO products (id, name, price, category_id, description)
            VALUES (?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $productId,
            $data['name'],
            floatval($data['price']),
            $data['categoryId'],
            $data['description'] ?? ''
        ]);
        
        // Ajouter les images
        if (!empty($data['images'])) {
            $stmt = $db->prepare('INSERT INTO product_images (id, product_id, image_url, sort_order) VALUES (?, ?, ?, ?)');
            foreach ($data['images'] as $index => $url) {
                $stmt->execute([Database::generateUUID(), $productId, $url, $index]);
            }
        }
        
        Database::sendResponse([
            'id' => $productId,
            'message' => 'Produit créé avec succès'
        ], 201);
        break;
        
    case 'PUT':
        Auth::requireAuth();
        
        if (!$id) {
            Database::sendError('ID du produit requis', 400);
        }
        
        $data = Database::getRequestData();
        
        // Vérifier que le produit existe
        $stmt = $db->prepare('SELECT id FROM products WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Database::sendError('Produit non trouvé', 404);
        }
        
        // Construire la requête de mise à jour
        $updates = [];
        $params = [];
        
        if (isset($data['name'])) {
            $updates[] = 'name = ?';
            $params[] = $data['name'];
        }
        if (isset($data['price'])) {
            $updates[] = 'price = ?';
            $params[] = floatval($data['price']);
        }
        if (isset($data['categoryId'])) {
            $updates[] = 'category_id = ?';
            $params[] = $data['categoryId'];
        }
        if (isset($data['description'])) {
            $updates[] = 'description = ?';
            $params[] = $data['description'];
        }
        
        if ($updates) {
            $params[] = $id;
            $stmt = $db->prepare('UPDATE products SET ' . implode(', ', $updates) . ' WHERE id = ?');
            $stmt->execute($params);
        }
        
        // Mettre à jour les images si fournies
        if (isset($data['images'])) {
            // Supprimer les anciennes images
            $stmt = $db->prepare('DELETE FROM product_images WHERE product_id = ?');
            $stmt->execute([$id]);
            
            // Ajouter les nouvelles
            $stmt = $db->prepare('INSERT INTO product_images (id, product_id, image_url, sort_order) VALUES (?, ?, ?, ?)');
            foreach ($data['images'] as $index => $url) {
                $stmt->execute([Database::generateUUID(), $id, $url, $index]);
            }
        }
        
        Database::sendResponse(['message' => 'Produit mis à jour avec succès']);
        break;
        
    case 'DELETE':
        Auth::requireAuth();
        
        if (!$id) {
            Database::sendError('ID du produit requis', 400);
        }
        
        $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            Database::sendError('Produit non trouvé', 404);
        }
        
        Database::sendResponse(['message' => 'Produit supprimé avec succès']);
        break;
        
    default:
        Database::sendError('Méthode non autorisée', 405);
    }
} catch (Exception $e) {
    // Log and return a JSON error message for unexpected exceptions
    error_log('[products.php] ' . $e->getMessage());
    Database::sendError('Internal Server Error', 500);
}
