import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from './components/TaskCard';

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 1. Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        let savedData: string | null = null;
        if (Platform.OS === 'web') {
          savedData = localStorage.getItem('tasks');
        } else {
          savedData = await AsyncStorage.getItem('tasks');
        }

        if (savedData !== null) {
          setTasks(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTasks();
  }, []);

  // 2. Save tasks on change
  useEffect(() => {
    if (!isLoaded) return;

    const saveTasks = async () => {
      try {
        const jsonValue = JSON.stringify(tasks);
        if (Platform.OS === 'web') {
          localStorage.setItem('tasks', jsonValue);
        } else {
          await AsyncStorage.setItem('tasks', jsonValue);
        }
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };

    saveTasks();
  }, [tasks, isLoaded]);

  function handleAddTask() {
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it.');
      return;
    }

    const newTask: Task = { id: Date.now().toString(), title: taskText, done: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskText('');
    setErrorMessage('');
  }

  function handleToggleTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
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

      <Button title="Add Task" onPress={handleAddTask} />

      <Text style={styles.counter}>You have {tasks.length} task(s)</Text>

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
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: '#B23A48',
    marginBottom: 10,
    fontSize: 14,
  },
  counter: {
    marginVertical: 10,
  },
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
    marginTop: 16,
  },
});