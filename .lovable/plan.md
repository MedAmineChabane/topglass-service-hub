
# Plan : Notifications Email pour les Demandes de Devis

## Objectif
Envoyer automatiquement un email de notification à **topglassfrance@gmail.com** ET **contact@topglassfrance.com** chaque fois qu'un nouveau formulaire de devis est soumis.

---

## Ce qui doit être fait

### 1. Enregistrer la clé API Resend
La clé API que tu as fournie (`re_2bwxmenn_...`) doit être enregistrée comme secret dans le projet. Je te demanderai de la saisir via le bouton qui apparaîtra.

### 2. Créer une Edge Function d'envoi d'email
Je vais créer une nouvelle fonction `send-lead-notification` qui :
- Reçoit les informations du lead (nom, email, téléphone, véhicule, etc.)
- Envoie un email formaté aux deux adresses

### 3. Appeler la fonction après soumission du formulaire
Je vais modifier le formulaire de devis (`Devis.tsx`) pour appeler cette fonction après l'insertion réussie du lead dans la base de données.

---

## Détails de l'email envoyé

**Destinataires :**
- topglassfrance@gmail.com
- contact@topglassfrance.com

**Contenu de l'email :**
- Nom complet du client
- Téléphone
- Email
- Véhicule (marque, modèle, type)
- Plaque d'immatriculation
- Localisation
- Type de service (vitrage/carrosserie)
- Description (si fournie)
- Lien vers l'admin pour voir le détail

---

## Section Technique

### Structure des fichiers

```text
supabase/functions/
├── check-rate-limit/
├── upload-lead-photo/
└── send-lead-notification/    <-- NOUVEAU
    └── index.ts
```

### Configuration requise

**Secret à ajouter :**
- Nom : `RESEND_API_KEY`
- Valeur : `re_2bwxmenn_86Hk2Y8Ud139cG8pmfVHzKx1`

**supabase/config.toml :**
```toml
[functions.send-lead-notification]
verify_jwt = false
```

### Flux d'exécution

```text
Utilisateur soumet le formulaire
         │
         ▼
   Insert lead en base
         │
         ▼
   Upload photos (si présentes)
         │
         ▼
   Appel send-lead-notification  ◄── NOUVEAU
         │
         ▼
   Email envoyé via Resend
         │
         ▼
   Confirmation à l'utilisateur
```

### Note importante
L'email sera envoyé depuis l'adresse par défaut de Resend (`onboarding@resend.dev`) car tu n'as pas de domaine vérifié. Pour utiliser une adresse `@topglassfrance.com`, tu devras vérifier ton domaine sur resend.com/domains.

---

## Estimation
Cette implémentation nécessite :
- 1 nouvelle edge function
- 1 modification du fichier Devis.tsx
- 1 mise à jour de config.toml
- 1 secret à enregistrer

