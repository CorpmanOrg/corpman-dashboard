// "use client";

// import { useState } from "react";
// import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [createUserWithEmailAndPassword, user, loading, error] = ""
//     // useCreateUserWithEmailAndPassword(auth);

//   // if (error) {
//   //   return (
//   //     <div>
//   //       <p>Error: {error.message}</p>
//   //     </div>
//   //   );
//   // }
//   // if (loading) {
//   //   return <p>Loading...</p>;
//   // }
//   // if (user) {
//   //   return (
//   //     <div>
//   //       <p>Registered User: {user.user.email}</p>
//   //     </div>
//   //   );
//   // }
//   return (
//     <div className="App">
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Enter Email"
//         className="text-black"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Enter Password"
//         className="text-black"
//       />
//       {/* <button onClick={() => createUserWithEmailAndPassword(email, password)}>
//         Register
//       </button> */}
//     </div>
//   );
// };

// export default Signup;
