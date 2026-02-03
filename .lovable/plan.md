

# Remplacement du Favicon par le Logo Topglass

## Objectif
Remplacer l'icône actuelle qui s'affiche dans l'onglet du navigateur par le logo Topglass pour renforcer l'identité visuelle de la marque.

---

## Ce qui sera fait

### 1. Mise à jour du fichier index.html
Ajouter les balises `<link>` nécessaires pour définir le favicon avec différentes tailles :
- **favicon.ico** : Pour la compatibilité avec les anciens navigateurs
- **apple-touch-icon** : Pour les appareils Apple (iPhone, iPad)
- **Favicon PNG** : Pour les navigateurs modernes

### 2. Utilisation du logo existant
Le logo `/assets/topglass-logo.png` sera utilisé comme favicon. Cela garantira que l'icône dans l'onglet du navigateur corresponde à votre branding.

---

## Résultat attendu
- L'icône dans l'onglet du navigateur affichera le logo Topglass
- L'icône sera visible sur tous les appareils (desktop, mobile, tablette)
- Si un utilisateur ajoute le site en favoris, le logo Topglass s'affichera

---

## Détails techniques

**Fichier modifié :** `index.html`

**Balises ajoutées :**
```html
<link rel="icon" type="image/png" href="/assets/topglass-logo.png" />
<link rel="apple-touch-icon" href="/assets/topglass-logo.png" />
```

