import React from "react";
import ConversationsList from "../(component)/ConversationsList";
// import { client } from "@/app/apollo/ApolloClientProvider";
// import { gql } from "@apollo/client";
import { cookies } from "next/headers";

// const GET_LOGIN_USER = gql`
//   query {
//     getLoginUser {
//       id
//       username
//       email
//       created_at
//       conversations {
//         conversation {
//           id
//           name
//         }
//       }
//       contacts {
//         username
//       }
//     }
//   }
// `;

export default async function ChatPage() {
  try {
    const res = await fetch("http://localhost:4130/graphql", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("auth-access-token")?.value}`
      },
      body: JSON.stringify({
        query: /* GraphQL */ `
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
        `
      })
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error.message);
    }

    const json = await res.json();
    const data = await json.data;

    const getLoginUser = await data.getLoginUser;

    return (
      <div>
        <ConversationsList user={getLoginUser} />
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
