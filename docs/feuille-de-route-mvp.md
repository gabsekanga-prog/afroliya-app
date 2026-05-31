# Feuille de route MVP — Afroliya (nouveau concept)

**Positionnement** : plateforme d’**expériences afro** en **Belgique** — **restaurants**, **événements** et **activités**.

**Promesse client** : *Découvrez et réservez vos activités afro* — explorez, réservez / achetez, laissez-vous guider par les avis.

**Promesse partenaire** : *Boostez votre visibilité auprès des amoureux des activités afro* — touchez une audience qualifiée, maximisez réservations et ventes, avec des **tarifs plus équitables**.

---

## 1. Périmètre MVP (fonctionnalités minimum)

### Ce qui entre dans le MVP

| Pilier | Fonctionnalité minimum | Critère de « done » |
|--------|------------------------|---------------------|
| **Découverte** | Catalogue unifié 3 types (restos, événements, activités) | Listes publiques + fiches détail exploitables |
| **Exploration** | « Pépites locales » (guides + mise en avant éditoriale) | Guides publiés + lien depuis le parcours expériences |
| **Restaurants — réservation** | Demande de réservation en quelques clics | Formulaire sur fiche resto → statut *en attente* → notification partenaire |
| **Événements / activités — achat** | Achat ou réservation de places (selon type) | Parcours simplifié (quantité, coordonnées, paiement ou validation manuelle MVP) |
| **Avis** | Avis consultables (Google + sélection Afroliya) | Affichage fiable sur les fiches ; pas obligatoire : avis déposés par les clients en MVP |
| **Communauté** | Captation email / communauté | Inscription newsletter opérationnelle |
| **Partenaires — acquisition** | Candidature multi-types (resto / événement / activité) | Formulaire + file admin |
| **Partenaires — visibilité** | Présence sur la plateforme (fiche publique) | Contenu géré via admin (MVP) ou mini back-office resto |
| **Partenaires — offre** | Grille tarifaire claire (Basique / Standard / Premium) | Page commerciale + process manuel de souscription en MVP |

### Hors MVP (V1+)

- Compte client complet (historique, favoris, profil)
- Avis déposés et modérés par la communauté (UGC)
- Espace partenaire self-service complet (tous types, analytics avancés)
- Facturation / abonnements automatisés (Stripe Billing)
- WhatsApp, notifications push, app mobile
- Recommandations personnalisées / IA
- Multi-villes au-delà de Bruxelles + périphérie

---

## 2. État actuel (février 2026)

### Déjà en place ✅

| Zone | Détail |
|------|--------|
| **Marketing & concept** | Page Concept, page « Trouver une expérience », page « Devenir partenaire » |
| **Restaurants** | Liste, filtres, fiches détail (menu, photos, horaires, carte, avis Google + avis Afroliya) |
| **Hub expériences** | Hero + cartes catégories + carrousels (aperçu 5 éléments / catégorie) |
| **Guides** | Index + fiches (pépites locales) + admin |
| **Communauté** | Inscription newsletter (Supabase) |
| **Partenaires** | Formulaire de candidature + liste admin |
| **Admin interne** | Gestion restaurants, guides, candidatures, tables génériques |
| **Événements / activités** | Pages liste + données **statiques** (démo) |

### Partiel / à finaliser ⚠️

| Zone | Gap |
|------|-----|
| **Réservation resto** | Schéma DB `reservations` existant ; **pas d’UI ni d’API publique** (widget « à venir ») |
| **Billetterie** | Aucun flux achat / paiement |
| **Événements & activités** | Pas de tables Supabase, pas de fiches `[slug]` |
| **Avis passionnés** | Lecture seule (curation admin) ; pas de contribution utilisateur |
| **Partenaires** | Formulaire orienté **restaurant** ; pas de type événement / activité |
| **Tarifs équitable** | Contenu marketing uniquement (pas de billing) |
| **Offres / deals** | Gérés en admin, **non affichés** sur les fiches publiques |

### Absent ❌

- Paiement (Stripe ou équivalent)
- Comptes partenaire (espace resto / organisateur)
- Gestion des créneaux (`service_slots`) et anti-surbooking
- Notifications email / SMS opérationnelles
- Suggestion d’adresse par un client (« Suggérer un resto »)

*Référence technique réservations : `docs/tickets-reservation-mvp.txt`*

---

## 3. Parcours cibles du MVP

### Côté client

```
Accueil (Concept)
    → Trouver une expérience (hub)
        → Restaurants | Événements | Activités
            → Fiche détail
                → Réserver (resto) / Acheter une place (événement, activité)
                → Lire les avis + guides liés
    → Rejoindre la communauté (newsletter)
```

**Bénéfices à couvrir :**

1. **Explorez des pépites locales** — guides + catalogue qualifié + recherche/filtres  
2. **Réservez et achetez en quelques clics** — parcours court, mobile-friendly, confirmation claire  
3. **Laissez-vous guider par les avis des passionnés** — Google + avis Afroliya visibles sur chaque fiche  

### Côté partenaire

