<?php
/**
 * PERLE D'OR - API Auth
 * Endpoints d'authentification
 */

$db = Database::getInstance();

switch ($method) {
    case 'POST':
        $action = $segments[1] ?? '';
        
        if ($action === 'login') {
            // Connexion
            $data = Database::getRequestData();
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                Database::sendError('Nom d\'utilisateur et mot de passe requis', 400);
            }
            
            $stmt = $db->prepare('SELECT * FROM admins WHERE username = ?');
            $stmt->execute([$username]);
            $admin = $stmt->fetch();
            
            if (!$admin || !Auth::verifyPassword($password, $admin['password_hash'])) {
                Database::sendError('Identifiants incorrects', 401);
            }
            
            // Mettre à jour la dernière connexion
            $stmt = $db->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?');
            $stmt->execute([$admin['id']]);
            
            $token = Auth::generateToken([
                'id' => $admin['id'],
                'username' => $admin['username']
            ]);
            
            Database::sendResponse([
                'token' => $token,
                'user' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email']
                ]
            ]);
        }
        
        if ($action === 'verify') {
            // Vérifier le token
            $user = Auth::requireAuth();
            Database::sendResponse(['valid' => true, 'user' => $user]);
        }
        
        if ($action === 'change-password') {
            // Changer le mot de passe
            $user = Auth::requireAuth();
            $data = Database::getRequestData();
            
            $currentPassword = $data['currentPassword'] ?? '';
            $newPassword = $data['newPassword'] ?? '';
            
            if (empty($currentPassword) || empty($newPassword)) {
                Database::sendError('Mots de passe requis', 400);
            }
            
            if (strlen($newPassword) < 8) {
                Database::sendError('Le nouveau mot de passe doit contenir au moins 8 caractères', 400);
            }
            
            $stmt = $db->prepare('SELECT password_hash FROM admins WHERE id = ?');
            $stmt->execute([$user['id']]);
            $admin = $stmt->fetch();
            
            if (!Auth::verifyPassword($currentPassword, $admin['password_hash'])) {
                Database::sendError('Mot de passe actuel incorrect', 401);
            }
            
            $newHash = Auth::hashPassword($newPassword);
            $stmt = $db->prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
            $stmt->execute([$newHash, $user['id']]);
            
            Database::sendResponse(['message' => 'Mot de passe modifié avec succès']);
        }
        
        Database::sendError('Action non reconnue', 400);
        break;
        
    default:
        Database::sendError('Méthode non autorisée', 405);
}
