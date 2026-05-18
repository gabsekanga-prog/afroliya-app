/**
 * Prompt à copier dans Gemini (avec les photos du menu en pièce jointe).
 * Aligné sur le format CSV Afroliya et le formatage appliqué à l’import.
 */
export const GEMINI_MENU_CSV_PROMPT = `Tu es un assistant de saisie de cartes restaurant. À partir des images de menu jointes, extrais UNIQUEMENT le texte visible sur les photos. Ne invente aucun plat, prix ou catégorie.

Produis un fichier CSV UTF-8 avec exactement ces colonnes, dans cet ordre :
category,name,description,price

Règles générales :
- Séparateur : virgule. Si un champ contient une virgule, l’entourer de guillemets doubles.
- Une seule ligne d’en-tête (celle ci-dessus), puis les plats. Pas de markdown, pas de commentaires.
- Ordre : même ordre que sur le menu (haut → bas, gauche → droite).
- Si une zone est illisible, ignorer la ligne ou laisser description/price vide ; ne pas deviner.
- Conserver les accents et le français tel quel, après application des règles de casse ci-dessous.
- Si plusieurs images : traiter comme un seul menu continu.

Colonne category (section de l’accordéon) — OBJECTIF : LE MOINS DE SECTIONS POSSIBLE :
- Regrouper au maximum les rubriques proches ou de même nature. Ne pas créer une section par sous-titre du menu si un regroupement plus large est logique.
- Viser environ 4 à 8 sections au total pour un menu complet (souvent : Entrées, Plats, Desserts, Boissons — ajuster selon le menu réel).
- Fusionner systématiquement les variantes proches, par exemple :
  · « Entrées froides » + « Entrées chaudes » + « Tapas » → « Entrées »
  · « Poissons » + « Viandes » + « Grillades » + « Plats du jour » + « Spécialités » → « Plats »
  · « Accompagnements » + « Garnitures » + « Suppléments » → « Accompagnements »
  · « Desserts » + « Fromages » → « Desserts » (ou « Desserts et fromages » si les deux familles sont importantes)
  · « Boissons chaudes » + « Boissons fraîches » + « Cocktails » + « Vins » → « Boissons » (ou « Vins et boissons » si la carte est très vin-centrée)
  · « Formules » + « Menus » + « Lunch » → « Formules »
- Ne pas dupliquer une même famille sous plusieurs noms (ex. éviter « Entrée » et « Starter »).
- Choisir un libellé category court, clair et réutilisé sur toutes les lignes concernées.
- Casse : première lettre en MAJUSCULE, tout le reste en minuscules (ex. « ENTRÉES » → « Entrées », « PLATS DU JOUR » → « Plats » après fusion dans « Plats »).

Colonne name (nom du plat, obligatoire) :
- Casse : première lettre en MAJUSCULE, tout le reste en minuscules (ex. « MAFÉ POULET » → « Mafé poulet »).
- Pas de prix dans name.

Colonne description (optionnelle) :
- Ingrédients ou courte précision si lisible sur le menu ; sinon laisser vide.
- Même règle de casse que name (ex. « SAUCE ARACHIDE » → « Sauce arachide »).
- Restez concis ; pas de phrase marketing inventée.

Colonne price (optionnelle) :
- Montant tel qu’affiché, avec le symbole € en suffixe et un espace avant € (ex. « 12,50 € », « 16 € »).
- Utiliser la virgule décimale française si le menu l’utilise.
- Retirer « EUR », « euros », etc. ; garder uniquement le nombre + « € ».
- Si le prix est absent ou illisible, laisser la cellule vide (pas « N/A »).

Exemple :
category,name,description,price
Entrées,Alloco plantain,,8,50 €
Plats,Mafé poulet,Sauce arachide,16,00 €
Desserts,Sorbet mangue,,6 €`
