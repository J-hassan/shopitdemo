import './App.css';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes"
import NotFound from './components/layout/NotFound';

function App() {

  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">

        <Toaster />
        <Header />

        <div className='container'>
          <Routes>

            {userRoutes}
            {adminRoutes}

            <Route path='*' element={<NotFound />}></Route>

          </Routes>
        </div>

        <Footer />

      </div>
    </Router>
  );
}

export default App;