import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { SignUpExtended } from './components/auth/SignUpExtended';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { SignUpComplete } from './components/auth/SignUpComplete';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Contacts } from './pages/dashboard/Contacts';
import { CreateContact } from './pages/dashboard/CreateContact';
import { Bookings } from './pages/dashboard/Bookings';
import { CreateBooking } from './pages/dashboard/CreateBooking';
import { Diary } from './pages/dashboard/Diary';
import { System } from './pages/dashboard/System';
import { Profile } from './pages/dashboard/Profile';
import { Users } from './pages/settings/Users';
import { Roles } from './pages/settings/Roles';
import { RoleDetails } from './pages/settings/RoleDetails';
import { Locations } from './pages/settings/Locations';
import { LocationForm } from './pages/settings/LocationForm';
import { Tags } from './pages/settings/Tags';
import { ApiUsers } from './pages/settings/ApiUsers';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark-primary text-dark-text-primary">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-8">
                  <LandingPage />
                </div>
                <Footer />
              </>
            } />
            <Route path="/features" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-8">
                  <Features />
                </div>
                <Footer />
              </>
            } />
            <Route path="/pricing" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <Pricing />
                </div>
                <Footer />
              </>
            } />
            <Route path="/signin" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <SignIn />
                </div>
                <Footer />
              </>
            } />            
            <Route path="/signup" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <SignUp />
                </div>
                <Footer />
              </>
            } />
            <Route path="/signup/extended" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <SignUpExtended />
                </div>
                <Footer />
              </>
            } />
            <Route path="/signup/complete" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <SignUpComplete />
                </div>
                <Footer />
              </>
            } />
            <Route path="/forgot-password" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <ForgotPassword />
                </div>
                <Footer />
              </>
            } />
            <Route path="/verify-email" element={
              <>
                <Header />
                <div className="flex-grow flex items-center justify-center px-4 py-16">
                  <VerifyEmail />
                </div>
                <Footer />
              </>
            } />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/create" element={<CreateContact />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/create" element={<CreateBooking />} />
              <Route path="diary" element={<Diary />} />
              <Route path="system" element={<System />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings/emails" element={<div>Emails Settings</div>} />
              <Route path="settings/sms" element={<div>SMS Settings</div>} />
              <Route path="settings/roles" element={<Roles />} />
              <Route path="settings/roles/:id" element={<RoleDetails />} />
              <Route path="settings/users" element={<Users />} />
              <Route path="settings/tags" element={<Tags />} />
              <Route path="settings/api-users" element={<ApiUsers />} />
              <Route path="settings/locations" element={<Locations />} />
              <Route path="settings/locations/new" element={<LocationForm />} />
              <Route path="settings/locations/:id/edit" element={<LocationForm isEditing />} />
              <Route path="settings/users" element={<div>Users Settings</div>} />
              <Route path="settings/integrations" element={<div>Integrations Settings</div>} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;