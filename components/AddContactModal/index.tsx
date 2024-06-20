import React from "react"
import { API_ENDPOINTS } from "../../constants/apiUrls"
import axios from "axios"
import { Modal, Pressable, TextInput, View, Text } from "react-native"
import { styles } from "../../styles/global";

interface Props {
    user: any;
    users: any;
    setUsers: any;
    setModalOpen: any;
    modalOpen: any;
}

const AddContactModal = (props: Props) => {
    const [contactId, setContactId] = React.useState<string>('')

    const handleUserIdChange = (contactId: string) => {
      setContactId(contactId.replace(/[^0-9]/g, '').replace(`${props.user?.id}`, ''))
    }

    const handleContactAdd = () => {
      axios.post(API_ENDPOINTS.GET_USUARIOS + "/addContato", {
        userId: props.user?.id,
        contactId: parseInt(contactId)
      }).then(response => {
        props.setUsers((prevstate: any) => {
          return [...prevstate, response.data.contacts.pop()]
      })
        props.setModalOpen(false)
      })
    }

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
            <Text style={styles.modalText}>Adicionar Contato.</Text>
            <TextInput 
              value={contactId}
              style={styles.input} 
              placeholder='Id do usuário.' 
              onChangeText={(e) => handleUserIdChange(e)}
            />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 6}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleContactAdd}>
                <Text style={styles.textStyle}>Adicionar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.setModalOpen(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    )
  }  

  export default AddContactModal