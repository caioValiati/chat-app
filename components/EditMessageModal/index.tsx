import React from "react"
import { styles } from "../../styles/global"
import { IMessage } from "react-native-gifted-chat";
import { Modal, Pressable, TextInput, View, Text } from "react-native";

interface Props {
    editModalOpen: boolean;
    setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentSelectedMessage: IMessage | undefined;
    userForId: number;
    connection: any;
    updateEditedMessage: any
}

const EditMessageModal = (props: Props) => {
    const [newMessage, setNewMessage] = React.useState<string>(props.currentSelectedMessage?.text ?? "")

    const handleMessageEdit = () => {
      const messageObj = {
        id: props.currentSelectedMessage?._id,
        usuarioRemetente: props.currentSelectedMessage?.user._id,
        usuarioDestinatario: props.userForId,
        dataEnvio: new Date(),
        conteudo: newMessage,
      }
      props.connection.invoke('EditMessage', messageObj)
        .then(() => {
          props.setEditModalOpen(false),
          (props.currentSelectedMessage as IMessage).text = newMessage;
          props.updateEditedMessage(props.currentSelectedMessage as IMessage)
        })
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.editModalOpen}
        onRequestClose={() => {
          props.setEditModalOpen(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Editar Mensagem.</Text>
            <TextInput 
              value={newMessage}
              style={styles.input} 
              placeholder='Mensagem...' 
              onChangeText={(e) => setNewMessage(e)}
            />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 6}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleMessageEdit}>
                <Text style={styles.textStyle}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.setEditModalOpen(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  export default EditMessageModal;