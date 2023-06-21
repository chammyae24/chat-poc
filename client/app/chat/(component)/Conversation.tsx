"use client";

type Props = {
  conversation: Conversations;
};

const Conversation = ({ conversation }: Props) => {
  console.log(conversation);

  return (
    <div>
      <ul>
        {conversation.messages?.map(message => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Conversation;
