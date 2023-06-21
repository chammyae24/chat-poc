import Conversation from "../../(component)/Conversation";

type Props = {
  params: { id: string };
};

export default async function ConversationPage({ params }: Props) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/chat/conversation/${params.id}`
    );

    const { conversation } = await res.json();

    // console.log({ result: await res.json() });

    return (
      <div>
        <Conversation conversation={conversation} />
      </div>
    );
  } catch (err) {
    return (
      <div>
        <div>Error</div>
      </div>
    );
  }
}
