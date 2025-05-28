// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import RecoverPassword from './components/RecoverPassword';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetList from './components/BudgetList';
import BudgetForm from './components/BudgetForm';
import ExportPDF from './components/ExportPDF';
import Profile from './components/Profile';

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="container mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated
                ? <Login />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated
                ? <Register />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/recover"
            element={
              !isAuthenticated
                ? <RecoverPassword />
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated
                ? <Dashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/transactions"
            element={
              isAuthenticated
                ? <TransactionList />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/transactions/new"
            element={
              isAuthenticated
                ? <TransactionForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/transactions/edit/:id"
            element={
              isAuthenticated
                ? <TransactionForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/budgets"
            element={
              isAuthenticated
                ? <BudgetList />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/budgets/new"
            element={
              isAuthenticated
                ? <BudgetForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/budgets/edit/:id"
            element={
              isAuthenticated
                ? <BudgetForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/export"
            element={
              isAuthenticated
                ? <ExportPDF />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated
                ? <Profile />
                : <Navigate to="/login" replace />
            }
          />

          {/* Catch-all: redirect based on auth */}
          <Route
            path="*"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
