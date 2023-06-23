export const conversationName = (text: string, username: string) => {
  const namesArray = text.split(",");

  return namesArray.filter(name => name !== username).join(",");
};

// ! For Message Array Only
export const groupSuccessive = (arr: Message[]): Message[][] => {
  return arr.reduce<Message[][]>((result, current) => {
    if (
      result.length === 0 ||
      result[result.length - 1][0].sender.id !== current.sender.id
    ) {
      result.push([current]);
    } else {
      result[result.length - 1].push(current);
    }
    return result;
  }, []);
};
