import React, { useState } from 'react';
import axios from 'axios';
import { FlatList, TouchableHighlight, Text, Image, View, ScrollView, Pressable } from 'react-native';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import { useIsFocused } from '@react-navigation/native';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import RenderTick from '../../components/RenderTick';
import User from '../../models/User';
import Message from '../../models/Message';
import { styles } from '../../styles/global';
import AddContactModal from '../../components/AddContactModal';
import UserInfoModal from '../../components/UserInfoModal';
import { defaultImageUri, formatTime, getImageUri } from '../../utils/utils';


interface ContactUser extends User {
    lastMessage: Message
}

const ContactsScreen = (props: {navigation: any}) => {
    const [users, setUsers] = useState<ContactUser[]>([])
    const [connection, setConnection] = React.useState<HubConnection | null>(null);
    const [user, setUser] = React.useState<User>();
    const [modalOpen, setModalOpen] = React.useState(false);
    const [userInfoModalOpen, setUserInfoModalOpen] = React.useState(false);
    const firstRender = React.useRef(false);
    const isFocused = useIsFocused();

    const fetchContacts = (id: string) => {
      axios.get(API_ENDPOINTS.GET_USUARIOS + `/${id}/Contatos`)
        .then((response: any) => {
          setUsers(response.data)
        })
    }
  
    React.useEffect(() => { 
      const createConnection = async () => {
        const newConnection = new HubConnectionBuilder()
          .withUrl(API_ENDPOINTS.MESSAGES_HUB, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect()
          .build();
  
        try {
          await newConnection.start();
          setConnection(newConnection); 
        } catch (error) {
          console.error('Error establishing connection:', error);
        }
      
        AsyncStorage.getItem("User").then((u: any) => {
          const user = JSON.parse(u ?? '');
          setUser(user)
          const id = user.id;

          newConnection.invoke('PublishUserOnConnectedAsync', id)
          fetchContacts(id)

          newConnection.on('ReceiveMessage', () => {
            fetchContacts(id)
            newConnection?.invoke('ReceiveMessage', id)
          });    

          newConnection.on('MessageReceived', (contactId: number) => {
              setUsers(prevUsers => {
                const newUsers = prevUsers;
                const changeUserIndex = users.findIndex(u => u.lastMessage?.usuarioDestinatarioId === contactId);
                if (newUsers[changeUserIndex]) {
                  newUsers[changeUserIndex].lastMessage.status = newUsers[changeUserIndex]?.lastMessage?.status === 2 ? 2 : 1;
                }
                return [...newUsers]
              })
          });

          newConnection.on('MessageVisualized', (contactId: number) => {
            setUsers(prevUsers => {
              const newUsers = prevUsers;
              const changeUserIndex = users.findIndex(u => u.id === contactId);
              if (newUsers[changeUserIndex]) {
                newUsers[changeUserIndex].lastMessage.status = 2;
              }
              return [...newUsers]
            })
          });

        })
      };

      if (isFocused) {
        firstRender.current = true;
        createConnection();
      }
  
    }, [isFocused]);

    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={{fontSize: 20, fontWeight: 'semibold'}}>Chat</Text>
          <Pressable
            onPress={() => setUserInfoModalOpen(true)}
          >
            <IonicIcon size={20} color={'#0084FF'} name="ellipsis-vertical" />
          </Pressable>
        </View>
        <ScrollView style={styles.mainContainer}>
          <FlatList
              data={users}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => props.navigation.navigate("Chat", { 
                    id: item.id, 
                    contactName: item.userName, 
                    avatar: item.profilePicture,
                    connection: connection })}
                >
                  <View style={styles.contact}>
                    <View style={styles.avatarContainer}>
                      <Image style={styles.avatar} source={{uri: item?.profilePicture ? getImageUri(item?.profilePicture) : defaultImageUri}} />
                    </View>
                    <View style={styles.infoContainer}>
                      <View style={styles.mainInfoContainer}>
                        <Text style={{fontSize: 17}}>{item.userName}</Text>
                        <Text style={{fontSize: 12}}>{formatTime(item.lastMessage?.dataEnvio)}</Text>
                      </View>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <RenderTick status={item.lastMessage?.status} isFromMainUser={item.lastMessage?.usuarioRemetenteId == user?.id} />
                        <Text style={{alignSelf: 'flex-start'}}>{item.lastMessage?.conteudo}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
            )}
          />
        </ScrollView>
        <TouchableHighlight
          style={styles.addContactButton}
          onPress={() => setModalOpen(true)}
        >
          <Icon size={20} color={'#fff'} name="plus" />
        </TouchableHighlight>
        <AddContactModal
          users={users}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          user={user}
          setUsers={setUsers}
        />
        <UserInfoModal 
          modalOpen={userInfoModalOpen}
          setModalOpen={setUserInfoModalOpen}
          user={user}
          setUser={setUser}
        />
      </>
    )
};

export default ContactsScreen;