import React from 'react';

import toolsState from '../store/toolsState';
import canvasState from '../store/canvasState';

import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';

import '../styles/toolbar.scss';

const Toolbar = () => {
	const handleBrush = (SelectTool) => {
		toolsState.setTool(new SelectTool(canvasState.canvas));
	};

	const handleChangeColor = (e) => {
		const { value } = e.target;
		toolsState.setStrokeColor(value);
		toolsState.setFillColor(value);
	};

	return (
		<div className="toolbar">
			<button className="toolbar__btn brush" onClick={() => handleBrush(Brush)} />
			<button className="toolbar__btn rect" onClick={() => handleBrush(Rect)} />
			<button className="toolbar__btn circle" onClick={() => handleBrush(Circle)} />
			<button className="toolbar__btn eraser" onClick={() => handleBrush(Eraser)} />
			<button className="toolbar__btn line" onClick={() => handleBrush(Line)} />
			<input onChange={(e) => handleChangeColor(e)} type="color" style={{ marginRight: '10px' }} />
			<button className="toolbar__btn undo" onClick={() => canvasState.undo()} />
			<button className="toolbar__btn redo" onClick={() => canvasState.redo()} />
			<button className="toolbar__btn save" />
		</div>
	);
};

export default Toolbar;
