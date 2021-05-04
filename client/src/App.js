import React from 'react';

import Canvas from './components/Canvas';
import Settingsbar from './components/Settingsbar';
import Toolbar from './components/Toolbar';

import './styles/app.scss';

const App = () => {
	return (
		<div className="app">
			<Toolbar />
			<Settingsbar />
			<Canvas />
		</div>
	);
};

export default App;
