// Theme and Rank Definitions for RankStreak (Ranks 1 to 15)

export const RANKS = [
  {
    id: 1,
    name: 'Beginner',
    colorName: 'Emerald Green',
    accentHex: '#2ECC71',
    veinColor: '#2ECC71',
    glowColor: 'rgba(46, 204, 113, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #061f12 0%, #030a06 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, thin emerald-green glowing veins',
    effect: 'emerald_pulse',
    veinWidth: 1.5,
    quote: 'The journey of a thousand miles begins with a single check-in.'
  },
  {
    id: 2,
    name: 'Learner',
    colorName: 'Royal Blue',
    accentHex: '#4169E1',
    veinColor: '#4169E1',
    glowColor: 'rgba(65, 105, 225, 0.45)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #0a1438 0%, #04081c 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, royal blue glowing veins',
    effect: 'blue_waves',
    veinWidth: 1.8,
    quote: 'Consistency turns effort into effortless habit.'
  },
  {
    id: 3,
    name: 'Practitioner',
    colorName: 'Bright Cyan',
    accentHex: '#22D3EE',
    veinColor: '#22D3EE',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #072630 0%, #020f14 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, bright cyan glowing veins',
    effect: 'cyan_glow',
    veinWidth: 2.0,
    quote: 'Focus crystallizes momentum day by day.'
  },
  {
    id: 4,
    name: 'Adept',
    colorName: 'Azure Blue',
    accentHex: '#007FFF',
    veinColor: '#007FFF',
    glowColor: 'rgba(0, 127, 255, 0.55)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #041b36 0%, #020c1a 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, azure veins with faint diamond-glint particles',
    effect: 'diamond_glint',
    veinWidth: 2.2,
    quote: 'Sharpen your willpower like a diamond in the dark.'
  },
  {
    id: 5,
    name: 'Expert',
    colorName: 'Amethyst Purple',
    accentHex: '#9966CC',
    veinColor: '#9966CC',
    glowColor: 'rgba(153, 102, 204, 0.55)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #200f33 0%, #0e0517 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, amethyst-purple veins with crystal facets',
    effect: 'crystal_facets',
    veinWidth: 2.4,
    quote: 'Wisdom is forged in unbroken repetition.'
  },
  {
    id: 6,
    name: 'Master',
    colorName: 'Violet',
    accentHex: '#8B5CF6',
    veinColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #1c0f3d 0%, #0b051b 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, violet veins, faint floral particle accents',
    effect: 'floral_particles',
    veinWidth: 2.6,
    quote: 'True mastery is defined by resilience when challenged.'
  },
  {
    id: 7,
    name: 'Grandmaster',
    colorName: 'Golden Yellow',
    accentHex: '#FFD700',
    veinColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #302704 0%, #141001 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, golden veins with soft warm glow',
    effect: 'golden_warmth',
    veinWidth: 2.8,
    quote: 'Your aura radiates with golden discipline.'
  },
  {
    id: 8,
    name: 'Legend',
    colorName: 'Crimson Red',
    accentHex: '#DC143C',
    veinColor: '#DC143C',
    glowColor: 'rgba(220, 20, 60, 0.65)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #36050e 0%, #170105 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, crimson veins, pulsing glow effect',
    effect: 'heartbeat_pulse',
    veinWidth: 3.0,
    quote: 'Legends do not rest; they conquer the routine.'
  },
  {
    id: 9,
    name: 'Myth',
    colorName: 'Burnt Orange',
    accentHex: '#CC5500',
    veinColor: '#FF6600',
    glowColor: 'rgba(204, 85, 0, 0.65)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #361404 0%, #170701 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, burnt-orange veins, ember-spark particles',
    effect: 'ember_sparks',
    veinWidth: 3.2,
    quote: 'Like a phoenix rising from obsidian ash.'
  },
  {
    id: 10,
    name: 'Ascendant',
    colorName: 'Electric Blue',
    accentHex: '#7DF9FF',
    veinColor: '#7DF9FF',
    glowColor: 'rgba(125, 249, 255, 0.7)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #092f38 0%, #021217 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, electric-blue veins with lightning-flicker animation',
    effect: 'lightning_flicker',
    veinWidth: 3.4,
    quote: 'Surging beyond mortal discipline.'
  },
  {
    id: 11,
    name: 'Divine',
    colorName: 'Pearl White',
    accentHex: '#F5F5F0',
    veinColor: '#FFFFFF',
    glowColor: 'rgba(245, 245, 240, 0.75)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #29292e 0%, #101014 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, pearlescent white veins, soft holy glow',
    effect: 'holy_aura',
    veinWidth: 3.6,
    quote: 'Pure focus transcendent of earthly distraction.'
  },
  {
    id: 12,
    name: 'Immortal',
    colorName: 'Platinum Silver',
    accentHex: '#C0C0C0',
    veinColor: '#E0E0E0',
    glowColor: 'rgba(192, 192, 192, 0.75)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #26272b 0%, #0f1012 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, metallic silver veins, subtle shimmer sweep',
    effect: 'shimmer_sweep',
    veinWidth: 3.8,
    quote: 'Time bends before your unshakeable devotion.'
  },
  {
    id: 13,
    name: 'Deity',
    colorName: 'Divine Gold',
    accentHex: '#FFB700',
    veinColor: '#FFD700',
    glowColor: 'rgba(255, 183, 0, 0.8)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #473202 0%, #1c1300 60%, #000000 100%)',
    backgroundTreatment: 'Black obsidian base, thick radiant gold veins, light rays',
    effect: 'light_rays',
    veinWidth: 4.2,
    quote: 'Commanding reality through iron willpower.'
  },
  {
    id: 14,
    name: 'Overlord',
    colorName: 'Obsidian Stealth Black',
    accentHex: '#444444',
    veinColor: '#2B2B2B',
    glowColor: 'rgba(80, 80, 80, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #121212 0%, #080808 60%, #000000 100%)',
    backgroundTreatment: 'Pure obsidian, near-invisible dark-grey veins, minimal glow — stealth look',
    effect: 'stealth_dark',
    veinWidth: 1.2,
    quote: 'Silent, unseen, undeniable mastery.'
  },
  {
    id: 15,
    name: 'Primordial',
    colorName: 'Cosmic Black-Purple',
    accentHex: '#A855F7',
    veinColor: '#8A2BE2',
    glowColor: 'rgba(138, 43, 226, 0.85)',
    bgGradient: 'radial-gradient(circle at 50% 30%, #2b0847 0%, #0e021a 50%, #000000 100%)',
    backgroundTreatment: 'Obsidian base overlaid with a starfield/nebula texture, purple-black cosmic veins, twinkling star particles',
    effect: 'starfield_nebula',
    veinWidth: 4.5,
    quote: 'One with the cosmos. You have mastered eternity.'
  }
];

export function getRankConfig(rankLevel = 1) {
  const level = Math.max(1, Math.min(15, Number(rankLevel) || 1));
  return RANKS.find(r => r.id === level) || RANKS[0];
}
