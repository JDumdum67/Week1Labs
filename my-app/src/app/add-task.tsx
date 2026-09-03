import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import TaskCard from './components/TaskCard';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  function handleAddTask() {
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it!');
      return;
    }

    const newTask = { id: Date.now().toString(), title: taskText, done: false };
    setTasks([...tasks, newTask]);
    setTaskText('');
    setErrorMessage('');
  }

  function handleToggleTask(id: any) {
    setTasks(
      tasks.map((task: any) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a Task</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={taskText}
        onChangeText={(text) => {
          setTaskText(text);
          if (text.trim() !== '') setErrorMessage('');
        }}
      />

      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      <Button title="ADD TASK" onPress={handleAddTask} />

      <Text style={styles.counter}>You have {tasks.length} task(s)</Text>

      {/* STEP 5: Celebration Block */}
      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <Text style={styles.celebration}>🎉 All done! Great work!</Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            done={item.done}
            onToggle={() => handleToggleTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one above! 👆</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  error: {
    color: '#B23A48',
    marginBottom: 10,
    fontSize: 14,
  },
  counter: {
    marginVertical: 10,
  },
  // STEP 5: Matching Style
  celebration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8A7A',
    textAlign: 'center',
    marginVertical: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },
  separator: {
    height: 8,
  },
  list: {
    marginTop: 10,
  },
});