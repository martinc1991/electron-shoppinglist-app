const electron = require('electron');
const { ipcRenderer } = electron;

const submitForm = function (e) {
	e.preventDefault();
	const item = document.querySelector('#item').value;
	ipcRenderer.send('item:add', item);
};

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);
