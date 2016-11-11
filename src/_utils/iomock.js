import EmitterMixin from '../../../battleships-utils/src/emittermixin.js';
import mix from '../../../battleships-utils/src/mix.js';

class IoMock {
	emit( ...args ) {
		this.fire( ...args );
	}
}


mix( IoMock, EmitterMixin );

const ioMock = new IoMock();

export default function () {
	return ioMock;
}
