<?php
/**
 * PERLE D'OR - Classe Auth
 * Gestion de l'authentification JWT
 */

class Auth {
    /**
     * Générer un token JWT
     */
    public static function generateToken(array $payload): string {
        $header = self::base64UrlEncode(json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]));
        
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
        );
        
        return "$header.$payloadEncoded.$signature";
    }
    
    /**
     * Vérifier un token JWT
     */
    public static function verifyToken(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        [$header, $payload, $signature] = $parts;
        
        // Vérifier la signature
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
        );
        
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }
        
        $data = json_decode(self::base64UrlDecode($payload), true);
        
        // Vérifier l'expiration
        if (!isset($data['exp']) || $data['exp'] < time()) {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Obtenir le token depuis les headers
     */
    public static function getTokenFromHeader(): ?string {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
    
    /**
     * Vérifier l'authentification (middleware)
     */
    public static function requireAuth(): array {
        $token = self::getTokenFromHeader();
        
        if (!$token) {
            Database::sendError('Token manquant', 401);
        }
        
        $payload = self::verifyToken($token);
        
        if (!$payload) {
            Database::sendError('Token invalide ou expiré', 401);
        }
        
        return $payload;
    }
    
    /**
     * Hasher un mot de passe
     */
    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    /**
     * Vérifier un mot de passe
     */
    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
    
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
