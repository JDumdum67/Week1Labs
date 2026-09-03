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

  // QUOTE STATES
  const [quote, setQuote] = useState<string>('');
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);

  // FETCH QUOTE LOGIC
  const fetchQuote = () => {
    setLoadingQuote(true);
    fetch('https://dummyjson.com/quotes/random')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch quote');
        return res.json();
      })
      .then((data) => {
        setQuote(`"${data.quote}" — ${data.author}`);
      })
      .catch((error) => {
        console.log('Using backup quote:', error);
        setQuote('"Keep pushing forward no matter what!" — Backup Motivation');
      })
      .finally(() => {
        setLoadingQuote(false);
      });
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // LOAD TASKS
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

  // SAVE TASKS
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

  // STEP 4: DELETE FUNCTION
  function handleDeleteTask(id: any) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <View style={styles.container}>
      {/* MOTIVATIONAL QUOTE SECTION */}
      <View style={styles.quoteCard}>
        {loadingQuote ? (
          <Text style={styles.quoteLoading}>Loading today's motivation...</Text>
        ) : (
          <Text style={styles.quoteText}>{quote}</Text>
        )}
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="New Quote" onPress={fetchQuote} />
      </View>

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

      {/* STEP 5: FLATLIST WITH ONDELETE WIRED IN */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            done={item.done}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
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
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  quoteCard: {
    padding: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  buttonWrapper: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  quoteLoading: {
    fontStyle: 'italic',
    color: '#6B7280',
    fontSize: 14,
  },
  quoteText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
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