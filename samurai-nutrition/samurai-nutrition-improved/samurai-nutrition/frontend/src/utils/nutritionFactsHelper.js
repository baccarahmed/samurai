/**
 * Utilitaire pour gérer la conversion des nutrition_facts entre le formulaire et l'affichage
 */

/**
 * Convertit une chaîne JSON en objet pour le formulaire
 * @param {string} jsonString - Chaîne JSON à convertir
 * @returns {Object} - Objet JavaScript
 */
export const parseNutritionFacts = (jsonString) => {
  if (!jsonString) return {};
  
  try {
    // Si c'est déjà un objet, on le retourne tel quel
    if (typeof jsonString === 'object') return jsonString;
    
    // Sinon on essaie de parser la chaîne JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Erreur lors du parsing des nutrition facts:', error);
    return {};
  }
};

/**
 * Convertit un objet en chaîne JSON pour l'API
 * @param {Object} nutritionObject - Objet à convertir
 * @returns {Object} - Objet prêt pour l'API
 */
export const stringifyNutritionFacts = (nutritionObject) => {
  if (!nutritionObject) return {};
  
  // Si c'est déjà une chaîne, on vérifie que c'est un JSON valide
  if (typeof nutritionObject === 'string') {
    try {
      return JSON.parse(nutritionObject);
    } catch (error) {
      console.error('Chaîne JSON invalide:', error);
      return {};
    }
  }
  
  // Sinon on retourne l'objet tel quel
  return nutritionObject;
};

/**
 * Normalise les nutrition_facts pour l'affichage dans la page de détail
 * @param {Object|string} nutritionFacts - Données nutritionnelles (objet ou chaîne JSON)
 * @returns {Object} - Objet normalisé pour l'affichage
 */
export const normalizeNutritionFacts = (nutritionFacts) => {
  // Si null ou undefined, retourner un objet vide
  if (!nutritionFacts) return {};
  
  // Si c'est une chaîne, essayer de la parser
  if (typeof nutritionFacts === 'string') {
    try {
      return JSON.parse(nutritionFacts);
    } catch (error) {
      console.error('Erreur lors de la normalisation des nutrition facts:', error);
      return {};
    }
  }
  
  // Si c'est déjà un objet, le retourner tel quel
  return nutritionFacts;
};