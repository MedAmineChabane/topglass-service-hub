
# Correction des erreurs de validation du formulaire de devis

## Problème identifié

Les logs de la base de données montrent des erreurs de validation lors de la soumission du formulaire :

- **`leads_phone_format`** : Le numéro de téléphone doit correspondre au format `0XXXXXXXXX` (10 chiffres commençant par 0)
- **`leads_registration_format`** : L'immatriculation doit être au format `AA-123-BB` (avec tirets)

L'utilisateur peut saisir ces données dans des formats différents (espaces, pas de tirets, format international) qui ne sont pas transformés avant l'envoi à la base de données.

## Solution proposée

### 1. Normalisation du numéro de téléphone

Créer une fonction de normalisation qui :
- Supprime tous les espaces, points, tirets
- Convertit le format international (+33) en format national (0)
- Garde uniquement les 10 chiffres
- Affiche un message d'erreur si le format est invalide

### 2. Normalisation de l'immatriculation

Modifier la transformation pour :
- Supprimer tous les espaces et tirets existants
- Reformater automatiquement en `AA-123-BB`
- Valider que le format est correct avant soumission

### 3. Validation côté client

Ajouter une validation en temps réel avec messages d'erreur clairs :
- Indicateur visuel (bordure rouge) si le format est incorrect
- Message d'erreur explicatif sous le champ
- Blocage du bouton "Valider" si les données sont invalides

## Modifications techniques

### Fichier : `src/pages/Devis.tsx`

1. **Ajouter des fonctions de normalisation** (avant le composant) :

```typescript
// Normalise le téléphone au format 0XXXXXXXXX
const normalizePhone = (phone: string): string => {
  // Supprimer tout sauf les chiffres
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convertir +33 en 0
  if (cleaned.startsWith('+33')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('33') && cleaned.length > 10) {
    cleaned = '0' + cleaned.slice(2);
  }
  
  // Garder uniquement les 10 premiers chiffres
  return cleaned.slice(0, 10);
};

// Normalise l'immatriculation au format AA-123-BB
const normalizeRegistration = (reg: string): string => {
  // Supprimer tout sauf lettres et chiffres
  const cleaned = reg.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Si 7 caractères, formater avec tirets
  if (cleaned.length >= 7) {
    const letters1 = cleaned.slice(0, 2);
    const numbers = cleaned.slice(2, 5);
    const letters2 = cleaned.slice(5, 7);
    return `${letters1}-${numbers}-${letters2}`;
  }
  
  return cleaned;
};

// Validation du format téléphone
const isValidPhone = (phone: string): boolean => {
  return /^0[1-9][0-9]{8}$/.test(phone);
};

// Validation du format immatriculation
const isValidRegistration = (reg: string): boolean => {
  return /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(reg);
};
```

2. **Modifier le champ téléphone** (ligne ~815-821) :
- Appliquer la normalisation lors du changement
- Ajouter un état d'erreur visuel
- Afficher un message d'aide

3. **Modifier le champ immatriculation** (ligne ~410-416) :
- Appliquer la normalisation automatique avec tirets
- Afficher le format correct en temps réel

4. **Mettre à jour la fonction `handleSubmit`** (ligne ~259-268) :
- Utiliser les valeurs normalisées pour l'insertion
- Ajouter une validation finale avant soumission

5. **Améliorer la fonction `canProceed`** (ligne ~209-232) :
- Vérifier que le téléphone est au bon format
- Vérifier que l'immatriculation est valide

## Résultat attendu

- L'utilisateur peut saisir `06 12 34 56 78` ou `+33612345678` et le système le convertit en `0612345678`
- L'utilisateur peut saisir `AB123CD` et le système le convertit en `AB-123-CD`
- Les erreurs de validation sont affichées immédiatement avec des messages clairs en français
- Le formulaire ne peut pas être soumis si les données sont invalides
