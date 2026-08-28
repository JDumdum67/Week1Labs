import { StyleSheet, View, Text } from 'react-native';
import TaskCard from './src/app/components/TaskCard';
export default function App() {

return (

<View style={styles.container}>
<Text style={styles.heading}>My Tasks</Text>
<TaskCard title="Finish Lab 2" done={false} />
<TaskCard title="Read Chapter 3" done={true} />
<TaskCard title="Walk the dog" done={false} />

</View>
);
}

const styles = StyleSheet.create({

container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor:

'#FFFFFF' },

heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

}); 