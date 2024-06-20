import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from './pages/chat/Chat';
import SignIn from './pages/login/login';
import SignUp from './pages/register/register';
import Middleware from './middleware';
import ContactsScreen from './pages/contacts/Contacts';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Middleware"
          component={Middleware}
        />
        <Stack.Screen
          name="Home"
          component={ContactsScreen}
          options={{header: () => null, headerTitle: "Chat"}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Login"
          component={SignIn}
        />
        <Stack.Screen
          name="Register"
          component={SignUp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;