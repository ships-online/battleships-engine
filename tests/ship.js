import Ship from 'src/ship.js';

describe( 'Ship:', () => {
	let ship, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		ship = new Ship( {
			length: 3,
			id: 1,
			isRotated: true
		} );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Ship with given values', () => {
			expect( ship ).to.have.property( 'id' ).to.equal( 1 );
			expect( ship ).to.have.property( 'length' ).to.equal( 3 );
			expect( ship ).to.have.property( 'isRotated' ).to.true;
			expect( ship ).to.have.property( 'isCollision' ).to.false;
			expect( ship ).to.have.property( 'position' ).to.have.members( [ null, null ] );
			expect( ship ).to.have.property( 'damages' ).to.have.members( [ false, false, false ] );
		} );

		it( 'should create an instance of Ship with default values', () => {
			ship = new Ship( {
				length: 3
			} );

			expect( ship ).to.have.property( 'id' ).to.ok;
			expect( ship ).to.have.property( 'length' ).to.equal( 3 );
			expect( ship ).to.have.property( 'isRotated' ).to.false;
			expect( ship ).to.have.property( 'isCollision' ).to.false;
			expect( ship ).to.have.property( 'position' ).to.have.members( [ null, null ] );
			expect( ship ).to.have.property( 'damages' ).to.have.members( [ false, false, false ] );
		} );

		it( 'should make some `isRotated` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isRotated', spy );

			ship.isRotated = false;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make some `isCollision` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isCollision', spy );

			ship.isCollision = true;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make some `position` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:position', spy );

			ship.position = [ 3, 2 ];

			expect( spy.calledOnce ).to.true;
		} );
	} );

	describe( 'tail', () => {
		it( 'should return position of ship tail #1', () => {
			ship = new Ship( { length: 4 } );

			ship.position = [ 1, 1 ];

			expect( ship.tail ).to.deep.equal( [ 4, 1 ] );
		} );

		it( 'should return position of ship tail #2', () => {
			ship = new Ship( { length: 4 } );

			ship.position = [ 1, 1 ];
			ship.rotate();

			expect( ship.tail ).to.deep.equal( [ 1, 4 ] );
		} );

		it( 'should return position of ship tail #3', () => {
			ship = new Ship( { length: 1 } );

			ship.position = [ 1, 1 ];

			expect( ship.tail ).to.deep.equal( [ 1, 1 ] );
		} );
	} );

	describe( 'coordinates', () => {
		it( 'should return array of coordinates when ship is not rotated', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = true;

			const result = ship.coordinates;

			expect( result ).to.have.length( 3 );
			expect( result[ 0 ] ).to.have.members( [ 1, 1 ] );
			expect( result[ 1 ] ).to.have.members( [ 2, 1 ] );
			expect( result[ 2 ] ).to.have.members( [ 3, 1 ] );
		} );

		it( 'should return array of coordinates on the battlefield when ship is rotated', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = false;

			const result = ship.coordinates;

			expect( result ).to.have.length( 3 );
			expect( result[ 0 ] ).to.have.members( [ 1, 1 ] );
			expect( result[ 1 ] ).to.have.members( [ 1, 2 ] );
			expect( result[ 2 ] ).to.have.members( [ 1, 3 ] );
		} );

		it( 'should return empty array if ship is not placed on the battlefield', () => {
			expect( ship.coordinates ).to.have.length( 0 );
		} );
	} );

	describe( 'isSunk', () => {
		it( 'should return false when there is at least one non hit field', () => {
			ship.damages = [ false, false, false ];

			expect( ship.isSunk ).to.false;

			ship.damages = [ false, true, true ];

			expect( ship.isSunk ).to.false;
		} );

		it( 'should return true when there all fields are hit', () => {
			ship.damages = [ true, true, true ];

			expect( ship.isSunk ).to.true;
		} );
	} );

	describe( 'rotate()', () => {
		it( 'should toggle rotation', () => {
			ship.isRotated = false;

			expect( ship.isRotated ).to.false;

			ship.rotate();

			expect( ship.isRotated ).to.true;

			ship.rotate();

			expect( ship.isRotated ).to.false;
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return ship in JSON format', () => {
			ship = new Ship( {
				id: 1,
				length: 3,
				isRotated: true
			} );

			ship.position = [ 1, 1 ];

			const result = ship.toJSON();

			expect( result ).to.have.property( 'id', 1 );
			expect( result ).to.have.property( 'length', 3 );
			expect( result ).to.have.property( 'isRotated', true );
			expect( result ).to.have.property( 'position' ).to.deep.equal( [ 1, 1 ] );
			expect( result ).to.have.property( 'tail' ).to.deep.equal( [ 1, 3 ] );
		} );
	} );

	describe( 'setDamage()', () => {
		it( 'should set damage to to corresponding index', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = false;

			expect( ship.damages ).to.have.members( [ false, false, false ] );

			ship.setDamage( [ 2, 1 ] );

			expect( ship.damages ).to.have.members( [ false, true, false ] );

			ship.setDamage( [ 3, 1 ] );

			expect( ship.damages ).to.have.members( [ false, true, true ] );

			ship.setDamage( [ 1, 1 ] );

			expect( ship.damages ).to.have.members( [ true, true, true ] );
		} );
	} )
} );
