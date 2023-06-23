import React, { useState } from 'react';
import { UserContext } from './UserContext';  // Import the context

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Initialize user state to null

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
