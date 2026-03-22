import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';

import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import RegistrationPricing from './pages/RegistrationPricing';
import PersonalizationOnboarding from './pages/PersonalizationOnboarding';
import ScanPage from './pages/ScanPage';
import RecipeDetails from './pages/RecipeDetails';
import AccountSettings from './pages/AccountSettings';
import MyPantry from './pages/MyPantry';
import BillingHistory from './pages/BillingHistory';
import CookingJournal from './pages/CookingJournal';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import RecipeAnalytics from './pages/RecipeAnalytics';
import Impressum from './pages/Impressum';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="antialiased selection:bg-primary/20 selection:text-primary scroll-smooth min-h-[100dvh] flex flex-col bg-surface">
        <Navigation />
        <main className="flex-1 w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegistrationPricing />} />
            <Route path="/onboarding" element={<PersonalizationOnboarding />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/pantry" element={<MyPantry />} />
            <Route path="/billing" element={<BillingHistory />} />
            <Route path="/journal" element={<CookingJournal />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<RecipeAnalytics />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
