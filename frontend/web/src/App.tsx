import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

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
      <div className="antialiased selection:bg-primary/20 selection:text-primary scroll-smooth min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
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
      </div>
    </BrowserRouter>
  );
}

export default App;
