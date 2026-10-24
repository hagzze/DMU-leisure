import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Badge, Card, Divider, ListRow, Press, Row, Screen, SectionTitle, T } from '@/components/ui';
import { TeamPassStack } from '@/components/team-pass';
import { CLUBS, PROGRAMMES, SOCIETIES } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space, type } from '@/theme';

export default function Sport() {
  const { clubs, snc, societies } = useStore();
  const [query, setQuery] = useState('');

  return (
    <Screen tabs>
      <T v="overline" color={colors.red}>
        DMU Sport
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        Train. Compete.{'\n'}Represent.
      </T>

      <View style={styles.search}>
        <Ionicons name="search" size={19} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search clubs, sessions, societies"
          placeholderTextColor={colors.textFaint}
          autoCorrect={false}
          returnKeyType="search"
          style={[type.body, styles.searchInput]}
        />
        {query.length > 0 && (
          <Press onPress={() => setQuery('')} haptic={false} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={19} color={colors.textFaint} />
          </Press>
        )}
      </View>

      {query.trim() ? (
        <SearchResults query={query.trim()} />
      ) : (
      <>
      {clubs.length ? (
        <Animated.View entering={FadeInDown.duration(450)} style={{ marginTop: space.xl }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: space.md }}>
            <T v="heading">{clubs.length > 1 ? 'Your teams' : 'Your team'}</T>
            <Press onPress={() => router.push('/sport/team')} haptic={false}>
              <T v="smallBold" color={colors.red}>
                Join another
              </T>
            </Press>
          </Row>
          <TeamPassStack clubs={clubs} />
          <T v="caption" color={colors.textMuted} center style={{ marginTop: space.sm }}>
            Tap a pass to book training and transport
          </T>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(450)} style={{ marginTop: space.xl }}>
          <Feature
            href="/sport/team"
            photo={require('@/assets/photos/clubs.jpg')}
            eyebrow="DMU Team"
            title="Sports clubs"
            tagline="Train, compete and represent DMU in BUCS"
            status="Get your membership"
            member={false}
            big
          />
        </Animated.View>
      )}
      <Animated.View entering={FadeInDown.delay(80).duration(450)} style={{ marginTop: space.md }}>
        <Feature
          href="/sport/snc"
          photo={require('@/assets/photos/snc.jpg')}
          eyebrow="DMU Team"
          title="Strength & Conditioning"
          tagline="Coached sessions at the Watershed"
          status={snc ? 'Member' : 'Get your membership'}
          member={!!snc}
        />
      </Animated.View>

      <SectionTitle title="More from DMU Sport" />
      <View style={{ gap: space.md }}>
        {PROGRAMMES.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInDown.delay(120 + i * 60).duration(450)}>
            <Press onPress={() => router.push({ pathname: '/sport/programme/[id]', params: { id: p.id } })} scaleTo={0.98} style={styles.programme}>
              <Image source={p.photo} style={styles.programmeImg} contentFit="cover" />
              <View style={{ flex: 1, paddingVertical: space.md, paddingRight: space.md }}>
                <T v="heading">{p.name}</T>
                <T v="small" color={colors.textMuted}>
                  {p.tagline}
                </T>
                <T v="caption" color={colors.red} style={{ marginTop: 6 }}>
                  {p.sessions.length} sessions this week
                </T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} style={{ marginRight: space.md }} />
            </Press>
          </Animated.View>
        ))}
      </View>

      <SectionTitle title="Societies" />
      <Press onPress={() => router.push('/sport/societies')} scaleTo={0.98}>
        <Card dark style={{ padding: space.xl, flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="people" size={24} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <T v="heading" color={colors.white}>
              {societies.length ? `${societies.length} societ${societies.length === 1 ? 'y' : 'ies'} joined` : 'Join a society'}
            </T>
            <T v="small" color="rgba(255,255,255,0.6)">
              Esports, dance, hiking and more. Memberships in one tap.
            </T>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
        </Card>
      </Press>

      <SectionTitle title="Good to know" />
      <Card>
        <ListRow icon="bus-outline" title="Free student transport" subtitle="To Beaumont Park for training and fixtures" />
        <Divider inset={66} />
        <ListRow icon="location-outline" title="The Watershed" subtitle="DMU Sport home, S&C suite and sports hall" />
        <Divider inset={66} />
        <ListRow icon="leaf-outline" title="Beaumont Park" subtitle="Outdoor pitches for rugby, football, lacrosse" />
      </Card>
      </>
      )}
    </Screen>
  );
}