```
Devenir partenaire
    → Choisir type (restaurant / événement / activité)
    → Formulaire candidature
    → Validation Afroliya (manuel MVP)
    → Mise en ligne fiche + (option) formule Basique / Standard / Premium
    → Réception demandes réservation / ventes (email + lien sécurisé MVP)
```

**Bénéfices à couvrir :**

1. **Touchez des milliers de passionnés** — visibilité catalogue + guides + SEO local  
2. **Maximisez réservations et ventes** — canaux de conversion sur la fiche  
3. **Profitez de tarifs plus équitables** — grille transparente, sans commission opaque cachée (message + process commercial MVP)  

---

## 4. Phases de livraison recommandées

### Phase 0 — Fondations contenu *(largement faite)*

**Objectif** : crédibilité du nouveau positionnement et trafic de découverte.

| # | Livrable | Statut |
|---|----------|--------|
| 0.1 | Pages Concept, Trouver une expérience, Devenir partenaire | ✅ |
| 0.2 | Navigation « Trouver une expérience » + fil d’Ariane | ✅ |
| 0.3 | Catalogue restaurants (Supabase) + admin | ✅ |
| 0.4 | Guides thématiques (pépites) | ✅ |
| 0.5 | Newsletter communauté | ✅ |
| 0.6 | Événements & activités : **données réelles** (remplacer le statique) | ❌ |

**Jalon** : un visiteur comprend les 3 piliers et trouve au moins un restaurant réel ; événements/activités ne sont plus du faux contenu.

---

### Phase 1 — Découverte multi-expériences

**Objectif** : *Explorez des pépites locales* sur les **3 catégories**.

| # | Livrable | Priorité |
|---|----------|----------|
| 1.1 | Schéma Supabase `events` et `activities` (champs alignés restos : titre, slug, lieu, image, description, actif, partenaire_id…) | P0 |
| 1.2 | Admin : CRUD événements & activités (réutiliser patterns restaurants) | P0 |
| 1.3 | Fiches publiques `/evenements/[slug]` et `/activites/[slug]` | P0 |
| 1.4 | Hub & listes branchées sur Supabase (fin des données `lib/experiences.ts` statiques) | P0 |
| 1.5 | Afficher les **deals / offres** sur fiches restaurant (données déjà en admin) | P1 |
| 1.6 | Liens croisés guides ↔ expériences (ex. guide « Soirées afro » → événements) | P2 |

**Jalon** : parcours découverte complet sans contenu factice ; SEO et partage de liens par fiche.

**Estimation** : 2–3 semaines (selon richesse des fiches).

---

### Phase 2 — Réservation restaurant (cœur transactionnel #1)

**Objectif** : *Réservez en quelques clics* pour les **restaurants**.

| # | Livrable | Priorité |
|---|----------|----------|
| 2.1 | Tables `service_slots` + compléter `reservations` (voir `docs/tickets-reservation-mvp.txt`) | P0 |
| 2.2 | API disponibilités + création demande (`pending`) + anti-surbooking | P0 |
| 2.3 | Widget réservation sur fiche restaurant (date, créneau, couverts, contact) | P0 |
| 2.4 | Page confirmation « Demande transmise » + email client | P0 |
| 2.5 | Notification partenaire : email (+ SMS si budget) avec lien d’action | P0 |
| 2.6 | Page / lien sécurisé partenaire : accepter / refuser / annuler | P0 |
| 2.7 | Respect du flag `bookable` (masquer widget si non réservable) | P1 |

**Décision produit MVP** (déjà actée dans le backlog technique) :

- Validation **manuelle** par le restaurant (pas de confirmation auto).
- Statuts : `pending` → `confirmed` | `declined` | `cancelled`.

**Jalon** : première réservation réelle traitée bout en bout.

**Estimation** : 3–4 semaines.

---

### Phase 3 — Billetterie événements & activités (cœur transactionnel #2)

**Objectif** : *Achetez vos tickets en quelques clics*.

| # | Livrable | Priorité |
|---|----------|----------|
| 3.1 | Modèle `ticket_offers` (prix, quota, dates, type : événement / activité) | P0 |
| 3.2 | Intégration paiement (ex. Stripe Checkout) — paiement carte MVP | P0 |
| 3.3 | Parcours achat : choix offre → quantité → paiement → confirmation | P0 |
| 3.4 | Alternative MVP sans paiement en ligne : demande de place + validation manuelle (comme restos) | P1 (si Stripe retardé) |
| 3.5 | Email billet / confirmation avec récap (QR optionnel V1.1) | P1 |
| 3.6 | Notification organisateur (nouvelle vente / demande) | P0 |

**Jalon** : premier ticket ou place vendu(e) / validé(e) sur un événement ou une activité pilote.

**Estimation** : 3–4 semaines (dont intégration paiement).

---

### Phase 4 — Confiance & avis (lecture renforcée)

**Objectif** : *Laissez-vous guider par les avis des passionnés* (MVP = **consulter**, pas encore publier).

| # | Livrable | Priorité |
|---|----------|----------|
| 4.1 | Bloc avis homogène sur les 3 types de fiches (Google + Afroliya) | P0 |
| 4.2 | Admin : gestion avis Afroliya pour événements & activités | P0 |
| 4.3 | Synthèse Google (Gemini / manuel) documentée pour tous les types | P1 |
| 4.4 | *(Post-MVP)* Dépôt d’avis par clients connectés + modération | V1 |

