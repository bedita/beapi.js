import { BEModel } from './models.nextjs';
import { BEApi } from './beapi.next.js';
import { BEApiQueue } from './beapi.queue.next.js';
import { BEObject } from './object.next.js';
import { BECollection } from './collection.next.js';

try {
	let heartStyle = 'color: red; font-size: 3em;',
		logoStyle = 'color: black; font-size: 2em; font-family: Georgia;';
	console.log("%c" + String.fromCharCode(10084) + "%c BEdita", heartStyle, logoStyle);
} catch(ex) {
	//
}
