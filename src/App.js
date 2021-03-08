import { BrowserRouter as Router, Route } from 'react-router-dom';
import home from './pages/home';
import './scss/index.scss';

function App() {
  return (
    <Router>
      <Route component={home} path='/' exact />
    </Router>
  );
}

export default App;
