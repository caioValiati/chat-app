import { MediaType, launchImageLibrary } from "react-native-image-picker"
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
      image: message.image ? `data:image/png;base64,${message.image}` : null,
      user: {
        _id: message.usuarioRemetenteId ?? 0,
        name: 'React Native',
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

export const selectImage = (onImageSelect: ((asset: any) => void), mediaType: MediaType = 'photo', selectionLimit = 0) => {
  launchImageLibrary(
    { 
      mediaType: mediaType, 
      includeBase64: true, 
      quality: 1, 
      selectionLimit: selectionLimit 
    }, 
    response => {
      onImageSelect(response.assets)
    });
};

export const getImageUri = (imageFile: any) => `data:${imageFile.contentType};base64,${imageFile.fileContents}`
export const defaultImageUri = "/assets/default-avatar.jpg"