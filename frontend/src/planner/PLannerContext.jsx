import React, { createContext, useContext, useState } from 'react';

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [homeCountry, setHomeCountry] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState(null);

  const value = {
    homeCountry,
    targetCountry,
    category,
    plan,
    setHomeCountry,
    setTargetCountry,
    setCategory,
    setPlan
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
