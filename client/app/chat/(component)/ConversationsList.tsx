"use client";
import { conversationName } from "@/app/utils";
// import { useSession } from "next-auth/react";
import Link from "next/link";

const ConversationsList = ({ user }: { user: User }) => {
  // const { data: session } = useSession();
  // const createConversation = async () => {
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
  //       cache: "no-store",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + session?.user.accessToken
  //       },
  //       body: JSON.stringify({
  //         query: /* GraphQL */ `
  //           mutation CreateConversation(
  //             $name: String
  //             $participants: [String!]!
  //           ) {
  //             createConversation(name: $name, participants: $participants) {
  //               id
  //               name
  //               created_at
  //               updated_at
  //               participants {
  //                 id
  //               }
  //             }
  //           }
  //         `,
  //         // FIXME:
  //         variables: {
  //           name: "",
  //           participants: [""]
  //         }
  //       })
  //     });

  //     if (!res.ok) {
  //       const { error } = await res.json();
  //       throw new Error(error.message);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  console.log(user?.conversations);

  return (
    <div>
      <ul>
        {user.conversations?.map(c => (
          <li key={c.conversation.id}>
            <Link
              href={`/chat/${user.username}/conversation/${c.conversation.id}`}
            >
              <div>
                <p className="text-xl">
                  {c.conversation.name
                    ? conversationName(c.conversation.name, user.username)
                    : ""}
                </p>
                <span className=" text-xs">
                  {c.conversation.lastMessage?.content ?? ""}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={`/chat/${user.username}/conversation/create`}
        className="underline"
      >
        Add
      </Link>
    </div>
  );
};

export default ConversationsList;
