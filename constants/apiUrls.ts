const API_SERVER_URL = 'http://localhost:5169/'

export const API_ENDPOINTS = {
    REGISTER: API_SERVER_URL + 'api/Users',
    LOGIN: API_SERVER_URL + 'api/Users/login',
    LOGOUT: API_SERVER_URL + 'api/Users/logout',
    GET_MENSAGENS: API_SERVER_URL + 'api/Messages',
    GET_CONTATOS: API_SERVER_URL + 'api/Contacts',
    GET_USUARIOS: API_SERVER_URL + 'api/Users',
    MESSAGES_HUB: API_SERVER_URL + 'messagehub',
}