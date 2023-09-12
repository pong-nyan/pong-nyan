import { Message } from '@/type/chatType';

export const addMessageToLocalStorage = (channelId: string, message : Message) => {
  const currentMessages = getMessagesFromLocalStorage(channelId);
  const updatedMessages = [...currentMessages, message];
  localStorage.setItem(`chat-${channelId}`, JSON.stringify(updatedMessages));
};

export const getMessagesFromLocalStorage = (channelId: string) => {
  const messages = localStorage.getItem(`chat-${channelId}`);
  return messages ? JSON.parse(messages) : [];
};