**Jalon** : chaque fiche affiche une preuve sociale claire et à jour.

**Estimation** : 1 semaine (hors UGC).

---

### Phase 5 — Partenaires : acquisition & visibilité

**Objectif** : *Rejoignez la plateforme* + *touchez des passionnés*.

| # | Livrable | Priorité |
|---|----------|----------|
| 5.1 | Formulaire partenaire : type (restaurant / événement / activité) + champs adaptés | P0 |
| 5.2 | Workflow admin : statuts candidature (nouveau, en cours, accepté, refusé) | P1 |
| 5.3 | Page « Nos offres » (Basique / Standard / Premium) reliée au parcours candidature | P1 |
| 5.4 | Process commercial MVP : contrat / onboarding manuel après acceptation | — (ops) |
| 5.5 | Mise en avant `sponsored` / carrousels « recommandés » (déjà partiel côté restos) | P2 |

**Jalon** : un organisateur d’événement peut candidater et être publié sans contournement admin restaurant-only.

**Estimation** : 1–2 semaines.

---

### Phase 6 — Partenaires : exploitation minimale (ventes & réservations)

**Objectif** : *Maximisez vos réservations et vos ventes*.

| # | Livrable | Priorité |
|---|----------|----------|
| 6.1 | « Espace partenaire » MVP : auth simple (magic link) par établissement | P0 |
| 6.2 | Tableau de bord : réservations / ventes du jour, actions en attente | P0 |
| 6.3 | Édition limitée fiche (texte, photo, horaires / dates) | P1 |
| 6.4 | Export CSV ou email récap hebdomadaire | P2 |

**Jalon** : un partenaire pilote gère ses demandes sans passer par l’admin Afroliya au quotidien.

**Estimation** : 3–4 semaines (après phases 2 et 3).

---

## 5. Synthèse : MVP « minimum » livrable

Pour considérer le **MVP nouveau concept** comme lancé, les critères suivants doivent être remplis :

| # | Critère |
|---|---------|
| 1 | **3 catalogues** alimentés en base (restaurants ✅, événements, activités) avec fiches détail |
| 2 | **Réservation restaurant** fonctionnelle (demande + réponse partenaire) |
| 3 | **Achat ou demande de place** sur au moins 1 événement et 1 activité pilotes |
| 4 | **Avis** visibles sur toutes les fiches (Google + sélection Afroliya) |
| 5 | **Candidature partenaire** ouverte aux 3 types |
| 6 | **Au moins 1 partenaire pilote** par type en production |
| 7 | **Newsletter** et pages marketing alignées sur le discours « expériences afro » |

**Ordre de priorité recommandé** : Phase 1 → Phase 2 → Phase 5 (en parallèle partiel) → Phase 3 → Phase 4 → Phase 6.

---

## 6. Indicateurs de succès (MVP)

| Indicateur | Cible indicative (3 mois post-lancement MVP) |
|------------|-----------------------------------------------|
| Fiches publiées | ≥ 30 restos, ≥ 10 événements, ≥ 10 activités |
| Demandes de réservation / ventes | ≥ 50 transactions traitées |
| Taux de réponse partenaire | ≥ 70 % sous 24 h |
| Inscriptions newsletter | ≥ 200 |
| Candidatures partenaires | ≥ 15, dont 5 publiées |

---

## 7. Risques & dépendances

| Risque | Mitigation |
|--------|------------|
| Scope billetterie + réservation trop large | Lancer restos (phase 2) avant paiement événements ; paiement manuel temporaire |
| Données événements / activités insuffisantes | 3–5 partenaires pilotes signés avant phase 1 |
| Charge admin (pas d’espace partenaire) | Limiter catalogue MVP ; phase 6 dès que volume > ~20 demandes / semaine |
| Paiement / RGPD | Stripe + mentions légales + CGV billetterie |

---

## 8. Cartographie rapide : discours → fonctionnalités

| Message marketing | Fonctionnalité MVP | Phase |
|-------------------|-------------------|-------|
| Vivez des expériences afro inoubliables | Hub + fiches 3 types | 0–1 |
| Restaurants, événements, activités | Catalogues + admin | 1 |
| Explorez des pépites locales | Guides + recherche / filtres | 0–1 |
| Réservez en quelques clics | Widget réservation resto | 2 |
| Achetez vos tickets en quelques clics | Checkout événements / activités | 3 |
| Avis des passionnés | Affichage avis Google + Afroliya | 4 |
| Boostez votre visibilité | Fiches partenaires + page Devenir partenaire | 0–5 |
| Touchez des milliers de passionnés | SEO, guides, newsletter, sponsoring | 0–5 |
| Maximisez réservations et ventes | Réservation + billetterie + notifs | 2–3–6 |
| Tarifs plus équitables | Grille Basique / Standard / Premium + process vente | 5 |

---

*Document généré pour le projet Afroliya — à faire évoluer avec les retours terrain et la capacité de l’équipe.*
