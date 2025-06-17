import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './pages/game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
//<Route path="/commission-request" element={<CommissionRequest />} />