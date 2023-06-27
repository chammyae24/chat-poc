import { client } from "@/app/apollo/ApolloClientProvider";
import Conversation from "../../../(component)/Conversation";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";

type Props = {
  params: { id: string };
};

const GET_CONVERSATION = gql`
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
`;

export default async function ConversationPage({ params }: Props) {
  try {
    const result = await client.query({
      query: GET_CONVERSATION,
      variables: {
        id: params.id
      },
      context: {
        headers: {
          Authorization: `Bearer ${cookies().get("auth-access-token")?.value}`
        }
      }
    });
    // console.log({ result });
    const data = await result.data;

    const getConversation = await data.getConversation;

    return (
      <div>
        <Conversation conversation={getConversation} />
      </div>
    );
  } catch (err) {
    // console.log({ err });

    return (
      <div>
        <div>Error</div>
      </div>
    );
  }
}
