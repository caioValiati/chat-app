import { Modal, Pressable, View, Text } from "react-native";
import { IMessage } from "react-native-gifted-chat";
import { styles } from "../../styles/global";


interface Props {
    deleteModalOpen: boolean;
    setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentSelectedMessage: IMessage | undefined;
    connection: any;
    setMessages: any;
}

const DeleteMessageConfirmationModal = (props: Props) => {
  console.log(props.currentSelectedMessage)
    const handleMessageDelete = () => {
      props.connection.invoke('DeleteMessage', props.currentSelectedMessage?._id)
        .then(() => {
          props.setDeleteModalOpen(false)
          props.setMessages((prevMessages: any) => [...prevMessages.filter((m: any) => !(m._id == props.currentSelectedMessage?._id))])
        })
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.deleteModalOpen}
        onRequestClose={() => {
          props.setDeleteModalOpen(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Deletar Mensagem.</Text>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 6}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleMessageDelete}>
                <Text style={styles.textStyle}>Deletar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.setDeleteModalOpen(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  export default DeleteMessageConfirmationModal;