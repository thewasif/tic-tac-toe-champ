import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/home';
import Game from './pages/game';

import './scss/index.scss';

function App() {
  return (
    <Router>
      <Route component={Home} path='/' exact />
      <Route component={Game} path='/game/:id' exact />
    </Router>
  );
}

export default App;
