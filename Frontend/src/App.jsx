import { Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Game from "./pages/Game";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/game/:roomCode" element={<Game />} />
      <Route path="/room/:roomCode" element={<Room />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
