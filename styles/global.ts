import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      height: '100%'
    },
    contact: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
    },
    avatarContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      marginRight: 8,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      objectFit: 'fill'
    },
    infoContainer: {
      display: 'flex',
      justifyContent: 'center',
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderBottomWidth: 1,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      width: '80%',
    },
    mainInfoContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'baseline',
    },
    addContactButton: {
      position: 'absolute',
      zIndex: 10,
      bottom: 10,
      right: 10,
      width: 40,
      height: 40,
      backgroundColor: "#0084FF",
      borderRadius: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      flex: 3,
      borderRadius: 10,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: "#0084FF",
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      height: 30,
      width: 200,
      marginBottom: 10,
      borderColor: "#0084FF",
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 10,
    },
    headerContainer: {
      paddingLeft: 15,
      paddingRight: 15,
      height: 60,
      backgroundColor: '#FFF',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    chatHeaderContainer: {
        height: 60,
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      },
    contactName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#242424',
    },
    chatAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 15,
      objectFit: 'fill'
    },
    backButton: {
      paddingRight: 10,
      paddingLeft: 10,
    },
    imageSelectionContainer: {
      display: 'flex',
      flexDirection: 'row',
      overflow: 'scroll',
      marginLeft: 10
    },
    imageSelection: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 5,
      objectFit: 'fill'
    },
  });