

// // src/App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './Context/AuthContext';
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import Dashboard from './components/Dashboard';
// import Navbar from './common/Navbar';
// import PrivateRoute from './common/PrivateRoute';
// import OrderList from './components/orders/OrderList';
// import CreateOrder from './components/orders/CreateOrder';
// import PartnerList from './components/partners/PartnerList';
// import PartnerCreate from './components/partners/PartnerCreate';
// import AssignmentList from './components/assignments/AssignmentList';


// const App: React.FC = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <div className="container mx-auto px-4 py-8">
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route 
//                 path="/" 
//                 element={
//                   <PrivateRoute>
//                     <Dashboard />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/orders" 
//                 element={
//                   <PrivateRoute>
//                     <OrderList />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/orders/create" 
//                 element={
//                   <PrivateRoute>
//                     <CreateOrder />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/partners" 
//                 element={
//                   <PrivateRoute>
//                     <PartnerList />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/partners/create" 
//                 element={
//                   <PrivateRoute>
//                     <PartnerCreate />
//                   </PrivateRoute>
//                 } 
//               />
//               <Route 
//                 path="/assignments" 
//                 element={
//                   <PrivateRoute>
//                     <AssignmentList />
//                   </PrivateRoute>
//                 } 
//               />
//             </Routes>
//           </div>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import Navbar from './common/Navbar';
import PrivateRoute from './common/PrivateRoute';
import PartnerPrivateRoute from './common/PartnerPrivateRoute';
import OrderList from './components/orders/OrderList';
import CreateOrder from './components/orders/CreateOrder';
import PartnerList from './components/partners/PartnerList';
import PartnerCreate from './components/partners/PartnerCreate';
import AssignmentList from './components/assignments/AssignmentList';
import DeliveryPartner from './components/DeliveryPartner';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Partner Routes */}
              <Route 
                path="/partner/dashboard" 
                element={
                  <PrivateRoute>
                    <DeliveryPartner />
                  </PrivateRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <PrivateRoute>
                    <OrderList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/orders/create" 
                element={
                  <PrivateRoute>
                    <CreateOrder />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/partners" 
                element={
                  <PrivateRoute>
                    <PartnerList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/partners/create" 
                element={
                  <PrivateRoute>
                    <PartnerCreate />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/assignments" 
                element={
                  <PrivateRoute>
                    <AssignmentList />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;