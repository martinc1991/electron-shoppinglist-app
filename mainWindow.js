const electron = require('electron');
const { ipcRenderer } = electron;

const ul = document.querySelector('ul');
// Catch add:item
ipcRenderer.on('item:add', (e, item) => {
	const li = document.createElement('li');
	const itemText = document.createTextNode(item);
	li.className = 'collection-item';
	ul.className = 'collection';
	li.append(itemText);
	ul.append(li);
});

// Catch remove:item
ul.addEventListener('dblclick', (e) => {
	e.target.remove();
	if (ul.children.length == 0) {
		ul.className = '';
	}
});

// Catch clear:item
ipcRenderer.on('item:clear', (e, item) => {
	ul.innerHTML = '';
	ul.className = '';
});
