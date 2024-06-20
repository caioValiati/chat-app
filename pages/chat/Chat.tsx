import React, { useState, useEffect, useRef } from 'react';
import { Actions, ActionsProps, Bubble, Composer, ComposerProps, GiftedChat, IMessage, InputToolbar, SendProps } from 'react-native-gifted-chat';
import axios from 'axios';
import { Platform, Pressable, TouchableHighlight, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from '../../models/Message';
import { styles } from '../../styles/global';
import { API_ENDPOINTS } from '../../constants/apiUrls';
import RenderTick from '../../components/RenderTick';
import { defaultImageUri, mockMessage, selectImage } from '../../utils/utils';
import EditMessageModal from '../../components/EditMessageModal';
import DeleteMessageConfirmationModal from '../../components/DeleteMessageModal';
import { Asset } from 'react-native-image-picker';
import { Image as Img } from 'react-native-compressor';


const ChatScreen = (props: {navigation: any, route: any}) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [currentSelectedMessage, setCurrentSelectedMessage] = useState<IMessage>()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [userId, setUserId] = useState<number>();
    const userForId = props.route.params.id;
    const userForName = props.route.params.contactName;
    const connection = props.route.params.connection;
    const avatar = props.route.params.avatar;
    const firstRender = useRef(false);

    const updateEditedMessage = (message: IMessage) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages;
        const oldMessageIndex = newMessages.findIndex(m => m._id == message._id);
        newMessages[oldMessageIndex] = message;
        return [...newMessages]
      });
    }

    const updateMessages = (messageObj: Message) => {
      setMessages((prevMessages) => [...prevMessages, mockMessage(messageObj)]
      .sort((a: IMessage, b: IMessage) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }));
    }
  
    useEffect(() => { 
      const createConnection = async () => {
        connection.on('MessageEdit', (messageObj: Message) => {
          updateEditedMessage(mockMessage(messageObj));
        });

        connection.on('MessageReceived', (contactId: number) => {
          if (contactId == userForId) {
            setMessages(prevMessages => {
              const newMessages = prevMessages.map(m => {
                const message: any = m;
                if (message.status == 0) {
                  message.status = 1;
                }

                return message;
              })
              return [...newMessages]
            })
          }
        });

        connection.on('MessageVisualized', (contactId: number) => {
          if (contactId == userForId) {
            setMessages(prevMessages => {
              const newMessages = prevMessages.map(m => {
                const message: any = m;
                message.status = 2;
                return message;
              })
              return [...newMessages]
            })
          }
        });

        try {
          AsyncStorage.getItem("User").then((user) => {
            const id = JSON.parse(user ?? '').id;

            connection.on('ReceiveMessage', (messageObj: Message) => {
              updateMessages(messageObj);
              connection?.invoke('VisualizeMessage', {
                ContactId: userForId,
                UserId: id
              })
            });

            setUserId(id)

            connection?.invoke('PublishUserOnConnectedAsync', id)
            connection?.invoke('VisualizeMessage', {
              ContactId: userForId,
              UserId: id
            })

            axios.get(API_ENDPOINTS.GET_MENSAGENS + `/${id}/${userForId}`)
            .then((responseData) => {
              setMessages(responseData.data.map((r: Message) => {
                return mockMessage(r)
              }).sort((a: IMessage, b: IMessage) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }))
            });

          })
        } catch (error) {
          console.error('Error establishing connection:', error);
        }
      };
  
      if (!firstRender.current) {
        firstRender.current = true;
        createConnection();
      }
      
      if (Platform.OS === 'web') {
        const gcLoadingContaineEl = document.querySelectorAll('[data-testid="GC_LOADING_CONTAINER"]')[0] as HTMLElement
        if (gcLoadingContaineEl) {
            gcLoadingContaineEl.style.display = 'none'
            setTimeout(() => {
            gcLoadingContaineEl.style.display = 'flex'
            }, 500)
        }
      }
    }, []);

    const compressImage = async (base64ImageUri: string) => {
      const image = await Img.compress(base64ImageUri)
      console.log(image)
    };
  
    const sendMessage = async (message: string, image?: Asset) => {
      if (!message && !image) return

      const messageObj: Message = {
        id: ((messages[0]?._id as number) ?? 0) + 1,
        usuarioRemetenteId: userId ?? 0,
        usuarioDestinatarioId: userForId ?? 0,
        dataEnvio: new Date(),
        conteudo: message,
        status: 0,
        image: undefined,
      }

      if (connection) {   
        const newMessage = {
          ...messageObj,
          status: -1,
        };      
        updateMessages(newMessage)

        compressImage(image?.base64 ?? "")

        connection.invoke('SendMessage', messageObj, image?.base64)
          .then(() => {
            messageObj.status = 0;
            messageObj.image = image?.uri;
            updateEditedMessage(mockMessage(messageObj))
          })
          .catch((err: any) => console.error('Error sending message:', err));

      } else {
        console.error('WebSocket connection not established');
      }
    };

    const renderBubble = (props: any) => {
      return (
        <Bubble
          {...props}
          containerStyle={{ maxWidth: 300 }}
          renderTicks={(e: any) => <RenderTick status={e.status} isFromMainUser={e.user._id == userId} />}
          key={props.currentMessage._id}
          wrapperStyle={{
            left: {
              maxWidth: 300,
              backgroundColor: '#FFF',
            },
            right: {
              maxWidth: 300,
            }
          }}
        />
      );
    };

    const sendButton = (props: any) => {
      return (
          <TouchableHighlight 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: "#0084FF", 
              borderRadius: 10,
              width: 33,
              height: 33,
            }} 
            onPress={() => props.onSend(props, true)}
          >
            <Icon name='send' color={"white"} />
          </TouchableHighlight>
      );
    }

    const ChatComposer = (
      props: ComposerProps & {
        onSend: SendProps<IMessage>['onSend'];
        text: SendProps<IMessage>['text'];
      },
    ) => (
      <Composer
        {...props}
        textInputProps={{
          ...props.textInputProps,
          blurOnSubmit: Platform.OS === 'web',
          onSubmitEditing:
            Platform.OS === 'web'
              ? () => {
                  if (props.text && props.onSend) {
                    props.onSend({text: props.text.trim()}, true);
                  }
                }
              : undefined,
        }}
      />
    );
  
    const renderInputToolbar = (props: any) => {
      return (
        <InputToolbar
          {...props}
          renderSend={sendButton}
          primaryStyle={{
            alignItems: 'center',
            paddingRight: 5
          }}
          containerStyle={{
            display: 'flex',
            justifyContent: 'center',
            borderTopWidth: 1,
            borderTopColor: '#E8E8E8',
            borderRadius: 10,
            margin: 5,
            marginTop: 0,
          }}
        />
      );
    };

    const setActionSheetWithOptions = (context: any, message: IMessage) => {
      setCurrentSelectedMessage(message)
      const options = [
        'Edit',
        'Delete',
        'Cancel',
      ]
      const cancelButtonIndex = options.length - 1;
      const action = (index: number) => {
        switch (index) {
          case 0:
            setEditModalOpen(true)
            break;
          case 1:
            setDeleteModalOpen(true)
            break;
          default:
            break;
        }
      }
      context.actionSheet().showActionSheetWithOptions({options, cancelButtonIndex}, action)
    }

    const ChatHeaderBar = () => {
      const uri = `data:${avatar?.contentType};base64,${avatar?.fileContents}`
      return (
        <View style={styles.chatHeaderContainer}>
          <Pressable
            onPress={() => props.navigation.navigate('Home')}
          >
            <Icon 
              style={styles.backButton} 
              size={20} 
              name="arrow-back-outline" 

            />
          </Pressable>
          <Image style={styles.chatAvatar} source={{uri: avatar ? uri : defaultImageUri}} />
          <Text style={styles.contactName}>{userForName}</Text>
        </View>
      )
    }

    function renderActions(props: Readonly<ActionsProps>) {

      const sendImageMessage = (asset: Asset) => {
        sendMessage("", asset)
      }

      return (
        <Actions
          {...props}
          options={{
            ['Send Image']: () => selectImage(sendImageMessage),
          }}
          containerStyle={{margin: 0, marginLeft: 10}}
          icon={() => (
            <FeatherIcon name={'paperclip'} size={20} />
          )}
          onSend={(args) => console.log(args)}
        />
      )
    }
    
    return (
      <>
        <ChatHeaderBar />
        <GiftedChat
          shouldUpdateMessage={() => true}
          renderActions={renderActions}
          renderAvatar={null}
          renderComposer={ChatComposer}
          messages={messages}
          options={['teste']}
          onLongPress={(e, c) => setActionSheetWithOptions(e, c)}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          onSend={message => sendMessage(message[0].text)}
          user={{
            _id: userId ?? 0,
          }}
        />
        <EditMessageModal 
          connection={connection}
          currentSelectedMessage={currentSelectedMessage}
          setEditModalOpen={setEditModalOpen}
          editModalOpen={editModalOpen}
          userForId={userForId}
          updateEditedMessage={updateEditedMessage}
        />
        <DeleteMessageConfirmationModal 
          connection={connection}
          currentSelectedMessage={currentSelectedMessage}
          setDeleteModalOpen={setDeleteModalOpen}
          deleteModalOpen={deleteModalOpen}
          setMessages={setMessages}
        />
      </>
    )
};

export default ChatScreen;