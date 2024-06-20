import { HubConnection } from "@microsoft/signalr"
import User from "./User"
import Message from "./Message"

export default interface Contact {
    id: number
    user: User
    contactUser: User
    lastMessage: Message
    connection: HubConnection | null
}