import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Add Bootstrap CSS
import AnimatedBarChart from './animatedBarChart/src/BarChart';
import CollapsibleTree from './collapsibleTree/src/Tree';
import VertexSphere from './vertexSphere/src/Scene';

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/animated-bar-chart">Animated Bar Chart Project</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/collapsible-tree">Collapsible Tree Project</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/vertex-sphere">Vertex Sphere Project</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/animated-bar-chart" component={AnimatedBarChart} />
          <Route path="/collapsible-tree" component={CollapsibleTree} />
          <Route path="/vertex-sphere" component={VertexSphere} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;