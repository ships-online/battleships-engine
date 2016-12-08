import Ship from 'src/ship.js';

describe( 'Ship', () => {
	let ship, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		ship = new Ship( 3, 1 );
	} );

	afterEach( () => sandbox.restore() );


} );
