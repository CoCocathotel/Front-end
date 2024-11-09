// src/context/UserContext.js
// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   // Load initial user data from localStorage
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user-provider");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   // Save user data to localStorage whenever it changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user-provider", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user-provider");
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
