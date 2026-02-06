-- =============================================
-- PERLE D'OR - Script SQL Complet
-- Base de données pour le catalogue de produits
-- =============================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS perle_dor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE perle_dor;

-- =============================================
-- TABLE: categories
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: products
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_name (name),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: product_images
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: admins (pour l'authentification)
-- =============================================
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: settings (configuration du site)
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Catégories
INSERT INTO categories (id, name) VALUES
('cat-bijoux', 'Bijoux'),
('cat-montres', 'Montres'),
('cat-accessoires', 'Accessoires'),
('cat-sacs', 'Sacs'),
('cat-lunettes', 'Lunettes');

-- Administrateur par défaut (mot de passe: admin123 - À CHANGER EN PRODUCTION!)
INSERT INTO admins (id, username, password_hash, email) VALUES
('admin-1', 'admin', '$2y$10$9zQtpE9.BPW4wzxJTmnJP.Fv8Cvw1jGzorPBzP1A9GKUc5ArElJeO', 'admin@perle-dor.com');

-- Paramètres par défaut
INSERT INTO settings (setting_key, setting_value) VALUES
('whatsapp_number', '33612345678'),
('store_name', 'Perle d''Or'),
('store_email', 'contact@perle-dor.com'),
('store_address', 'Paris, France'),
('currency', 'EUR');

-- =============================================
-- PRODUITS DE DÉMONSTRATION
-- =============================================

-- Bijoux
INSERT INTO products (id, name, price, category_id, description) VALUES
('prod-1', 'Collier Élégance Dorée', 89.00, 'cat-bijoux', 'Un collier raffiné en plaqué or avec pendentif en cristal'),
('prod-2', 'Bracelet Charm Luxe', 65.00, 'cat-bijoux', 'Bracelet à breloques en argent sterling'),
('prod-3', 'Boucles Perles Naturelles', 120.00, 'cat-bijoux', 'Boucles d''oreilles avec perles de culture authentiques'),
('prod-4', 'Bague Diamant Étoile', 250.00, 'cat-bijoux', 'Bague en or blanc 18k avec diamant central'),
('prod-5', 'Pendentif Cœur Rubis', 180.00, 'cat-bijoux', 'Pendentif en forme de cœur avec rubis véritable'),
('prod-6', 'Chaîne Maille Royale', 95.00, 'cat-bijoux', 'Chaîne en or jaune 14k maille gourmette'),
('prod-7', 'Créoles Twisted Gold', 75.00, 'cat-bijoux', 'Créoles torsadées en plaqué or rose'),
('prod-8', 'Jonc Martelé Argent', 55.00, 'cat-bijoux', 'Jonc ouvert effet martelé en argent 925'),
('prod-9', 'Sautoir Perles Cascade', 145.00, 'cat-bijoux', 'Long sautoir avec cascade de perles nacrées'),
('prod-10', 'Bracelet Manchette Or', 110.00, 'cat-bijoux', 'Manchette large en plaqué or avec motifs géométriques'),
('prod-11', 'Bague Trilogy Emeraude', 320.00, 'cat-bijoux', 'Trois émeraudes serties sur or blanc'),
('prod-12', 'Collier Ras de Cou Velours', 45.00, 'cat-bijoux', 'Choker en velours avec médaillon doré');

-- Montres
INSERT INTO products (id, name, price, category_id, description) VALUES
('prod-13', 'Montre Classic Gold', 299.00, 'cat-montres', 'Montre classique avec bracelet en cuir et cadran doré'),
('prod-14', 'Chronographe Sport Elite', 450.00, 'cat-montres', 'Montre sportive avec fonctions chronographe'),
('prod-15', 'Montre Femme Diamants', 380.00, 'cat-montres', 'Élégante montre féminine sertie de diamants'),
('prod-16', 'Automatique Prestige', 650.00, 'cat-montres', 'Montre automatique mouvement suisse'),
('prod-17', 'Montre Slim Minimaliste', 199.00, 'cat-montres', 'Design épuré ultra-fin en acier brossé'),
('prod-18', 'Digital Smart Luxe', 275.00, 'cat-montres', 'Montre connectée avec finitions premium'),
('prod-19', 'Diver Professional 200m', 520.00, 'cat-montres', 'Montre de plongée étanche 200 mètres'),
('prod-20', 'Skeleton Transparent', 399.00, 'cat-montres', 'Cadran squelette révélant le mécanisme'),
('prod-21', 'Montre Vintage Cuir', 245.00, 'cat-montres', 'Style rétro avec bracelet cuir vieilli'),
('prod-22', 'Céramique Noire Mate', 340.00, 'cat-montres', 'Boîtier en céramique haute résistance'),
('prod-23', 'Montre Mesh Rosé', 165.00, 'cat-montres', 'Bracelet maille milanaise or rose'),
('prod-24', 'Tourbillon Excellence', 890.00, 'cat-montres', 'Complication tourbillon, édition limitée');

-- Accessoires
INSERT INTO products (id, name, price, category_id, description) VALUES
('prod-25', 'Écharpe Soie Cachemire', 89.00, 'cat-accessoires', 'Écharpe luxueuse mélange soie et cachemire'),
('prod-26', 'Ceinture Cuir Premium', 75.00, 'cat-accessoires', 'Ceinture en cuir pleine fleur boucle dorée'),
('prod-27', 'Foulard Imprimé Floral', 55.00, 'cat-accessoires', 'Carré de soie motifs floraux élégants'),
('prod-28', 'Gants Cuir Agneau', 95.00, 'cat-accessoires', 'Gants en cuir d''agneau doublés soie'),
('prod-29', 'Chapeau Fedora Feutre', 85.00, 'cat-accessoires', 'Fedora en feutre de laine ruban satin'),
('prod-30', 'Parapluie Design Gold', 65.00, 'cat-accessoires', 'Parapluie automatique manche plaqué or'),
('prod-31', 'Porte-cartes Cuir Grainé', 45.00, 'cat-accessoires', 'Étui à cartes en cuir grainé compact'),
('prod-32', 'Étole Pashmina Pure', 120.00, 'cat-accessoires', 'Pashmina 100% cachemire couleur nude'),
('prod-33', 'Boutons de Manchette Onyx', 85.00, 'cat-accessoires', 'Boutons de manchette onyx et argent'),
('prod-34', 'Broche Papillon Cristal', 65.00, 'cat-accessoires', 'Broche papillon ornée de cristaux Swarovski'),
('prod-35', 'Cravate Soie Tissée', 70.00, 'cat-accessoires', 'Cravate en soie tissée motif jacquard'),
('prod-36', 'Pochette de Costume', 35.00, 'cat-accessoires', 'Pochette assortie en soie imprimée');

-- Sacs
INSERT INTO products (id, name, price, category_id, description) VALUES
('prod-37', 'Sac Bandoulière Élégant', 189.00, 'cat-sacs', 'Sac à main bandoulière en cuir véritable'),
('prod-38', 'Pochette Soirée Strass', 95.00, 'cat-sacs', 'Clutch de soirée ornée de strass'),
('prod-39', 'Cabas Cuir Tressé', 245.00, 'cat-sacs', 'Grand cabas en cuir tressé artisanal'),
('prod-40', 'Mini Sac Chaîne Dorée', 135.00, 'cat-sacs', 'Petit sac avec chaîne en métal doré'),
('prod-41', 'Besace Bohème Chic', 165.00, 'cat-sacs', 'Sac besace style bohème en daim'),
('prod-42', 'Sac Seau Frangé', 155.00, 'cat-sacs', 'Sac seau avec franges en cuir souple'),
('prod-43', 'Cartable Vintage Luxe', 275.00, 'cat-sacs', 'Cartable rétro en cuir premium'),
('prod-44', 'Pochette Enveloppe', 85.00, 'cat-sacs', 'Pochette format enveloppe minimaliste'),
('prod-45', 'Sac à Dos Cuir City', 195.00, 'cat-sacs', 'Sac à dos urbain en cuir grainé'),
('prod-46', 'Hobo Bag Slouchy', 175.00, 'cat-sacs', 'Sac hobo souple et décontracté'),
('prod-47', 'Vanity Case Voyage', 145.00, 'cat-sacs', 'Vanity rigide pour accessoires beauté'),
('prod-48', 'Sac Bowling Bicolore', 165.00, 'cat-sacs', 'Sac bowling deux tons élégant');

-- Lunettes
INSERT INTO products (id, name, price, category_id, description) VALUES
('prod-49', 'Lunettes Aviateur Gold', 145.00, 'cat-lunettes', 'Aviateur classique monture dorée verres polarisés'),
('prod-50', 'Cat Eye Vintage', 125.00, 'cat-lunettes', 'Monture cat-eye style années 50'),
('prod-51', 'Wayfarer Premium', 135.00, 'cat-lunettes', 'Wayfarer en acétate haute qualité'),
('prod-52', 'Rondes John Lennon', 110.00, 'cat-lunettes', 'Lunettes rondes style iconique'),
('prod-53', 'Oversized Glamour', 155.00, 'cat-lunettes', 'Grandes lunettes effet glamour hollywoodien'),
('prod-54', 'Sport Wrap Elite', 175.00, 'cat-lunettes', 'Lunettes sport enveloppantes protection UV'),
('prod-55', 'Clip-on Magnétique', 95.00, 'cat-lunettes', 'Clip solaire magnétique universel'),
('prod-56', 'Monture Titane Light', 185.00, 'cat-lunettes', 'Ultra-légères en titane flexible'),
('prod-57', 'Lunettes Lecture Luxe', 65.00, 'cat-lunettes', 'Lunettes de lecture design élégant'),
('prod-58', 'Shield Futuriste', 165.00, 'cat-lunettes', 'Écran unique style futuriste'),
('prod-59', 'Browline Rétro', 130.00, 'cat-lunettes', 'Style clubmaster revisité'),
('prod-60', 'Transparentes Minimalistes', 115.00, 'cat-lunettes', 'Monture cristal transparente'),
('prod-61', 'Geometric Hexagone', 140.00, 'cat-lunettes', 'Forme hexagonale originale');

-- Images par défaut pour tous les produits
INSERT INTO product_images (id, product_id, image_url, sort_order)
SELECT 
    CONCAT('img-', products.id, '-1'),
    products.id,
    '/placeholder.svg',
    0
FROM products;
