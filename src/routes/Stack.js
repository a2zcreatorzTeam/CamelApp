import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import News from '../screens/NewsList';

const NewStack = createNativeStackNavigator();
export default function NewSatck() {
  return (
    <NewStack.Navigator>
      <NewStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <NewStack.Screen
        name="News"
        component={News}
        options={{headerShown: false}}
      />
    </NewStack.Navigator>
  );
}
