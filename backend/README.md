# PERLE D'OR - Backend PHP

## 📋 Prérequis

- PHP 8.0 ou supérieur
- MySQL 5.7+ ou MariaDB 10.3+
- Apache avec mod_rewrite activé (ou Nginx)
- Extension PHP: pdo_mysql, json, fileinfo

## 🚀 Installation

### 1. Base de données

```bash
# Connectez-vous à MySQL
mysql -u root -p

# Exécutez le script SQL
source /chemin/vers/database.sql
```

### 2. Configuration

Éditez le fichier `config.php` :

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'perle_dor');
define('DB_USER', 'votre_utilisateur');
define('DB_PASS', 'votre_mot_de_passe');
define('APP_URL', 'https://votre-domaine.com');
define('JWT_SECRET', 'votre_cle_secrete_tres_longue');
```

### 3. Permissions

```bash
# Créer le dossier uploads
mkdir -p uploads logs

# Permissions
chmod 755 uploads
chmod 755 logs
```

### 4. Configuration Apache

Assurez-vous que mod_rewrite est activé:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

## 📡 API Endpoints

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/verify` | Vérifier token |
| POST | `/api/auth/change-password` | Changer mot de passe |

### Produits

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste des produits |
| GET | `/api/products/{id}` | Détail d'un produit |
| POST | `/api/products` | Créer un produit* |
| PUT | `/api/products/{id}` | Modifier un produit* |
| DELETE | `/api/products/{id}` | Supprimer un produit* |

### Catégories

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/categories/{id}` | Détail d'une catégorie |
| POST | `/api/categories` | Créer une catégorie* |
| PUT | `/api/categories/{id}` | Modifier une catégorie* |
| DELETE | `/api/categories/{id}` | Supprimer une catégorie* |

### Paramètres

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/settings` | Tous les paramètres |
| PUT | `/api/settings` | Modifier les paramètres* |

### Upload

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/upload` | Uploader une image* |

\* Requiert authentification (header `Authorization: Bearer <token>`)

## 🔑 Exemples d'utilisation

### Connexion

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});
const { token } = await response.json();
```

### Créer un produit

```javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Nouveau Produit',
    price: 99.99,
    categoryId: 'cat-bijoux',
    description: 'Description du produit',
    images: ['https://example.com/image.jpg']
  })
});
```

### Filtrer les produits

```javascript
// Par catégorie
fetch('/api/products?category=cat-bijoux');

// Par recherche
fetch('/api/products?search=collier');

// Avec pagination
fetch('/api/products?page=1&limit=10');
```

## 🔒 Sécurité

- Changez le mot de passe admin par défaut
- Modifiez `JWT_SECRET` avec une clé forte
- Restreignez `CORS_ORIGIN` en production
- Utilisez HTTPS en production
- Désactivez `display_errors` en production

## 📁 Structure

```
backend/
├── api/
│   ├── index.php       # Router principal
│   ├── auth.php        # Authentification
│   ├── products.php    # CRUD Produits
│   ├── categories.php  # CRUD Catégories
│   ├── settings.php    # Paramètres
│   └── upload.php      # Upload images
├── uploads/            # Images uploadées
├── logs/               # Fichiers de log
├── config.php          # Configuration
├── Database.php        # Classe PDO
├── Auth.php            # Gestion JWT
├── database.sql        # Script SQL
├── .htaccess           # Config Apache
└── README.md           # Documentation
```

## 🔧 Dépannage

### Erreur 500
- Vérifiez les logs dans `logs/error.log`
- Vérifiez les permissions des fichiers
- Vérifiez la configuration PHP

### Erreur de connexion DB
- Vérifiez les identifiants dans `config.php`
- Vérifiez que MySQL est démarré
- Vérifiez que la base existe

### Erreur CORS
- Configurez `CORS_ORIGIN` correctement
- Vérifiez les headers dans votre frontend
