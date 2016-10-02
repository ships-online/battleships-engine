import Ship from '../src/ship.js';
import Item from '../src/item.js';

describe( 'Ship:', () => {
	let ship, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		ship = new Ship( 3, 1 );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should extend Item class', () => {
			expect( ship ).to.be.instanceof( Item );
		} );

		it( 'should create an instance of Ship with some properties', () => {
			expect( ship ).to.have.property( 'isCollision' ).to.equal( false );
			expect( ship ).to.have.property( 'damages' ).to.instanceof( Array );
			expect( ship ).to.have.property( 'damages' ).to.have.length( 3 );
			expect( ship.damages[ 0 ] ).to.be.undefined;
			expect( ship.damages[ 1 ] ).to.be.undefined;
			expect( ship.damages[ 2 ] ).to.be.undefined;
		} );

		it( 'should make some properties observable', () => {
			const isCollisionSpy = sinon.spy();
			const damagesSpy = sinon.spy();

			ship.on( 'change:isCollision', isCollisionSpy );
			ship.on( 'change:damages', damagesSpy );

			ship.isCollision = true;
			ship.damages = [ true, false, true ];

			expect( isCollisionSpy.calledOnce ).to.true;
			expect( damagesSpy.calledOnce ).to.true;
		} );
	} );
} );
