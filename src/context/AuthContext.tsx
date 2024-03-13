"use client";
import * as React from "react";
import useLocalStorage from "./useLocalStorage";

export interface AuthState {
  isLogin: boolean;
  name: string | undefined;
  nickName: string | undefined;
  initialized: Boolean;
  isPlay: Boolean;
}

export type AuthAction =
  | {
      type: "initialize";
    }
  | {
      type: "logIn";
      payload: Partial<AuthState>;
      cb?: (authState: AuthState) => void;
    }
  | {
      type: "updateFromStorage";
      payload: Partial<AuthState>;
    }
  | { type: "logOut"; cb?: (authState: AuthState) => void };

export const AuthInitialState: AuthState = {
  name: undefined,
  nickName: undefined,
  initialized: false,
  isLogin: false,
  isPlay: false,
};

export const authReducer =
  (setStore: (value: AuthState) => void) =>
  (prevState: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "initialize": {
        const state: AuthState = { ...prevState, initialized: true };
        return state;
      }
      case "updateFromStorage": {
        const { payload } = action;
        const state: AuthState = {
          ...prevState,
          ...payload,
          initialized: true,
        };
        return state;
      }
      case "logIn": {
        const { payload, cb } = action;
        const state: AuthState = {
          ...prevState,
          ...payload,
          isPlay: true,
          isLogin: true,
          initialized: true,
        };
        setStore(state);
        cb?.(state);

        return state;
      }
      case "logOut": {
        const { cb } = action;
        const state: AuthState = {
          ...prevState,
          ...AuthInitialState,
          initialized: true,
        };
        setStore(state);
        cb?.(state);
        return state;
      }
      default:
        throw new Error("Unexpected action");
    }
  };

const authContext: {
  authState: AuthState;
  authDispatch: React.Dispatch<AuthAction>;
} = {
  authState: AuthInitialState,
  authDispatch: () => null,
};

export const AuthContext = React.createContext(authContext);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { storedValue, setValue } = useLocalStorage<AuthState>([
    "name",
    "nickName",
    "isPlay",
    "isLogin",
    "initialized",
  ]);

  const [authState, authDispatch] = React.useReducer(
    authReducer(setValue),
    AuthInitialState
  );

  const authContextValue = React.useMemo(
    () => ({
      authState,
      stored: storedValue,

      authDispatch,
      setStore: setValue,
    }),
    [authState, setValue, storedValue]
  );

  React.useEffect(() => {
    authState.isPlay && audioRef.current?.play();
  }, [authState]);

  React.useEffect(() => {
    authDispatch({
      type: "updateFromStorage",
      payload: { ...storedValue },
    });
  }, [storedValue]);

  React.useEffect(() => {
    const logout = () => authDispatch({ type: "logOut" });
    window.addEventListener("beforeunload", logout);
    return () => {
      window.removeEventListener("beforeunload", logout);
    };
  }, [authDispatch]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <audio ref={audioRef} autoPlay loop>
        <source src="/truc-linh/happy-birthday.ogg" type="audio/ogg" />
      </audio>
    </AuthContext.Provider>
  );
};
