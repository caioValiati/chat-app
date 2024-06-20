import { Modal, Pressable, TextInput, View, Text, Image } from "react-native"
import { styles } from "../../styles/global";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import React from "react";
import { API_ENDPOINTS } from "../../constants/apiUrls";
import { defaultImageUri, getImageUri, selectImage } from "../../utils/utils";


interface Props {
    user: any;
    setUser: any;
    setModalOpen: any;
    modalOpen: any;
}

const UserInfoModal = (props: Props) => {
    const [photo, setPhoto] = React.useState<any>(null);
    const [username, setUsername] = React.useState<any>(props.user?.userName);

    React.useEffect(() => setUsername(props.user?.userName), [props.user])
  
    const uploadImage = async () => {
      const url = API_ENDPOINTS.GET_USUARIOS + `/${props.user?.id}`;
      const formData = new FormData();
      const img = photo[0]

      if (img) {
        const base64Response = await fetch(img.uri);
        const blob = await base64Response.blob();
        formData.append('file', blob);
      }
      
      formData.append('userName', username);
      formData.append('id', JSON.stringify(props.user?.id));
  
      try {
        const response = await axios.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        );
  
        if (response.status === 204 || response.status === 200) {
          const newUserData = {...props.user, profilePicture: response.data, userName: username ?? '', id: props.user?.id ?? 0}
          AsyncStorage.setItem('User', JSON.stringify(newUserData))
          props.setUser(newUserData)
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalOpen}
      onRequestClose={() => {
        props.setModalOpen(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Informações de Usuário.</Text>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Pressable
              onPress={() => selectImage(setPhoto, 1)}
            >
              <View style={styles.avatarContainer}>
                <Image 
                    style={styles.avatar} 
                    source={{uri: props.user?.profilePicture ? getImageUri(props.user?.profilePicture) : defaultImageUri}} 
                />
              </View>
            </Pressable>
            <TextInput value={username} style={styles.input} onChangeText={(value) => setUsername(value)} />
          </View>
          <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.setModalOpen(false)}>
              <Text style={styles.textStyle}>Fechar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={uploadImage}>
              <Text style={styles.textStyle}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default UserInfoModal