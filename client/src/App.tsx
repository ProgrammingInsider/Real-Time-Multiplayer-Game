import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import JoinPage from './pages/JoinPage'
import GamePage from './pages/GamePage'
import ContextAPI from './context/ContextAPI'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <ContextAPI>
      <Router>
        <Routes>
          <Route path="/" element={<JoinPage />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ContextAPI>
  )
}

export default App
