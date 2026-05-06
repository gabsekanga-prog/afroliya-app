-- Structure fixe par guide : intro + sous-sections (JSON)
alter table public.guides add column if not exists intro text;

alter table public.guides add column if not exists subsections jsonb not null default '[]'::jsonb;

comment on column public.guides.intro is 'Texte d introduction du guide (affiché sous le hero).';

comment on column public.guides.subsections is
  'Tableau JSON : [{ title, image_src, image_alt, description, href, button_label }]';

update public.guides
set intro = coalesce(intro, excerpt)
where intro is null and excerpt is not null;

update public.guides
set
  intro = 'Découvrez une sélection de tables camerounaises bien notées pour savourer ndolé, poisson braisé et plats mijotés à Bruxelles.',
  subsections = $$
[
  {
    "title": "Mama Douala",
    "image_src": "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    "image_alt": "Ambiance restaurant Mama Douala",
    "description": "Cuisine camerounaise maison à Saint-Gilles : produits frais, portions généreuses et accueil familial.",
    "href": "/reserver-un-restaurant/mama-douala",
    "button_label": "Voir Mama Douala"
  },
  {
    "title": "Kin Saveurs",
    "image_src": "/images/Nourriture%20congolaise.jpg",
    "image_alt": "Plats afro maison",
    "description": "Pour varier les saveurs d Afrique centrale avec grillades et spécialités maison.",
    "href": "/reserver-un-restaurant/kin-saveurs",
    "button_label": "Voir Kin Saveurs"
  }
]
$$::jsonb
where slug = 'restaurants-camerounais-bruxelles';

update public.guides
set
  intro = 'Petites tables intimistes, cadres cosy ou ambiance tamisée : nos idées pour un dîner en deux à Bruxelles.',
  subsections = $$
[
  {
    "title": "Africalicious",
    "image_src": "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80",
    "image_alt": "Table dressée dans un restaurant cosy",
    "description": "Une adresse conviviale pour partager des assiettes généreuses dans une ambiance chaleureuse.",
    "href": "/reserver-un-restaurant/africalicious",
    "button_label": "Réserver Africalicious"
  },
  {
    "title": "Le Baobab",
    "image_src": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    "image_alt": "Salle de restaurant élégante",
    "description": "Classiques sénégalais et cadre apaisant à Ixelles, idéal pour prendre son temps.",
    "href": "/reserver-un-restaurant/le-baobab",
    "button_label": "Voir Le Baobab"
  }
]
$$::jsonb
where slug = 'diner-amoureux-restaurants-africains-bruxelles';

update public.guides
set
  intro = 'From makayabu aux grills maison : nos adresses congolaises les mieux notées à Bruxelles et aux portes de la ville.',
  subsections = $$
[
  {
    "title": "Africalicious",
    "image_src": "/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp",
    "image_alt": "Restaurant Africalicious Bruxelles",
    "description": "Saveurs congolaises authentiques et équipe attentive au cœur de Bruxelles.",
    "href": "/reserver-un-restaurant/africalicious",
    "button_label": "Voir Africalicious"
  },
  {
    "title": "Kin Saveurs",
    "image_src": "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=80",
    "image_alt": "Plats grillés maison",
    "description": "Grillades, ambiance festive et cuisine généreuse à Molenbeek.",
    "href": "/reserver-un-restaurant/kin-saveurs",
    "button_label": "Voir Kin Saveurs"
  }
]
$$::jsonb
where slug = 'restaurants-congolais-bruxelles';
