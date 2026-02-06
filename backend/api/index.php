<?php
/**
 * PERLE D'OR - Point d'entrée API
 * Router principal pour toutes les requêtes API
 */

define('PERLE_DOR', true);

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../Database.php';
require_once __DIR__ . '/../Auth.php';

// Obtenir la méthode et le chemin
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parser l'URL
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('/^\/api/', '', $path);
$segments = array_values(array_filter(explode('/', $path)));

// Router
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

switch ($resource) {
    case 'auth':
        require_once __DIR__ . '/auth.php';
        break;
        
    case 'products':
        require_once __DIR__ . '/products.php';
        break;
        
    case 'categories':
        require_once __DIR__ . '/categories.php';
        break;
        
    case 'settings':
        require_once __DIR__ . '/settings.php';
        break;
        
    case 'upload':
        require_once __DIR__ . '/upload.php';
        break;
        
    default:
        Database::sendError('Route non trouvée', 404);
}
