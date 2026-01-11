import React, { createContext, useContext, useState, useEffect } from 'react';

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [homeCountry, setHomeCountry] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('irp_token');
    const savedUser = localStorage.getItem('irp_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user data:', err);
        // Clear corrupted data
        localStorage.removeItem('irp_token');
        localStorage.removeItem('irp_user');
      }
    }
    setLoading(false);
  }, []);

  // Save auth credentials
  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('irp_user', JSON.stringify(userData));
    localStorage.setItem('irp_token', authToken);
  };

  // Clear auth (logout)
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('irp_user');
    localStorage.removeItem('irp_token');
  };

  // Check if user is logged in
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Get saved plans for logged-in user
  const getUserPlans = async () => {
    if (!token) return [];
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Failed to fetch user plans:', err);
    }
    return [];
  };

  // Save plan to database (for authenticated users)
  const savePlanToDatabase = async (planData) => {
    if (!token || !user) return null;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...planData,
          userId: user.id
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Failed to save plan:', err);
    }
    return null;
  };

  // Save checklist progress (localStorage for guests, database for authenticated)
  const saveChecklistProgress = async (planId, checklistState) => {
    if (token && user && planId) {
      // Save to database for authenticated users
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plan/${planId}/checklist`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ checklistJson: checklistState })
        });
      } catch (err) {
        console.error('Failed to save checklist to database:', err);
      }
    }
    
    // Always save to localStorage as fallback
    const storageKey = `csme-plan-${homeCountry}-${targetCountry}-${category}`;
    localStorage.setItem(storageKey, JSON.stringify(checklistState));
  };

  const value = {
    homeCountry,
    targetCountry,
    category,
    plan,
    user,
    token,
    loading,
    isAuthenticated,
    setHomeCountry,
    setTargetCountry,
    setCategory,
    setPlan,
    saveAuth,
    clearAuth,
    getUserPlans,
    savePlanToDatabase,
    saveChecklistProgress
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) {
    throw new Error('usePlanner must be used within PlannerProvider');
  }
  return ctx;
}