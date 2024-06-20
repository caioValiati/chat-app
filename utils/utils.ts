import { launchImageLibrary } from "react-native-image-picker"
import Message from "../models/Message"
import { IMessage } from "react-native-gifted-chat"

interface ModIMessage extends IMessage {
  status: number
}

export const mockMessage = (message: Message): ModIMessage => {
    return {
      _id: message.id,
      status: message.status,
      text: message.conteudo,
      createdAt: message.dataEnvio,
      image: message.image,
      user: {
        _id: message.usuarioRemetenteId ?? 0,
        name: 'React Native',
        avatar: 'https://picsum.photos/140/140',
      },
    }
}

export const formatTime = (dateString: string | Date) => {
    if (!dateString) { return }
    let date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
}

export const selectImage = (onImageSelect: ((asset: any) => void)) => {
  launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      onImageSelect(response.assets[0]);
    }
  });
};

export const getImageUri = (imageFile: any) => `data:${imageFile.contentType};base64,${imageFile.fileContents}`
export const defaultImageUri = "/assets/default-avatar.jpg"