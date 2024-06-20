import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Middleware() {
    const nav = useNavigation()

    React.useEffect(() => {
      AsyncStorage.getItem("User")
        .then((data) => {
          if (data) {
            const user = JSON.parse(data ?? '');
            axios.defaults.headers.common['Authorization'] = "Bearer " + user.token
            nav.navigate("Home" as never)
          } else {
            nav.navigate("Login" as never)
          }
        })
    }, [])

  return <></>;
}