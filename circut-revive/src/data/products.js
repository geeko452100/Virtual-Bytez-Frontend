/**
 * Vintage tech catalog with per-product customization schemas.
 * Each option drives price via `priceModifier` (flat add-on in USD).
 */

import { PRODUCT_IMAGES } from './productImages'

export const CATEGORIES = [
  { id: 'computers', label: 'Computers' },
  { id: 'audio', label: 'Audio' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'peripherals', label: 'Peripherals' },
]

export const seedProducts = [
  {
    id: 'c64',
    name: 'Commodore 64',
    era: '1982',
    category: 'computers',
    basePrice: 249,
    description:
      'The best-selling home computer of all time. Choose your finish, storage expansion, and optional peripherals.',
    condition: 'Refurbished',
    conditionGrade: 7,
    imageUrl: PRODUCT_IMAGES.c64,
    stockCount: 12,
    customizationOptions: [
      {
        id: 'finish',
        label: 'Case finish',
        type: 'select',
        defaultValue: 'original-beige',
        choices: [
          { value: 'original-beige', label: 'Original beige', priceModifier: 0 },
          { value: 'patina', label: 'Aged patina (sun-yellowed)', priceModifier: 0 },
          { value: 'restored-black', label: 'Restored matte black', priceModifier: 35 },
        ],
      },
      {
        id: 'storage',
        label: 'Storage expansion',
        type: 'select',
        defaultValue: '1541',
        choices: [
          { value: '1541', label: '1541 floppy drive (included)', priceModifier: 0 },
          { value: 'sd2iec', label: 'SD2IEC SD-card loader', priceModifier: 89 },
          { value: 'tapuino', label: 'Tapuino tape emulator', priceModifier: 45 },
        ],
      },
      {
        id: 'mods',
        label: 'Modifications',
        type: 'checkbox',
        choices: [
          { value: 'sid-upgrade', label: 'Dual SID chip upgrade', priceModifier: 55 },
          { value: 'hdmi', label: 'HDMI video output mod', priceModifier: 75 },
          { value: 'keycaps', label: 'Replacement keycap set', priceModifier: 28 },
        ],
      },
      {
        id: 'engraving',
        label: 'Custom label engraving',
        type: 'text',
        placeholder: 'e.g. CIRCUT REVIVE #042',
        maxLength: 24,
        priceModifier: 15,
      },
    ],
  },
  {
    id: 'mac-se',
    name: 'Macintosh SE',
    era: '1987',
    category: 'computers',
    basePrice: 899,
    description:
      'Classic all-in-one Macintosh with optional RAM upgrades, drive swaps, and cosmetic restoration tiers.',
    condition: 'Restored',
    conditionGrade: 8,
    imageUrl: PRODUCT_IMAGES['mac-se'],
    stockCount: 4,
    customizationOptions: [
      {
        id: 'finish',
        label: 'Restoration tier',
        type: 'select',
        defaultValue: 'standard',
        choices: [
          { value: 'standard', label: 'Standard clean & test', priceModifier: 0 },
          { value: 'full-retrobright', label: 'Full RetroBright case restore', priceModifier: 120 },
          { value: 'museum', label: 'Museum-grade (NOS parts where possible)', priceModifier: 250 },
        ],
      },
      {
        id: 'memory',
        label: 'RAM upgrade',
        type: 'select',
        defaultValue: '4mb',
        choices: [
          { value: '4mb', label: '4 MB (stock max)', priceModifier: 0 },
          { value: '8mb', label: '8 MB SIMM upgrade', priceModifier: 65 },
        ],
      },
      {
        id: 'drive',
        label: 'Boot drive',
        type: 'select',
        defaultValue: 'floppy',
        choices: [
          { value: 'floppy', label: '800K floppy (original)', priceModifier: 0 },
          { value: 'scsi-ssd', label: 'SCSI2SD solid-state', priceModifier: 140 },
        ],
      },
      {
        id: 'engraving',
        label: 'Rear-panel engraving',
        type: 'text',
        placeholder: 'Your initials or handle',
        maxLength: 16,
        priceModifier: 20,
      },
    ],
  },
  {
    id: 'walkman-wm2',
    name: 'Sony Walkman WM-2',
    era: '1981',
    category: 'audio',
    basePrice: 189,
    description:
      'Iconic portable cassette player. Pick belt service level, headphone pairing, and cosmetic options.',
    condition: 'Serviced',
    conditionGrade: 8,
    imageUrl: PRODUCT_IMAGES['walkman-wm2'],
    stockCount: 9,
    customizationOptions: [
      {
        id: 'service',
        label: 'Service package',
        type: 'select',
        defaultValue: 'basic',
        choices: [
          { value: 'basic', label: 'Basic belt & cap replace', priceModifier: 0 },
          { value: 'full', label: 'Full rebuild + calibration', priceModifier: 45 },
          { value: 'audiophile', label: 'Audiophile cap upgrade + azimuth tune', priceModifier: 85 },
        ],
      },
      {
        id: 'headphones',
        label: 'Headphone bundle',
        type: 'select',
        defaultValue: 'none',
        choices: [
          { value: 'none', label: 'Player only', priceModifier: 0 },
          { value: 'mdr-3l2', label: 'MDR-3L2 period-correct cans', priceModifier: 55 },
          { value: 'modern-retro', label: 'Modern retro-style closed-back', priceModifier: 79 },
        ],
      },
      {
        id: 'mods',
        label: 'Extras',
        type: 'checkbox',
        choices: [
          { value: 'case', label: 'Leather carry case (repro)', priceModifier: 32 },
          { value: 'dolby', label: 'Dolby B/C decode verify', priceModifier: 18 },
        ],
      },
    ],
  },
  {
    id: 'gameboy',
    name: 'Nintendo Game Boy',
    era: '1989',
    category: 'gaming',
    basePrice: 129,
    description:
      'The original brick. Customize shell color, backlight, and power options for your perfect handheld.',
    condition: 'Refurbished',
    conditionGrade: 7,
    imageUrl: PRODUCT_IMAGES.gameboy,
    stockCount: 18,
    customizationOptions: [
      {
        id: 'shell',
        label: 'Shell color',
        type: 'select',
        defaultValue: 'grey',
        choices: [
          { value: 'grey', label: 'Original DMG grey', priceModifier: 0 },
          { value: 'atomic-purple', label: 'Atomic purple (repro shell)', priceModifier: 25 },
          { value: 'clear', label: 'Clear smoke shell', priceModifier: 30 },
          { value: 'custom', label: 'Custom two-tone (contact us)', priceModifier: 45 },
        ],
      },
      {
        id: 'screen',
        label: 'Display mod',
        type: 'select',
        defaultValue: 'stock',
        choices: [
          { value: 'stock', label: 'Stock LCD (no mod)', priceModifier: 0 },
          { value: 'bivert', label: 'Bivert + IPS backlight', priceModifier: 95 },
          { value: 'oled', label: 'OLED drop-in kit', priceModifier: 145 },
        ],
      },
      {
        id: 'power',
        label: 'Power options',
        type: 'checkbox',
        choices: [
          { value: 'rechargeable', label: 'USB-C rechargeable battery mod', priceModifier: 40 },
          { value: 'pro-sound', label: 'Pro sound headphone amp', priceModifier: 35 },
        ],
      },
    ],
  },
  {
    id: 'model-m',
    name: 'IBM Model M Keyboard',
    era: '1987',
    category: 'peripherals',
    basePrice: 179,
    description:
      'Buckling-spring legend. Choose layout, cable, and deep-clean tier for your daily driver.',
    condition: 'Cleaned',
    conditionGrade: 9,
    imageUrl: PRODUCT_IMAGES['model-m'],
    stockCount: 15,
    customizationOptions: [
      {
        id: 'layout',
        label: 'Layout',
        type: 'select',
        defaultValue: 'ansi',
        choices: [
          { value: 'ansi', label: 'ANSI 101-key', priceModifier: 0 },
          { value: 'iso', label: 'ISO enter (UK/German)', priceModifier: 0 },
          { value: 'terminal', label: '122-key terminal layout', priceModifier: 25 },
        ],
      },
      {
        id: 'cable',
        label: 'Cable',
        type: 'select',
        defaultValue: 'original',
        choices: [
          { value: 'original', label: 'Original coiled or straight', priceModifier: 0 },
          { value: 'usb-c', label: 'USB-C converter + new cable', priceModifier: 38 },
          { value: 'bt', label: 'Bluetooth converter mod', priceModifier: 55 },
        ],
      },
      {
        id: 'service',
        label: 'Restoration',
        type: 'select',
        defaultValue: 'standard',
        choices: [
          { value: 'standard', label: 'Standard deep clean', priceModifier: 0 },
          { value: 'bolt-mod', label: 'Bolt mod (full disassembly)', priceModifier: 90 },
        ],
      },
      {
        id: 'engraving',
        label: 'Space-bar engraving',
        type: 'text',
        placeholder: 'Up to 12 characters',
        maxLength: 12,
        priceModifier: 12,
      },
    ],
  },
]

/** @deprecated Use useProducts() or seedProducts */
export const products = seedProducts

export function getProductById(id) {
  return seedProducts.find((p) => p.id === id)
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return seedProducts
  return seedProducts.filter((p) => p.category === categoryId)
}
