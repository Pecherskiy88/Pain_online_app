import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Canvas from './components/Canvas';
import Settingsbar from './components/Settingsbar';
import Toolbar from './components/Toolbar';

import './styles/app.scss';

const App = () => {
	return (
		<BrowserRouter>
			<div className="app">
				<Switch>
					<Route path="/:id">
						<Toolbar />
						<Settingsbar />
						<Canvas />
					</Route>
					<Redirect to={`f${(+new Date()).toString()}`} />
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default App;
