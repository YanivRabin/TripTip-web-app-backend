import Chat from "../model/chat_model";

const getMessages = async (roomId: string) => {
    try {
        const chat = await Chat.findOne({ room: roomId })
        if (chat) {
            return chat.messages;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
};

const addMessage = async (roomId: string, sender: string, message: string) => {
    try {
        const chat = await Chat.findOne({ room: roomId });
        if (chat) {
            chat.messages.push({ sender, message });
            await chat.save();
            return true;
        } else {
            const newChat = new Chat({ room: roomId, messages: [{ sender, message }] });
            await newChat.save();
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

export = {
    addMessage,
    getMessages
}