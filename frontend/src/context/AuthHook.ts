import { createContext, useContext, useState, ReactNode } from 'react';

// AuthContext의 값에 대한 타입을 정의합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

export const useAuth = () => useContext(AuthContext);

// AuthProvider의 props에 대한 타입을 정의합니다.
interface AuthProviderProps {
  children: ReactNode;
}

// const CountProvider = ({ children }: Props): JSX.Element => {

const AuthProvider = ({ children }: JSX.Element | JSX.Element[]): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };