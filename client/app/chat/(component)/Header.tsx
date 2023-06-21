// "use client";

// import { useEffect } from "react";

// const Header = () => {
//   useEffect( () => {
//     (async () => {

//       try {
//         const res = await fetch(`${process.env.API_URL}/chat/${params.name}`, {
//           cache: "no-store"
//         });

//         if (!res.ok) {
//           throw new Error("Could not found user");
//         }

//         const user = await res.json();
//       } catch (err) {}
//     }

//     )()

//     return () => {}
//   }, []);

//   return <div></div>;
// };

// export default Header;
