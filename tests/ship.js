import Ship from '../src/ship.js';
import ObservableMixin from '../src/utils/observablemixin.js';

describe( 'Ship:', () => {
	let ship, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		ship = new Ship( 1, 3 );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Ship with some properties', () => {
			expect( ship ).to.have.property( 'id' ).to.equal( 1 );
			expect( ship ).to.have.property( 'orientation' ).to.equal( 'horizontal' );
			expect( ship ).to.have.property( 'position' ).to.instanceof( Array );
			expect( ship ).to.have.property( 'position' ).to.have.length( 2 );
			expect( ship.position[ 0 ] ).to.equal( null );
			expect( ship.position[ 1 ] ).to.equal( null );
			expect( ship ).to.have.property( 'isCollision' ).to.equal( false );
			expect( ship ).to.have.property( 'damages' ).to.instanceof( Array );
			expect( ship ).to.have.property( 'damages' ).to.have.length( 3 );
			expect( ship.damages[ 0 ] ).to.be.undefined;
			expect( ship.damages[ 1 ] ).to.be.undefined;
			expect( ship.damages[ 2 ] ).to.be.undefined;
		} );

		it( 'should mix ObservableMixin', () => {
			expect( ship.on ).to.be.equal( ObservableMixin.on );
			expect( ship.set ).to.be.equal( ObservableMixin.set );
		} );

		it( 'should make some properties observable', () => {
			const positionSpy = sinon.spy();
			const isCollisionSpy = sinon.spy();
			const damagesSpy = sinon.spy();
			const orientationSpy = sinon.spy();

			ship.on( 'change:position', positionSpy );
			ship.on( 'change:isCollision', isCollisionSpy );
			ship.on( 'change:damages', damagesSpy );
			ship.on( 'change:orientation', orientationSpy );

			ship.position = [ 1, 1 ];
			ship.isCollision = true;
			ship.damages = [ true, false, true ];
			ship.orientation = 'vertical';

			sinon.assert.calledOnce( positionSpy );
			sinon.assert.calledOnce( isCollisionSpy );
			sinon.assert.calledOnce( damagesSpy );
			sinon.assert.calledOnce( orientationSpy );
		} );
	} );

	describe( 'getter length', () => {
		it( 'should return length of ship', () => {
			expect( ship.length ).to.equal( 3 );
		} );
	} );

	describe( 'getter coordinates', () => {
		it( 'should return array of coordinates on the battlefield when ship has `horizontal` orientation', () => {
			ship.position = [ 1, 1 ];

			const result = ship.coordinates;

			expect( result ).to.instanceof( Array );
			expect( result ).to.have.length( 3 );

			expect( result[ 0 ] ).to.have.length( 2 );
			expect( result[ 0 ][ 0 ] ).to.equal( 1 );
			expect( result[ 0 ][ 1 ] ).to.equal( 1 );

			expect( result[ 1 ] ).to.have.length( 2 );
			expect( result[ 1 ][ 0 ] ).to.equal( 2 );
			expect( result[ 1 ][ 1 ] ).to.equal( 1 );

			expect( result[ 2 ] ).to.have.length( 2 );
			expect( result[ 2 ][ 0 ] ).to.equal( 3 );
			expect( result[ 2 ][ 1 ] ).to.equal( 1 );
		} );

		it( 'should return empty array if ship is not placed on the battlefield', () => {
			expect( ship.coordinates ).to.instanceof( Array );
			expect( ship.coordinates ).to.have.length( 0 );
		} );
	} );

	describe( 'rotate()', () => {
		it( 'should toggle orientation between `horizontal` and `vertical`', () => {
			ship.rotate();

			expect( ship.orientation ).to.equal( 'vertical' );

			ship.rotate();

			expect( ship.orientation ).to.equal( 'horizontal' );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return ship in JSON format', () => {
			let result = ship.toJSON();

			expect( result ).to.have.property( 'id', 1 );
			expect( result ).to.have.property( 'coordinates' ).to.instanceof( Array );
		} );
	} );
} );
