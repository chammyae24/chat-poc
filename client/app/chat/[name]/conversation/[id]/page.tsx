import Conversation from "../../../(component)/Conversation";
import { cookies } from "next/headers";

type Props = {
  params: { id: string };
};

export default async function ConversationPage({ params }: Props) {
  try {
    const res = await fetch(`${process.env.API_URL}/graphql`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies().get("auth-access-token")?.value
      },
      body: JSON.stringify({
        query: /* GraphQL */ `
          query GetConversation($id: String!) {
            getConversation(id: $id) {
              id
              name
              created_at
              updated_at
              messages {
                id
                content
                sent_at
                sender {
                  id
                  username
                }
              }
              participants {
                id
                username
                email
              }
            }
          }
        `,
        variables: {
          id: params.id
        }
      })
    });

    const { data } = await res.json();
    const getConversation = await data.getConversation;

    return (
      <div>
        <Conversation conversation={getConversation} />
      </div>
    );
  } catch (err) {
    console.log({ err });

    return (
      <div>
        <div>Error</div>
      </div>
    );
  }
}
