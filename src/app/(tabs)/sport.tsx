import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Badge, Card, Divider, ListRow, Press, Row, Screen, SectionTitle, T } from '@/components/ui';
import { clubById, PROGRAMMES } from '@/sport';
import { useStore } from '@/store';
import { colors, radius, shadow, space } from '@/theme';

export default function Sport() {
  const { clubs, snc, societies } = useStore();
  const myClub = clubs[0] && clubById(clubs[0].clubId);

  return (
    <Screen tabs>
      <T v="overline" color={colors.red}>
        DMU Sport
      </T>
      <T v="hero" style={{ marginTop: 2 }}>
        Train. Compete.{'\n'}Represent.
      </T>

      <Animated.View entering={FadeInDown.duration(450)} style={{ marginTop: space.xl }}>
        <Feature
          href="/sport/team"
          photo={require('@/assets/photos/clubs.jpg')}
          eyebrow="DMU Team"
          title="Sports clubs"
          tagline="Train, compete and represent DMU in BUCS"
          status={myClub ? `Member · ${myClub.name} ${clubs[0].team}${clubs.length > 1 ? ` +${clubs.length - 1}` : ''}` : 'Get your membership'}
          member={!!myClub}
          big
        />
      </Animated.View>
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
    </Screen>
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
  feature: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.ink, ...shadow },
  programme: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  programmeImg: { width: 92, height: 92 },
});
