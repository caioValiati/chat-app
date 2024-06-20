import User from "./User";

export default interface Message {
    id: number,
    usuarioRemetenteId: number,
    usuarioDestinatarioId: number,
    dataEnvio: Date,
    conteudo: string,
    status: number,
    image?: string | undefined
}