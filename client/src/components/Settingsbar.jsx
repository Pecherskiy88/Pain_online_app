import React from 'react';

import toolsState from '../store/toolsState';

import '../styles/toolbar.scss';

const Settingsbar = () => {
	const handleWidth = (e) => {
		const { value } = e.target;
		toolsState.setLineWidth(value);
	};

	const handleColor = (e) => {
		const { value } = e.target;
		toolsState.setStrokeColor(value);
	};

	return (
		<div className="settings-bar">
			<label htmlFor="line-width">Толщина линии</label>
			<input
				onChange={handleWidth}
				style={{ margin: '0 10px' }}
				id="line-width"
				type="number"
				defaultValue={1}
				min={1}
				max={50}
			/>
			<label htmlFor="stroke-color">Цвет обводки</label>
			<input onChange={handleColor} style={{ margin: '0 10px' }} id="stroke-color" type="color" />
		</div>
	);
};

export default Settingsbar;
