import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTasks';
import EmployeePerformance from './pages/EmployeePerformance';
import EmployeeSalary from './pages/EmployeeSalary';
import AppLayout from './components/Layout/AppLayout';

// Placeholder for Simple Route Protection
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Automatically redirect from /employee purely to /employee/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="performance" element={<EmployeePerformance />} />
          <Route path="salary" element={<EmployeeSalary />} />
        </Route>

        {/* Fallbacks & Redirects */}
        <Route path="/tasks" element={<Navigate to="/employee/tasks" replace />} />
        <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
