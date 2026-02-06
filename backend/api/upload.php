<?php
/**
 * PERLE D'OR - API Upload
 * Gestion des uploads d'images
 */

Auth::requireAuth();

if ($method !== 'POST') {
    Database::sendError('Méthode non autorisée', 405);
}

if (!isset($_FILES['image'])) {
    Database::sendError('Aucune image fournie', 400);
}

$file = $_FILES['image'];

// Vérifications
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => 'Fichier trop volumineux (limite serveur)',
        UPLOAD_ERR_FORM_SIZE => 'Fichier trop volumineux (limite formulaire)',
        UPLOAD_ERR_PARTIAL => 'Upload incomplet',
        UPLOAD_ERR_NO_FILE => 'Aucun fichier envoyé',
        UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
        UPLOAD_ERR_CANT_WRITE => 'Impossible d\'écrire le fichier',
        UPLOAD_ERR_EXTENSION => 'Extension PHP a bloqué l\'upload'
    ];
    Database::sendError($errors[$file['error']] ?? 'Erreur d\'upload inconnue', 400);
}

// Vérifier la taille
if ($file['size'] > MAX_UPLOAD_SIZE) {
    Database::sendError('Fichier trop volumineux (max 5MB)', 400);
}

// Vérifier le type MIME
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

if (!in_array($mimeType, $allowedTypes)) {
    Database::sendError('Type de fichier non autorisé (JPG, PNG, GIF, WEBP uniquement)', 400);
}

// Créer le dossier d'upload si nécessaire
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Générer un nom de fichier unique
$extension = match($mimeType) {
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
    default => 'jpg'
};

$filename = uniqid('img_') . '_' . time() . '.' . $extension;
$filepath = UPLOAD_DIR . $filename;

// Déplacer le fichier
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    Database::sendError('Erreur lors de l\'enregistrement du fichier', 500);
}

// Retourner l'URL de l'image
$imageUrl = APP_URL . '/uploads/' . $filename;

Database::sendResponse([
    'url' => $imageUrl,
    'filename' => $filename,
    'size' => $file['size'],
    'type' => $mimeType
], 201);
