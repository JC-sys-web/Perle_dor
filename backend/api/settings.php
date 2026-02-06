<?php
/**
 * PERLE D'OR - API Settings
 * Gestion des paramètres du site
 */

$db = Database::getInstance();

switch ($method) {
    case 'GET':
        if ($id) {
            // Obtenir un paramètre spécifique
            $stmt = $db->prepare('SELECT * FROM settings WHERE setting_key = ?');
            $stmt->execute([$id]);
            $setting = $stmt->fetch();
            
            if (!$setting) {
                Database::sendError('Paramètre non trouvé', 404);
            }
            
            Database::sendResponse($setting);
        } else {
            // Liste de tous les paramètres
            $stmt = $db->query('SELECT * FROM settings ORDER BY setting_key');
            $settings = $stmt->fetchAll();
            
            // Transformer en objet clé-valeur
            $result = [];
            foreach ($settings as $setting) {
                $result[$setting['setting_key']] = $setting['setting_value'];
            }
            
            Database::sendResponse(['data' => $result]);
        }
        break;
        
    case 'PUT':
        Auth::requireAuth();
        
        $data = Database::getRequestData();
        
        if (empty($data)) {
            Database::sendError('Données requises', 400);
        }
        
        // Mettre à jour plusieurs paramètres
        $stmt = $db->prepare('
            INSERT INTO settings (setting_key, setting_value) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ');
        
        foreach ($data as $key => $value) {
            $stmt->execute([$key, $value]);
        }
        
        Database::sendResponse(['message' => 'Paramètres mis à jour avec succès']);
        break;
        
    default:
        Database::sendError('Méthode non autorisée', 405);
}
