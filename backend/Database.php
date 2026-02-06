<?php
/**
 * PERLE D'OR - Classe Database
 * Gestion de la connexion PDO à MySQL
 */

class Database {
    private static ?PDO $instance = null;
    
    /**
     * Obtenir l'instance de connexion (Singleton)
     */
    public static function getInstance(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf(
                    'mysql:host=%s;dbname=%s;charset=%s',
                    DB_HOST,
                    DB_NAME,
                    DB_CHARSET
                );
                
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                self::sendError('Erreur de connexion à la base de données', 500);
            }
        }
        return self::$instance;
    }
    
    /**
     * Générer un UUID v4
     */
    public static function generateUUID(): string {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    
    /**
     * Envoyer une réponse JSON
     */
    public static function sendResponse(array $data, int $status = 200): void {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Envoyer une erreur JSON
     */
    public static function sendError(string $message, int $status = 400): void {
        http_response_code($status);
        echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    /**
     * Obtenir les données JSON de la requête
     */
    public static function getRequestData(): array {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        return $data ?? [];
    }
}
