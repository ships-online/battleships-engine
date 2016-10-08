import EmitterMixin from '../emittermixin.js';
import mix from '../mix.js';

class IoMock {
	once( ...args ) {
		this.on( ...args );
	}
}


mix( IoMock, EmitterMixin );

const ioMock = new IoMock();

export default function () {
	return ioMock;
}