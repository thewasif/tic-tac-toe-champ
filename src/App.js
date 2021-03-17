import { BrowserRouter as Router, Route } from 'react-router-dom';

import home from './pages/home';
import game from './pages/game';

import './scss/index.scss';

function App() {
  return (
    <Router>
      <Route component={home} path='/' exact />
      <Route component={game} path='/game' exact />
    </Router>
  );
}

export default App;
