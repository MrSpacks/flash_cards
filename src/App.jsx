/**
 * @function App
 * @description Main component of the application, responsible for routing and layout.
 * It uses React Router for navigation and defines the application's routes.
 * The component also uses ThemeProvider to manage the application's theme.
 *
 * @returns {JSX.Element} The rendered React component.
 */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WordLists from "./pages/WordLists";
import AddWord from "./pages/AddWord";
import FlashCards from "./pages/FlashCards";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import AddDictionary from "./pages/AddDictionary";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes> 
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/settings" element={<Settings />} />
            <Route index element={<WordLists />} />
            <Route path="words" element={<WordLists />} />
            <Route path="add-word" element={<AddWord />} />
            <Route path="flash-cards" element={<FlashCards />} />
            <Route path="add-dictionary" element={<AddDictionary />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
