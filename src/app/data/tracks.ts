export interface Track {
  id: string;
  name: string;
  image: string;
  accentColor: string;
}

const IMG = {
  kartCircuit:   'https://images.unsplash.com/photo-1733575688972-fd5779ecb0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  tropheopolis:  'https://images.unsplash.com/photo-1767509727749-aea97a7f05e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  whistlestop:   'https://images.unsplash.com/photo-1768191414219-3b30958da1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  spaceport:     'https://images.unsplash.com/photo-1734126650058-623935bab140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  desert:        'https://images.unsplash.com/photo-1757353505413-143c1659948d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  souk:          'https://images.unsplash.com/photo-1713021714373-cd2600cfb097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  motocrossArena:'https://images.unsplash.com/photo-1758739956912-a6ea71cdad84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  flyingShip:    'https://images.unsplash.com/photo-1651481409013-42bca989a73c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  mountain:      'https://images.unsplash.com/photo-1765911564877-2bfa10acbecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  observatory:   'https://images.unsplash.com/photo-1518577589972-ad2d4f44eae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ice:           'https://images.unsplash.com/photo-1761639254238-32bc8bb35cf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  galleon:       'https://images.unsplash.com/photo-1638562782015-b8e3fc517221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  shoreBeach:    'https://images.unsplash.com/photo-1767829902288-18fc8d3fa652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  savanna:       'https://images.unsplash.com/photo-1759133387039-b15c6fd4099d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  peachBeach:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  saltyCity:     'https://images.unsplash.com/photo-1770546597338-3c008d294b12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  jungle:        'https://images.unsplash.com/photo-1758184238979-b1d5237d37c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  ruins:         'https://images.unsplash.com/photo-1765087910121-19148808bada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  waterfall:     'https://images.unsplash.com/photo-1759142761519-df737c6d0a47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  dandelion:     'https://images.unsplash.com/photo-1766898878019-afbb15b15c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  cinema:        'https://images.unsplash.com/photo-1686511868110-cdc64c179b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  dryBones:      'https://images.unsplash.com/photo-1593366426174-1ae8d787bd86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  meadow:        'https://images.unsplash.com/photo-1733390170834-53683303752b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  chocoMountain: 'https://images.unsplash.com/photo-1769542711963-7f2d38d2e542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  factory:       'https://images.unsplash.com/photo-1776090188275-72957bae4ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  castle:        'https://images.unsplash.com/photo-1764526448733-f43758cce3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  acornHeights:  'https://images.unsplash.com/photo-1633964361378-c3c56d2efd11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  peachStadium:  'https://images.unsplash.com/photo-1702991198821-d3a834ed43ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  rainbow:       'https://images.unsplash.com/photo-1709403906942-269c0626ac66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
};

export const ALL_TRACKS: Track[] = [
  { id: 'mk-01', name: 'Mario Bros',         image: IMG.kartCircuit,   accentColor: '#E52521' },
  { id: 'mk-02', name: 'Trophéopolis',        image: IMG.tropheopolis,  accentColor: '#FFD700' },
  { id: 'mk-03', name: 'Mont Tchou-Tchou',    image: IMG.whistlestop,   accentColor: '#5C6BC0' },
  { id: 'mk-04', name: 'Spatioport DK',       image: IMG.spaceport,     accentColor: '#7B1FA2' },
  { id: 'mk-05', name: 'Désert du Soleil',    image: IMG.desert,        accentColor: '#F57F17' },
  { id: 'mk-06', name: 'Souk Maskass',        image: IMG.souk,          accentColor: '#FF8F00' },
  { id: 'mk-07', name: 'Stade Wario',         image: IMG.motocrossArena,accentColor: '#827717' },
  { id: 'mk-08', name: 'Bateau Volant',       image: IMG.flyingShip,    accentColor: '#0288D1' },
  { id: 'mk-09', name: 'Alpes DK',            image: IMG.mountain,      accentColor: '#5C6BC0' },
  { id: 'mk-10', name: 'Pic Observatoire',    image: IMG.observatory,   accentColor: '#3949AB' },
  { id: 'mk-11', name: 'Cité Sorbet',         image: IMG.ice,           accentColor: '#4FC3F7' },
  { id: 'mk-12', name: 'Galion Wario',        image: IMG.galleon,       accentColor: '#795548' },
  { id: 'mk-13', name: 'Plage Koopa',         image: IMG.shoreBeach,    accentColor: '#00897B' },
  { id: 'mk-14', name: 'Savane Sauvage',      image: IMG.savanna,       accentColor: '#F9A825' },
  { id: 'mk-15', name: 'Plage Peach',         image: IMG.peachBeach,    accentColor: '#EC407A' },
  { id: 'mk-16', name: 'Cité Fleur de Sel',   image: IMG.saltyCity,     accentColor: '#29B6F6' },
  { id: 'mk-17', name: 'Jungle Dino Dino',    image: IMG.jungle,        accentColor: '#2E7D32' },
  { id: 'mk-18', name: 'Bloc Antique',        image: IMG.ruins,         accentColor: '#F57F17' },
  { id: 'mk-19', name: 'Chutes Cheep Cheep',  image: IMG.waterfall,     accentColor: '#00796B' },
  { id: 'mk-20', name: 'Gouffre Pissenlit',   image: IMG.dandelion,     accentColor: '#FDD835' },
  { id: 'mk-21', name: 'Cinéma Boo',          image: IMG.cinema,        accentColor: '#7B1FA2' },
  { id: 'mk-22', name: 'Fournaise Osseuse',   image: IMG.dryBones,      accentColor: '#BF360C' },
  { id: 'mk-23', name: 'Prairie Meuh Meuh',   image: IMG.meadow,        accentColor: '#558B2F' },
  { id: 'mk-24', name: 'Montagne Choco',      image: IMG.chocoMountain, accentColor: '#6D4C41' },
  { id: 'mk-25', name: 'Usine Toad',          image: IMG.factory,       accentColor: '#F57F17' },
  { id: 'mk-26', name: 'Château Bowser',      image: IMG.castle,        accentColor: '#B71C1C' },
  { id: 'mk-27', name: "Chemin du Chêne",     image: IMG.acornHeights,  accentColor: '#E65100' },
  { id: 'mk-28', name: 'Circuit Mario',       image: IMG.kartCircuit,   accentColor: '#E52521' },
  { id: 'mk-29', name: 'Stade Peach',         image: IMG.peachStadium,  accentColor: '#EC407A' },
  { id: 'mk-30', name: 'Route Arc-en-ciel',   image: IMG.rainbow,       accentColor: '#E91E63' },
];

// Legacy compat — nothing uses cups anymore but kept for safety
export interface Cup {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'nitro' | 'retro';
  tracks: Track[];
}
export const CUPS: Cup[] = [];
export const BASE_CUPS: Cup[] = [];
export const DLC_CUPS: Cup[] = [];

export function getCupForTrack(_trackId: string): Cup | undefined {
  return undefined;
}
