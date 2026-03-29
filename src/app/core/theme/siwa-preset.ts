import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * SiwaPreset — merkkleurenthema van SiwaUI.
 *
 * Primaire kleur: #1e3341 (donker navy)
 * Contrastkleur:  #ffffff (wit)
 *
 * De semantic.primary palette bevat hex-waarden die direct worden
 * gebruikt door PrimeNG voor knoppen, actieve states, focus-ringen etc.
 * In dark mode wordt een lichtere variant van het palet gebruikt zodat
 * tekst leesbaar blijft op donkere achtergrond.
 */
export const SiwaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#edf1f4',
      100: '#d4dde4',
      200: '#aabac5',
      300: '#7a98a9',
      400: '#49768d',
      500: '#1e3341',
      600: '#1a2d3a',
      700: '#152532',
      800: '#0f1d29',
      900: '#0a1520',
      950: '#061018',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#1e3341',
          contrastColor: '#ffffff',
          hoverColor: '#1a2d3a',
          activeColor: '#152532',
        },
        highlight: {
          background: '#edf1f4',
          focusBackground: '#d4dde4',
          color: '#1e3341',
          focusColor: '#152532',
        },
      },
      dark: {
        primary: {
          color: '#7a98a9',
          contrastColor: '#ffffff',
          hoverColor: '#aabac5',
          activeColor: '#d4dde4',
        },
        highlight: {
          background: 'color-mix(in srgb, #49768d, transparent 84%)',
          focusBackground: 'color-mix(in srgb, #49768d, transparent 76%)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.87)',
        },
      },
    },
  },
});
