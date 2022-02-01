import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
const ENDPOINT = 'http://127.0.0.1:4001';

function App() {
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        // Set up WebSocket connection and event-based calls
        const socket = socketIOClient(ENDPOINT);
        socket.on('user_update', list => {
            setUsers(list);
        });
        socket.on('user_accepted', () => {
            document.getElementById('name-input').remove();
        });
        socket.on('user_rejected', (msg) => {
            let error = document.getElementById('error');
            error.innerText = msg;
        });
        socket.on('new_board', (board) => {
            let letters = ['B', 'I', 'N', 'G', 'O'];
            let boardTable = document.getElementById('board');

            // Create individual cells on the board
            for (let i = 0; i < 5; i++) {
                let row  = document.createElement('tr');
                row.classList.add('board-row')
                for (let j = 0; j < 5; j++) {
                    let cell = document.createElement('td');
                    cell.classList.add('board-cell')
                    let text = letters[i] + board[i][j];
                    if (text === 'N0') {
                        text = 'Free'
                    }
                    cell.innerText = text;
                    row.appendChild(cell);
                }
                boardTable.appendChild(row);
            }
        });

        // Name input handling
        const startButton = document.getElementById('join-button');
        startButton.addEventListener('click', () => {
            let username = document.getElementById('username').value;
            socket.emit('new_user', username);
        });
    }, []);

    return (
        <div className='App'>
            <h1>Bingo</h1>
            <div id='name-input'>
                <label>Enter Username: </label>
                <input id='username'/>
                <button id='join-button'>Join</button>
                <p id='error'></p>
            </div>
            <div className='users'>
                <h2>Users {users.length}/5</h2>
                <ul id='users-list'>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
                </ul>
            </div>
            <table id='board'>
            </table>
        </div>
    );
}

export default App;
