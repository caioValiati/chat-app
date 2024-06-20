import Icon from 'react-native-vector-icons/Ionicons'
import FeatherIcon from 'react-native-vector-icons/Feather'

const RenderTick = (props: {status: number, isFromMainUser: boolean}) => {
    if (!props.isFromMainUser) { return <></> }
    if (props.status === 0) {
        return <FeatherIcon id={`${props.status}`} size={18} color={'#fff'} style={{marginRight: 10}} name='check' />
    } else if (props.status === 1) {
        return <Icon id={`${props.status}`} size={18} color={'#fff'} style={{marginRight: 10}} name='checkmark-done' />
    } else if (props.status === 2) {
        return <Icon id={`${props.status}`} size={18} color={'#25D366'} style={{marginRight: 10}} name='checkmark-done' />
    } else if (props.status === -1) {
        return <FeatherIcon id={`${props.status}`} size={18} color={'#fff'} style={{marginRight: 10}} name='clock' />
    }
}

export default RenderTick;