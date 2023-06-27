import React from "react";
import ConversationsList from "../(component)/ConversationsList";
import { client } from "@/app/apollo/ApolloClientProvider";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";

type Props = {
  params: { name: string };
};

// client
//   .query({
//     query: gql`
//       query {
//         getConversation(id: "65ac57f6-4792-4b90-a019-b3d63396917c") {
//           id
//           name
//           messages {
//             id
//             content
//           }
//         }
//       }
//     `,
//     context: {
//       headers: {
//         Authorization:
//           "Bearer test"
//       }
//     }
//   })
//   .then(result => console.log({ result: result.data.getConversation }));

export default async function ChatPage({ params }: Props) {
  // console.log(cookies().get("auth-access-token")?.value);

  try {
    const res = await fetch(`${process.env.API_URL}/chat/${params.name}`, {
      cache: "no-store"
    });

    const result = await client.query({
      query: gql`
        query {
          getLoginUser {
            id
            username
            email
            created_at
            conversations {
              conversation {
                id
                name
              }
            }
            contacts {
              username
            }
          }
        }
      `,
      context: {
        headers: {
          Authorization: `Bearer ${cookies().get("auth-access-token")?.value}`
        }
      }
    });

    if (!res.ok) {
      throw new Error("Could not found user");
    }

    const user = await res.json();

    // console.log(result.data.getLoginUser);

    const data = await result.data;
    const getloginUser = await data.getLoginUser;

    // console.log({ test: await data });

    return (
      <div>
        <ConversationsList user={user} getloginUser={getloginUser} />
      </div>
    );
  } catch (e) {
    console.log(e);

    return (
      <div>
        <div>No User</div>
      </div>
    );
  }
}
