// Update in App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/landing_page//NavBar/NavBar';
import PhoneNavbar from './components/landing_page/PhoneNavBar/PhoneNavBar';
import { FilterProvider } from './Context/FilterContext';
import data from './Data/data.json';
import './App.css';
import { Profiler } from 'react';
import { AuthProvider } from '../src/supabase/AuthContext';

const EventPage = lazy(() => import('./pages/EventPage'));
import EventSections from './components/landing_page/EventsSection/EventsSection';
const SignupPage = lazy(() => import('./pages/Signup'));
const SigninPage = lazy(() => import('./pages/Signin'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const EventForm = lazy(() => import('./pages/EventForm'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminCreators = lazy(() => import('./pages/AdminCreators'));
const AdminOrganizers = lazy(() => import('./pages/AdminOrganizers'));
const AdminRegistrations = lazy(() => import('./pages/AdminRegistrations'));
const AdminEventEdit = lazy(() => import('./pages/AdminEventEdit'));
const TicketPurchase = lazy(() => import('./pages/TicketPurchase'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));

// Super Admin pages
const SuperAdmin = lazy(() => import('./pages/SuperAdmin'));
const SuperAdminCreators = lazy(() => import('./pages/SuperAdminCreators'));
const SuperAdminOrganizers = lazy(() => import('./pages/SuperAdminOrganizers'));
const SuperAdminRegistrations = lazy(() => import('./pages/SuperAdminRegistrations'));
const SuperAdminUsers = lazy(() => import('./pages/SuperAdminUsers'));
const SuperAdminEventEdit = lazy(() => import('./pages/SuperAdminEventEdit'));

document.title = 'Tixon';

function App() {
  return (
    <Profiler id="App" onRender={(id, phase, actualDuration) => {
      console.log(`Component ${id} took ${actualDuration}ms to render`);
    }}>
      <AuthProvider>
        <FilterProvider>
          <Router>
            <Navbar />
            <PhoneNavbar />
            <div className="main-content">
              <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<EventSections />} />
                  <Route path="/event/:id" element={<EventPage data={data} />} />
                  <Route path="/event/:id/tickets" element={<TicketPurchase />} />
                  <Route path="/signup" element={<SignupPage/>} />
                  <Route path="/signin" element={<SigninPage/>} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
                  <Route path="/create-event" element={<EventForm />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/events/:id" element={<AdminEventEdit />} />
                  <Route path="/admin/creators" element={<AdminCreators />} />
                  <Route path="/admin/organizers" element={<AdminOrganizers />} />
                  <Route path="/admin/registrations" element={<AdminRegistrations />} />
                  <Route path="/confirmation/:paymentId" element={<PaymentConfirmation />} />
                  
                  {/* Super Admin Routes */}
                  <Route path="/super-admin" element={<SuperAdmin />} />
                  <Route path="/super-admin/events/:id" element={<SuperAdminEventEdit />} />
                  <Route path="/super-admin/creators" element={<SuperAdminCreators />} />
                  <Route path="/super-admin/organizers" element={<SuperAdminOrganizers />} />
                  <Route path="/super-admin/registrations" element={<SuperAdminRegistrations />} />
                  <Route path="/super-admin/users" element={<SuperAdminUsers />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </FilterProvider>
      </AuthProvider>
    </Profiler>
  );
}

export default App;
