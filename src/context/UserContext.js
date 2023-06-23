import React from 'react';

export const UserContext = React.createContext({
  user: null,  // Assume a null user by default
  setUser: () => {},  // Empty function by default
});
