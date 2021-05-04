import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

import canvasState from '../store/canvasState';
import toolsState from '../store/toolsState';

import Brush from '../tools/Brush';
import Rect from '../tools/Rect';

import '../styles/canvas.scss';

const Canvas = observer(() => {
	const canvasRef = useRef();
	const usernameRef = useRef();
	const [modal, setModal] = useState(true);
	const params = useParams();

	useEffect(() => {
		canvasState.setCanvas(canvasRef.current);
		const ctx = canvasRef.current.getContext('2d');
		axios.get(`http://localhost:5000/image?id=${params.id}`).then((response) => {
			const img = new Image();
			img.src = response.data;
			img.onload = () => {
				ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
				ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
			};
		});
	}, []);

	useEffect(() => {
		if (canvasState.username) {
			const socket = new WebSocket(`ws://localhost:5000/`);
			canvasState.setSessionId(params.id);
			toolsState.setTool(new Brush(canvasRef.current, socket, params.id));
			canvasState.setSocket(socket);
			socket.onopen = () => {
				socket.send(JSON.stringify({ id: params.id, name: canvasState.username, method: 'connection' }));
			};
			socket.onmessage = (event) => {
				const msg = JSON.parse(event.data);
				switch (msg.method) {
					case 'connection':
						console.log(`Пользователь ${msg.name} присоединился`);
						break;
					case 'draw':
						drawHandler(msg);
						break;
				}
			};
		}
	}, [canvasState.username]);

	const mouseDownHandler = () => {
		canvasState.pushToUndo(canvasRef.current.toDataURL());
		axios
			.post(`http://localhost:5000/image?id=${params.id}`, {
				img: canvasRef.current.toDataURL(),
			})
			.then((response) => console.log(response));
	};

	const connectionHandler = () => {
		canvasState.setUsername(usernameRef.current.value);
		setModal(false);
	};

	const drawHandler = (msg) => {
		const figure = msg.figure;
		const ctx = canvasRef.current.getContext('2d');
		switch (figure.type) {
			case 'brush':
				Brush.draw(ctx, figure.x, figure.y);
				break;
			case 'rect':
				Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
				break;
			case 'finish':
				ctx.beginPath();
				break;
		}
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
