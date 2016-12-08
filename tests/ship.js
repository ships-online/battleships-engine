import Ship from 'src/ship.js';

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
		it( 'should create an instance of Ship with some properties', () => {
			expect( ship ).to.have.property( 'id' ).to.equal( 1 );
			expect( ship ).to.have.property( 'length' ).to.equal( 3 );
			expect( ship ).to.have.property( 'isRotated' ).to.false;
			expect( ship ).to.have.property( 'isCollision' ).to.false;
			expect( ship ).to.have.property( 'damages' ).to.have.members( [ ,, ] );
			expect( ship ).to.have.property( 'position' ).to.have.members( [ null, null ] );
		} );

		it( 'should create id when is not specified', () => {
			expect( new Ship( 3 ) ).to.have.property( 'id' ).to.not.empty;
		} );


		it( 'should make some `isRotated` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isRotated', spy );

			ship.isRotated = true;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make some `isCollision` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isCollision', spy );

			ship.isCollision = true;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make some `damages` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:damages', spy );

			ship.damages = [ undefined, true, undefined ];

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make some `position` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:position', spy );

			ship.position = [ 3, 2 ];

			expect( spy.calledOnce ).to.true;
		} );
	} );

	describe( 'coordinates', () => {
		it( 'should return array of coordinates on the battlefield when ship has is not rotated', () => {
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

		it( 'should return array of coordinates on the battlefield when ship is rotated', () => {
			ship.position = [ 1, 1 ];
			ship.rotate();

			const result = ship.coordinates;

			expect( result ).to.instanceof( Array );
			expect( result ).to.have.length( 3 );

			expect( result[ 0 ] ).to.have.length( 2 );
			expect( result[ 0 ][ 0 ] ).to.equal( 1 );
			expect( result[ 0 ][ 1 ] ).to.equal( 1 );

			expect( result[ 1 ] ).to.have.length( 2 );
			expect( result[ 1 ][ 0 ] ).to.equal( 1 );
			expect( result[ 1 ][ 1 ] ).to.equal( 2 );

			expect( result[ 2 ] ).to.have.length( 2 );
			expect( result[ 2 ][ 0 ] ).to.equal( 1 );
			expect( result[ 2 ][ 1 ] ).to.equal( 3 );
		} );

		it( 'should return empty array if ship is not placed on the battlefield', () => {
			expect( ship.coordinates ).to.instanceof( Array );
			expect( ship.coordinates ).to.have.length( 0 );
		} );
	} );

	describe( 'rotate()', () => {
		it( 'should toggle rotation', () => {
			expect( ship.isRotated ).to.false;

			ship.rotate();

			expect( ship.isRotated ).to.true;

			ship.rotate();

			expect( ship.isRotated ).to.false;
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
