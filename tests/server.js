import Server from '../src/server.js';
import ioMock from '../src/utils/_test/iomock.js';
import EmitterMixin from '../src/utils/emittermixin.js';

describe( 'Server', () => {
	let server, gameEmitter, ioInstance;

	beforeEach( () => {
		ioInstance = ioMock();
		window.io = ioMock;

		gameEmitter = Object.create( EmitterMixin );
		server = new Server( gameEmitter );
	} );

	describe( 'create()', () => {
		it( 'should return Promise with game id', ( done ) => {
			server.create().then( ( gameID ) => {
				expect( gameID ).to.equal( 123 );
				done();
			} ).catch( ( err ) => done( err ) );

			ioInstance.emit( 'connect' );
			ioInstance.emit( 'create' );
			ioInstance.emit( 'createResponse', 123 );
		} );
	} );
} );
