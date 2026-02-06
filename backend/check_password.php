<?php
define('PERLE_DOR', true);
require_once 'config.php';

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "New hash for '$password': $hash\n";

// Check against old hash
$oldHash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
if (password_verify($password, $oldHash)) {
    echo "Old hash is correct\n";
} else {
    echo "Old hash is incorrect\n";
}
?>