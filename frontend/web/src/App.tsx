import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import RegistrationPricing from './pages/RegistrationPricing';
import PersonalizationOnboarding from './pages/PersonalizationOnboarding';
import ScanPage from './pages/ScanPage';
import RecipeDetails from './pages/RecipeDetails';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <BrowserRouter>
      <div className="antialiased selection:bg-primary/20 selection:text-primary scroll-smooth min-h-[100dvh] flex flex-col">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
