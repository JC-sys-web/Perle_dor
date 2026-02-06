<?php
/**
 * PERLE D'OR - Configuration
 * Fichier de configuration de la base de données et paramètres globaux
 */

// Empêcher l'accès direct
if (!defined('PERLE_DOR')) {
    die('Accès direct interdit');
}

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'perle_dor');
define('DB_USER', 'root'); // À modifier en production!
define('DB_PASS', '');     // À modifier en production!
define('DB_CHARSET', 'utf8mb4');

// Configuration de l'application
define('APP_NAME', 'Perle d\'Or');
define('APP_URL', 'http://localhost:8000'); // À modifier en production
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB

// Configuration de sécurité
define('JWT_SECRET', 'votre_cle_secrete_a_changer_en_production_1234567890abcdef');
define('JWT_EXPIRY', 3600 * 24); // 24 heures
define('CORS_ORIGIN', '*'); // À restreindre en production

// Headers CORS et JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gestion des requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Configuration des erreurs (désactiver en production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Timezone
date_default_timezone_set('Europe/Paris');
