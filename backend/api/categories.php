<?php
/**
 * PERLE D'OR - API Categories
 * CRUD complet pour les catégories
 */

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Obtenir une catégorie spécifique
            $stmt = $db->prepare('SELECT * FROM categories WHERE id = ?');
            $stmt->execute([$id]);
            $category = $stmt->fetch();
            
            if (!$category) {
                Database::sendError('Catégorie non trouvée', 404);
            }
            
            // Compter les produits dans cette catégorie
            $stmt = $db->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
            $stmt->execute([$id]);
            $category['product_count'] = (int)$stmt->fetchColumn();
            
            Database::sendResponse($category);
        } else {
            // Liste des catégories avec compteur de produits
            $stmt = $db->query('
                SELECT c.*, COUNT(p.id) as product_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                GROUP BY c.id
                ORDER BY c.name
            ');
            $categories = $stmt->fetchAll();
            
            Database::sendResponse(['data' => $categories]);
        }
        break;
        
    case 'POST':
        Auth::requireAuth();
        $data = Database::getRequestData();
        
        if (empty($data['name'])) {
            Database::sendError('Nom de la catégorie requis', 400);
        }
        
        // Vérifier que la catégorie n'existe pas déjà
        $stmt = $db->prepare('SELECT id FROM categories WHERE name = ?');
        $stmt->execute([$data['name']]);
        if ($stmt->fetch()) {
            Database::sendError('Une catégorie avec ce nom existe déjà', 409);
        }
        
        $categoryId = Database::generateUUID();
        
        $stmt = $db->prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
        $stmt->execute([$categoryId, $data['name']]);
        
        Database::sendResponse([
            'id' => $categoryId,
            'message' => 'Catégorie créée avec succès'
        ], 201);
        break;
        
    case 'PUT':
        Auth::requireAuth();
        
        if (!$id) {
            Database::sendError('ID de la catégorie requis', 400);
        }
        
        $data = Database::getRequestData();
        
        if (empty($data['name'])) {
            Database::sendError('Nom de la catégorie requis', 400);
        }
        
        // Vérifier que la catégorie existe
        $stmt = $db->prepare('SELECT id FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            Database::sendError('Catégorie non trouvée', 404);
        }
        
        // Vérifier que le nouveau nom n'est pas déjà utilisé
        $stmt = $db->prepare('SELECT id FROM categories WHERE name = ? AND id != ?');
        $stmt->execute([$data['name'], $id]);
        if ($stmt->fetch()) {
            Database::sendError('Une catégorie avec ce nom existe déjà', 409);
        }
        
        $stmt = $db->prepare('UPDATE categories SET name = ? WHERE id = ?');
        $stmt->execute([$data['name'], $id]);
        
        Database::sendResponse(['message' => 'Catégorie mise à jour avec succès']);
        break;
        
    case 'DELETE':
        Auth::requireAuth();
        
        if (!$id) {
            Database::sendError('ID de la catégorie requis', 400);
        }
        
        // Vérifier s'il y a des produits dans cette catégorie
        $stmt = $db->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
        $stmt->execute([$id]);
        $productCount = $stmt->fetchColumn();
        
        if ($productCount > 0) {
            Database::sendError("Impossible de supprimer: $productCount produit(s) dans cette catégorie", 400);
        }
        
        $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            Database::sendError('Catégorie non trouvée', 404);
        }
        
        Database::sendResponse(['message' => 'Catégorie supprimée avec succès']);
        break;
        
    default:
        Database::sendError('Méthode non autorisée', 405);
}
