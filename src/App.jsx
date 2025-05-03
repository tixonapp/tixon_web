import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/landing_page//NavBar/NavBar';
import PhoneNavbar from './components/landing_page/PhoneNavBar/PhoneNavBar';
import { FilterProvider } from './Context/FilterContext';
import data from './Data/data.json';
import './App.css';
import { Profiler } from 'react';
import { AuthProvider } from '../src/supabase/AuthContext';
// import EventForm from './pages/EventForm';
const EventPage = lazy(() => import('./pages/EventPage'));
const EventSections = lazy(() => import('./components/landing_page/EventsSection/EventsSection'));
const SignupPage = lazy(() => import('./pages/Signup'));
const SigninPage = lazy(() => import('./pages/Signin'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const EventForm = lazy(() => import('./pages/EventForm'));
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
          <Routes>
            <Route path="/" element={<EventSections />} />
            <Route path="/event/:id" element={<EventPage data={data} />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/signin" element={<SigninPage/>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
            <Route path="/create-event" element={<EventForm />} />
          </Routes>
        </div>
      </Router>
    </FilterProvider>
    </AuthProvider>
    </Profiler>
  );
}

export default App;
