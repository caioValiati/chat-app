import * as React from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import LoginScreen from 'react-native-login-screen';

export default function SignUp(props: {navigation: any}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  
  const handleSubmit = () => {
    const userObject = {
        username: username,
        password: password
    }

    axios.post(API_ENDPOINTS.REGISTER, userObject)
        .then(() => {
          props.navigation.navigate("Login")
        })
  };

  return (
    <LoginScreen
        logoImageSource={""}
        customLogo={<></>}
        disableSocialButtons
        onLoginPress={() => handleSubmit()}
        onSignupPress={() => {}}
        onEmailChange={setUsername}
        loginButtonText={'Create an account'}
        disableSignup
        onPasswordChange={setPassword}
    />
  );
}