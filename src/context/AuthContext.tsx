"use client";
import * as React from "react";

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
  | { type: "logOut"; cb?: (authState: AuthState) => void };

export const AuthInitialState: AuthState = {
  name: undefined,
  nickName: undefined,
  initialized: false,
  isLogin: false,
  isPlay: false
};

export const authReducer =
  () =>
  (prevState: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "initialize": {
        const state: AuthState = { ...prevState, initialized: true };
        return state;
      }
      case "logIn": {
        const { payload, cb } = action;
        const state: AuthState = {
          ...prevState,
          ...payload,
          isPlay:true,
          isLogin: true,
          initialized: true,
        };
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

  const [authState, authDispatch] = React.useReducer(
    authReducer(),
    AuthInitialState
  );

  const authContextValue = React.useMemo(
    () => ({
      authState,
      authDispatch,
    }),
    [authState]
  );

  React.useEffect(() => {
    authState.isPlay && audioRef.current?.play()
  },[authState]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <audio ref={audioRef} autoPlay loop>
        <source src="/truc-linh/happy-birthday.ogg" type="audio/ogg" />
      </audio>
    </AuthContext.Provider>
  );
};
