export function addMessageToLocalStorage(channelId: string, message: string) {
  const key = `channel-${channelId}-messages`;
  const storedMessages = localStorage.getItem(key);
  const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
  existingMessages.push(message);
  localStorage.setItem(key, JSON.stringify(existingMessages));
}

export function getMessagesFromLocalStorage(channelId: string) {
  const key = `channel-${channelId}-messages`;
  const storedMessages = localStorage.getItem(key);
  return storedMessages ? JSON.parse(storedMessages) : [];
}
