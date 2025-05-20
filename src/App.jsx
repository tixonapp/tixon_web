// Update in App.jsx
//test
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/landing_page//NavBar/NavBar';
import PhoneNavbar from './components/landing_page/PhoneNavBar/PhoneNavBar';
import { FilterProvider } from './Context/FilterContext';
import data from './Data/data.json';
import './App.css';
import { Profiler } from 'react';
import { AuthProvider } from '../src/supabase/AuthContext';
import { AnimatePresence } from 'framer-motion';
import PageAnimation from './components/common/PageAnimation';
import LoadingSpinner from './components/common/LoadingSpinner';

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
import TicketDownload from './pages/TicketDownload';

// Super Admin pages
const SuperAdmin = lazy(() => import('./pages/SuperAdmin'));
const SuperAdminCreators = lazy(() => import('./pages/SuperAdminCreators'));
const SuperAdminOrganizers = lazy(() => import('./pages/SuperAdminOrganizers'));
const SuperAdminRegistrations = lazy(() => import('./pages/SuperAdminRegistrations'));
const SuperAdminUsers = lazy(() => import('./pages/SuperAdminUsers'));
const SuperAdminEventEdit = lazy(() => import('./pages/SuperAdminEventEdit'));

document.title = 'Tixon';

// Wrapper component to handle AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <EventSections />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/event/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <EventPage data={data} />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/event/:id/tickets" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <TicketPurchase />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/tickets/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <TicketDownload />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SignupPage />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/signin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SigninPage />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <ForgotPasswordPage />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/create-event" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <EventForm />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <AdminPanel />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/admin/events/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <AdminEventEdit />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/admin/creators" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <AdminCreators />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/admin/organizers" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <AdminOrganizers />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/admin/registrations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <AdminRegistrations />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/confirmation/:paymentId" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <PaymentConfirmation />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdmin />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin/events/:id" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdminEventEdit />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin/creators" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdminCreators />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin/organizers" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdminOrganizers />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin/registrations" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdminRegistrations />
            </PageAnimation>
          </Suspense>
        } />
        <Route path="/super-admin/users" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PageAnimation>
              <SuperAdminUsers />
            </PageAnimation>
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
};

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
              <AnimatedRoutes />
            </div>
          </Router>
        </FilterProvider>
      </AuthProvider>
    </Profiler>
  );
}

export default App;
