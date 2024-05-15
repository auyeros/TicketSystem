import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

const initialState = {
  user: null,
  error: null,
  success: false
};

const actionTypes = {
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  SET_SUCCESS: 'SET_SUCCESS'
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case actionTypes.SET_SUCCESS:
      return { ...state, success: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        dispatch({ type: actionTypes.SET_USER, payload: session?.user ?? null });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: true });
      },
      (error) => {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message || 'An error occurred. Please try again later.' });
      }
    );

    return () => authListener?.unsubscribe();
  }, []);

  const authActions = useMemo(() => {
    const signIn = async (email, password) => {
      try {
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) throw error;
        dispatch({ type: actionTypes.SET_USER, payload: user });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: true });
        return { user };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { error };
      }
    };

    const signUp = async (email, password) => {
      try {
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        dispatch({ type: actionTypes.SET_USER, payload: user });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: true });
        return { user };
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { error };
      }
    };

    const updateUser = async (userUpdates) => {
      try {
        const { error } = await supabase.auth.updateUser(userUpdates);
        if (error) throw error;
        dispatch({ type: actionTypes.SET_USER, payload: userUpdates });
        dispatch({ type: actionTypes.SET_SUCCESS, payload: true });
        return {};
      } catch (error) {
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        return { error };
      }
    };

    return { signIn, signUp, updateUser };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, ...authActions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);