type Hit = { key: string; title: string; subtitle: string; icon: string; href: Href };

// Searches every club and team, DMU Sport programme and session, S&C and society.
function SearchResults({ query }: { query: string }) {
  const q = query.toLowerCase();
  const has = (...parts: string[]) => parts.some((p) => p.toLowerCase().includes(q));
  const hits: Hit[] = [];
  for (const c of CLUBS) {
    if (has(c.name, c.blurb, ...c.teams)) {
      hits.push({ key: `club-${c.id}`, title: c.name, subtitle: `DMU Team · ${c.teams.join(', ')}`, icon: c.icon, href: { pathname: '/sport/club/[id]', params: { id: c.id } } });
    }
  }
  if (has('strength', 'conditioning', 's&c', 'snc', 'gym', 'weights')) {
    hits.push({ key: 'snc', title: 'Strength & Conditioning', subtitle: 'DMU Team · coached sessions at the Watershed', icon: 'barbell', href: '/sport/snc' });
  }
  for (const p of PROGRAMMES) {
    const sessions = p.sessions.filter((s) => has(s.title));
    if (has(p.name, p.tagline) || sessions.length) {
      hits.push({ key: `prog-${p.id}`, title: p.name, subtitle: sessions.length ? sessions.map((s) => s.title).join(', ') : p.tagline, icon: 'flash', href: { pathname: '/sport/programme/[id]', params: { id: p.id } } });
    }
  }
  for (const s of SOCIETIES) {
    if (has(s.name, s.blurb)) hits.push({ key: `soc-${s.id}`, title: s.name, subtitle: `Society · ${s.blurb}`, icon: s.icon, href: '/sport/societies' });
  }

  if (!hits.length) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: space.xxxl }}>
        <Ionicons name="search" size={34} color={colors.textFaint} />
        <T v="bodyBold" style={{ marginTop: space.md }}>
          Nothing matches &ldquo;{query}&rdquo;
        </T>
        <T v="small" color={colors.textMuted} center style={{ marginTop: 4 }}>
          Try a sport like netball, a team like Women&apos;s XV, or a society.
        </T>
      </View>
    );
  }

  return (
    <View style={{ marginTop: space.lg }}>
      <T v="caption" color={colors.textMuted} style={{ marginBottom: space.sm }}>
        {hits.length} result{hits.length === 1 ? '' : 's'}
      </T>
      <Card>
        {hits.map((h, i) => (
          <View key={h.key}>
            {i > 0 && <Divider inset={66} />}
            <ListRow icon={h.icon as never} title={h.title} subtitle={h.subtitle} onPress={() => router.push(h.href)} />
          </View>
        ))}
      </Card>
    </View>
  );
}

function Feature({ href, photo, eyebrow, title, tagline, status, member, big }: { href: Href; photo: number; eyebrow: string; title: string; tagline: string; status: string; member: boolean; big?: boolean }) {
  return (
    <Press onPress={() => router.push(href)} scaleTo={0.98} style={[styles.feature, { height: big ? 260 : 190 }]}>
      <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(11,11,12,0)', 'rgba(11,11,12,0.92)']} locations={[0.15, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl }}>
        <T v="overline" color={colors.red}>
          {eyebrow}
        </T>
        <T v={big ? 'hero' : 'title'} color={colors.white} style={{ marginTop: 2 }}>
          {title}
        </T>
        <T v="small" color="rgba(255,255,255,0.75)">
          {tagline}
        </T>
        <Row style={{ marginTop: space.md }}>
          <Badge label={status} tone={member ? 'green' : 'red'} icon={member ? 'checkmark-circle' : 'add-circle'} />
        </Row>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, marginTop: space.lg, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 0 },
  feature: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.ink, ...shadow },
  programme: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  programmeImg: { width: 92, height: 92 },
});
