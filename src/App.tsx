import React, { createContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/dashboard';
import { UserContextType } from './@core/interfaces/Interface';

import './styles/dashboard/dashboard.css';

export const UserContext = createContext<UserContextType | undefined>(undefined);

const App: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const contextValue = {
    showModal,
    setShowModal
  };

  return (
    <UserContext.Provider value={contextValue}>
      <Dashboard />
    </UserContext.Provider>
  )
}

export default App;
