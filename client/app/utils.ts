export const conversationName = (text: string, username: string) => {
  const namesArray = text.split(",");

  return namesArray.filter(name => name !== username).join(",");
};
