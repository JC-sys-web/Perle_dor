 /**
  * PERLE D'OR - Configuration API
  * Configuration centralisée pour l'API backend PHP
  */
 
 // Configuration
 export const apiConfig = {
   // URL de base de l'API PHP
   // À modifier selon votre environnement de déploiement
   baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
   
   // Timeout pour les requêtes (en ms)
   timeout: 30000,
   
   // Activer les logs de débogage
   debug: import.meta.env.DEV,
 };
