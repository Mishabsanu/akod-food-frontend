"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login as reduxLogin, logout as reduxLogout, fetchProfile } from '@/store/slices/authSlice';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
}

type AuthStep = "OFFER" | "IDENTITY" | "OTP" | "DETAILS";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  modalInitialStep: AuthStep;
  setAuthModalOpen: (isOpen: boolean, step?: AuthStep) => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<AuthStep>("OFFER");

  useEffect(() => {
    const token = localStorage.getItem('akodUserToken');
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  // Periodic Offer Modal Trigger
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isAuthenticated) {
      interval = setInterval(() => {
        if (!isAuthModalOpen) {
          setAuthModalOpen(true, "OFFER");
        }
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, isAuthModalOpen]);

  const setAuthModalOpen = (isOpen: boolean, step: AuthStep = "OFFER") => {
    setModalInitialStep(step);
    setIsAuthModalOpen(isOpen);
  };

  const login = (token: string, userData: User) => {
    dispatch(reduxLogin({ user: userData, token }));
  };

  const logout = async () => {
    dispatch(reduxLogout());
    window.location.href = '/';
  };

  const refreshUser = async () => {
    await dispatch(fetchProfile());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      isAuthModalOpen,
      modalInitialStep,
      setAuthModalOpen,
      login, 
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
