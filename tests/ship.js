import Ship from '../src/ship';

describe( 'Ship', () => {
	let ship, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		ship = new Ship( {
			length: 3,
			id: 1,
			isRotated: true,
			position: [ 1, 1 ]
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
			expect( ship ).to.have.property( 'position' ).to.deep.equal( [ 1, 1 ] );
			expect( ship ).to.have.property( 'damages' ).to.deep.equal( [ false, false, false ] );
		} );

		it( 'should create an instance of Ship with default values', () => {
			ship = new Ship( {
				length: 3
			} );

			expect( ship ).to.have.property( 'id' ).to.ok;
			expect( ship ).to.have.property( 'length' ).to.equal( 3 );
			expect( ship ).to.have.property( 'isRotated' ).to.false;
			expect( ship ).to.have.property( 'isCollision' ).to.false;
			expect( ship ).to.have.property( 'position' ).to.deep.equal( [ null, null ] );
			expect( ship ).to.have.property( 'damages' ).to.deep.equal( [ false, false, false ] );
		} );

		it( 'should make `isRotated` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isRotated', spy );

			ship.isRotated = false;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make `isCollision` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:isCollision', spy );

			ship.isCollision = true;

			expect( spy.calledOnce ).to.true;
		} );

		it( 'should make `position` observable', () => {
			const spy = sinon.spy();

			ship.on( 'change:position', spy );

			ship.position = [ 3, 2 ];

			expect( spy.calledOnce ).to.true;
		} );
	} );

	describe( 'coordinates', () => {
		it( 'should return array of coordinates on the battlefield when ship is not rotated', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = false;

			expect( ship.coordinates ).to.have.length( 3 );
			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ], [ 3, 1 ] ] );
		} );

		it( 'should return coordinates iterator when ship is rotated', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = true;

			expect( ship.coordinates ).to.have.length( 3 );
			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ], [ 1, 3 ] ] );
		} );

		it( 'should return empty array if ship is not placed on the battlefield', () => {
			ship.position = [ null, null ];

			expect( ship.coordinates ).to.have.length( 0 );
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

	describe( 'hasPosition()', () => {
		it( 'should return `true` when ship position is set', () => {
			ship.position = [ 1, 1 ];

			expect( ship.hasPosition() ).to.true;
		} );

		it( 'should return `false` when ship position is not ste', () => {
			ship.position = [ null, null ];

			expect( ship.hasPosition() ).to.false;
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
		} );
	} );

	describe( 'setDamage()', () => {
		it( 'should set damage to to corresponding index', () => {
			ship.position = [ 1, 1 ];
			ship.isRotated = false;

			expect( ship.damages ).to.deep.equal( [ false, false, false ] );

			ship.setDamage( [ 2, 1 ] );

			expect( ship.damages ).to.deep.equal( [ false, true, false ] );

			ship.setDamage( [ 3, 1 ] );

			expect( ship.damages ).to.deep.equal( [ false, true, true ] );

			ship.setDamage( [ 1, 1 ] );

			expect( ship.damages ).to.deep.equal( [ true, true, true ] );
		} );
	} );

	describe( 'reset()', () => {
		it( 'should reset ship to the default values', () => {
			const ship = new Ship( { length: 2 } );

			ship.position = [ 1, 1 ];
			ship.rotated = true;
			ship.setDamage( [ 1, 1 ] );
			ship.isCollision = true;

			ship.reset();

			expect( ship.position ).to.deep.equal( [ null, null ] );
			expect( ship.damages ).to.deep.equal( [ false, false ] );
			expect( ship.isRotated ).to.false;
			expect( ship.isCollision ).to.false;
		} );
	} );
} );
