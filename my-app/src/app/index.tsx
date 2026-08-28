import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>📱</Text>
        <Text style={styles.title}>Week1Labs</Text>
        <Text style={styles.subtitle}>Built by you, one lab at a time</Text>
      </View>
      <View style={styles.footer}>
        <Link href="/add-task" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go to My Tasks</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B2A4A', justifyContent: 'space-between' },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#C7D2E8', marginTop: 6 },
  footer: { paddingBottom: 40, alignItems: 'center' },
  button: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
});