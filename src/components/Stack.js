import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewsList from '../screens/NewsList';
import Header from './Header';
import Home from '../screens/Home';
import News from '../screens/News';
import UserProfile from '../screens/UserProfile';

const NewStack = createNativeStackNavigator();
export default function NewSatck() {
  return (
    <NewStack.Navigator>
      <NewStack.Screen
        name="Home"
        component={Home}
        // options={{ header: () => <Header navRoute={"Home"} /> }}
        options={{headerShown: false}}
      />

      <NewStack.Screen
        name="NewsList"
        component={NewsList}
        options={{header: () => <Header />}}
      />

      <NewStack.Screen
        name="News"
        component={News}
        options={{headerShown: false}}
        // options={{header: () => <Header />}}
      />

      <NewStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{header: () => <Header />}}
      />
    </NewStack.Navigator>
  );
}
