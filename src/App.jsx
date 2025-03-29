import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EventSections from './landing_page/components/EventsSection/EventsSection';
import Navbar from './landing_page/components/NavBar/NavBar';
import PhoneNavbar from './landing_page/components/PhoneNavBar/PhoneNavBar';
// import EventPage from './pages/EventPage';
// import SignupPage from './pages/Signup';
// import SigninPage from './pages/Signin';
// import ForgotPasswordPage from './pages/ForgotPassword';
import { FilterProvider } from './Context/FilterContext';
import data from './Data/data.json';
import './App.css';
import { Profiler } from 'react';
const EventPage = lazy(() => import('./pages/EventPage'));
const EventSections = lazy(() => import('./landing_page/components/EventsSection/EventsSection'));
const SignupPage = lazy(() => import('./pages/Signup'));
const SigninPage = lazy(() => import('./pages/Signin'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));

document.title = 'Tixon';

function App() {
  return (
    <Profiler id="App" onRender={(id, phase, actualDuration) => {
  console.log(`Component ${id} took ${actualDuration}ms to render`);
}}>
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
          </Routes>
        </div>
      </Router>
    </FilterProvider>
    </Profiler>
  );
}

export default App;
