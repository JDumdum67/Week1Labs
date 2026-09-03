import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function TaskCard({ title, done, onToggle, onDelete }) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onToggle} style={styles.left}>
        <Text style={styles.checkbox}>{done ? '☑' : '☐'}</Text>
        <Text style={[styles.title, done && styles.doneTitle]}>{title}</Text>
      </Pressable>

      {onDelete && (
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    fontSize: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1F2937',
  },
  doneTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
  },
});