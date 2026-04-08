import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers & Protectors
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import SetPassword from './pages/SetPassword';

// Layouts & Protected Pages
import AppLayout from './components/Layout/AppLayout';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeTasks from './pages/EmployeeTasks';
import EmployeePerformance from './pages/EmployeePerformance';
import EmployeeSalary from './pages/EmployeeSalary';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

// Admin / Manager placeholders




function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          
          {/* Default entry point goes to login, Login handles logged-in redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* ------------- EMPLOYEE NAMESPACE ------------- */}
          <Route 
            path="/employee" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="performance" element={<EmployeePerformance />} />
            <Route path="salary" element={<EmployeeSalary />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ------------- MANAGER NAMESPACE ------------- */}
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ------------- ADMIN NAMESPACE ------------- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>


          {/* Catch-all throws back to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
