import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Modal, Button } from 'react-bootstrap';

import canvasState from '../store/canvasState';
import toolsState from '../store/toolsState';

import Brush from '../tools/Brush';

import '../styles/canvas.scss';

const Canvas = observer(() => {
	const canvasRef = useRef();
	const usernameRef = useRef();
	const [modal, setModal] = useState(true);
	const params = useParams();

	useEffect(() => {
		canvasState.setCanvas(canvasRef.current);
		toolsState.setTool(new Brush(canvasRef.current));
	}, []);

	useEffect(() => {
		if (canvasState.username) {
			const socket = new WebSocket(`ws://localhost:5000/`);
			socket.onopen = () => {
				socket.send(JSON.stringify({ id: params.id, name: canvasState.username, method: 'connection' }));
			};
			socket.onmessage = (event) => {
				console.log(event.data);
			};
		}
	}, [canvasState.username]);

	const mouseDownHandler = () => {
		canvasState.pushToUndo(canvasRef.current.toDataURL());
	};

	const connectionHandler = () => {
		canvasState.setUsername(usernameRef.current.value);
		setModal(false);
	};

	return (
		<div className="canvas">
			<Modal show={modal} onHide={() => {}}>
				<Modal.Header>
					<Modal.Title>Введите ваше имя</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input type="text" ref={usernameRef} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => connectionHandler()}>
						Войти
					</Button>
				</Modal.Footer>
			</Modal>
			<canvas onMouseDown={mouseDownHandler} ref={canvasRef} width={600} height={400}></canvas>
		</div>
	);
});

export default Canvas;
