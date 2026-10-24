import { Platform, TextStyle } from 'react-native';

// DMU red, sampled from the lion in the MyDMU app icon.
export const colors = {
  red: '#A81D35',
  redDeep: '#7E1226',
  redSoft: '#FBEDEF',
  ink: '#0B0B0C',
  ink2: '#1C1C1F',
  ink3: '#2A2A2F',
  text: '#0B0B0C',
  textMuted: '#6B6B73',
  textFaint: '#A1A1A9',
  bg: '#F5F5F7',
  surface: '#FFFFFF',
  line: '#E8E8EC',
  white: '#FFFFFF',
  green: '#1F9D55',
  greenSoft: '#E7F6EE',
  amber: '#C27803',
  amberSoft: '#FDF3E1',
} as const;

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;

const family = Platform.select({ web: 'var(--font-display)', default: undefined });

export const type = {
  hero: { fontFamily: family, fontSize: 34, fontWeight: '800', letterSpacing: -1.1, lineHeight: 38 },
  title: { fontFamily: family, fontSize: 26, fontWeight: '800', letterSpacing: -0.7, lineHeight: 31 },
  heading: { fontFamily: family, fontSize: 19, fontWeight: '700', letterSpacing: -0.4, lineHeight: 24 },
  body: { fontFamily: family, fontSize: 16, fontWeight: '500', letterSpacing: -0.2, lineHeight: 22 },
  bodyBold: { fontFamily: family, fontSize: 16, fontWeight: '700', letterSpacing: -0.2, lineHeight: 22 },
  small: { fontFamily: family, fontSize: 14, fontWeight: '500', letterSpacing: -0.1, lineHeight: 19 },
  smallBold: { fontFamily: family, fontSize: 14, fontWeight: '700', letterSpacing: -0.1, lineHeight: 19 },
  caption: { fontFamily: family, fontSize: 12, fontWeight: '600', letterSpacing: 0, lineHeight: 16 },
  overline: { fontFamily: family, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, lineHeight: 14, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export const shadow = Platform.select({
  web: { boxShadow: '0 6px 24px rgba(11,11,12,0.06), 0 1px 2px rgba(11,11,12,0.04)' },
  default: {
    shadowColor: '#0B0B0C',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
}) as object;
