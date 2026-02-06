<?php
define('PERLE_DOR', true);

require_once 'config.php';
require_once 'Database.php';

$db = Database::getInstance();

$sql = file_get_contents('database.sql');

// Split into individual statements
$statements = array_filter(array_map('trim', explode(';', $sql)));

foreach ($statements as $statement) {
    if (!empty($statement) && !preg_match('/^--/', $statement)) {
        try {
            $db->exec($statement);
            echo "Executed: " . substr($statement, 0, 50) . "...\n";
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage() . "\n";
        }
    }
}

echo "Database setup complete.\n";
?>