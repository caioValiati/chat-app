import * as React from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import LoginScreen from 'react-native-login-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SignIn(props: {navigation: any}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const nav = useNavigation()

  React.useEffect(() => {
    AsyncStorage.getItem("Bearer")
      .then((data) => {
        if (data && data != "") {
          nav.navigate("Home" as never)
        }
      })
  }, [])

  const handleSubmit = () => {
    const uri = API_ENDPOINTS.LOGIN

    axios.post(uri, { userName: username, password: password })
        .then(async (res) => {
            await AsyncStorage.setItem('User', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.token
            props.navigation.navigate("Home")
        })
  };

  return (
    <LoginScreen
        logoImageSource={""}
        customLogo={<></>}
        onLoginPress={() => handleSubmit()}
        onSignupPress={() => props.navigation.navigate("Register")}
        disableSocialButtons
        onEmailChange={setUsername}
        onPasswordChange={setPassword}
        enablePasswordValidation
    />
  );
}