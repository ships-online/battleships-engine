import Battlefield from 'src/battlefield.js';
import ShipsCollection from 'src/shipscollection.js';
import Ship from 'src/ship.js';
import Field from 'src/field.js';

describe( 'Battlefield:', () => {
	let battlefield, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		battlefield = new Battlefield( 5 );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield with some properties', () => {
			expect( battlefield ).to.have.property( 'size', 5 );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.instanceof( ShipsCollection );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.have.property( 'length', 0 );
		} );

		it( 'should create an instance of Battlefield initial ships configuration', () => {
			battlefield = new Battlefield( 5, { 2: 2 } );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.have.property( 'length', 2 );
		} );
	} );

	describe( 'setShip() / get()', () => {
		it( 'should create field with ship', () => {
			const ship = new Ship( { length: 1 } );

			battlefield.setShip( [ 1, 1 ], ship );

			const result = battlefield.get( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 1 );
			expect( result.getFirstShip() ).to.equal( ship );
		} );

		it( 'should add ship to existing field', () => {
			const ship1 = new Ship( { length: 1, id: 's1' } );
			const ship2 = new Ship( { length: 1, id: 's2' } );

			battlefield.setShip( [ 1, 1 ], ship1 );
			battlefield.setShip( [ 1, 1 ], ship2 );

			const result = battlefield.get( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 2 );
			expect( result.getShip( 's1' ) ).to.equal( ship1 );
			expect( result.getShip( 's2' ) ).to.equal( ship2 );
		} );
	} );

	describe( 'setHit() / get()', () => {
		it( 'should create field marked as hit', () => {
			battlefield.setHit( [ 1, 1 ] );

			const result = battlefield.get( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isHit ).to.true;
		} );

		it( 'should fire `hit` event', () => {
			const spy = sinon.spy();

			battlefield.on( 'hit', spy );
			battlefield.setHit( [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.have.members( [ 1, 1 ] );
		} );
	} );

	describe( 'setMissed() / get()', () => {
		it( 'should create field marked as missed', () => {
			battlefield.setMissed( [ 1, 1 ] );

			const result = battlefield.get( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isMissed ).to.true;
		} );

		it( 'should fire `missed` event', () => {
			const spy = sinon.spy();

			battlefield.on( 'missed', spy );
			battlefield.setMissed( [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.have.members( [ 1, 1 ] );
		} );
	} );

	describe( 'get()', () => {
		it( 'should return `undefined` when field is empty', () => {
			expect( battlefield.get( [ 1, 1 ] ) ).to.undefined;
		} );
	} );

	describe( 'moveShip()', () => {
		it( 'should put ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			const field1 = battlefield.get( [ 1, 1 ] );
			const field2 = battlefield.get( [ 2, 1 ] );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			expect( field1 ).to.have.length( 1 );
			expect( field1.getFirstShip() ).to.equal( ship );

			expect( field2 ).to.have.length( 1 );
			expect( field2.getFirstShip() ).to.equal( ship );
		} );

		it( 'should move ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			// Put ship first.
			battlefield.moveShip( ship, [ 1, 1 ] );

			// Then move this ship.
			battlefield.moveShip( ship, [ 3, 3 ] );

			expect( ship.coordinates ).to.deep.equal( [ [ 3, 3 ], [ 4, 3 ] ] );

			// Previous position should be empty.
			expect( battlefield.get( [ 1, 1 ] ) ).to.undefined;
			expect( battlefield.get( [ 2, 1 ] ) ).to.undefined;

			// Ship should be on the next position.
			expect( battlefield.get( [ 3, 3 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 3, 3 ] ).getFirstShip() ).to.equal( ship );

			expect( battlefield.get( [ 4, 3 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 4, 3 ] ).getFirstShip() ).to.equal( ship );

			expect( ship.coordinates ).to.deep.equal( [ [ 3, 3 ], [ 4, 3 ] ] );
		} );

		it( 'should move ship when there is more than one ship on the same field', () => {
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, [ 1, 1 ] );
			battlefield.moveShip( ship2, [ 2, 1 ] );
			battlefield.moveShip( ship1, [ 2, 4 ] );

			expect( ship1.coordinates ).to.deep.equal( [ [ 2, 4 ], [ 3, 4 ] ] );
		} );

		it( 'should put rotated ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ], true );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated ship without moving', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.moveShip( ship, [ 1, 1 ], true );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated ship while moving', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.moveShip( ship, [ 2, 2 ], true );

			expect( ship.coordinates ).to.deep.equal( [ [ 2, 2 ], [ 2, 3 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 4, 1 ] );

			expect( ship.coordinates ).to.deep.equal( [ [ 3, 1 ], [ 4, 1 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds when ship is rotated', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 4 ], true );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 3 ], [ 1, 4 ] ] );
		} );

		it( 'should check if ship has a collision after move', () => {
			const spy = sinon.spy( battlefield, '_checkShipCollision' );
			const ship = new Ship( { length: 1 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.calledWithExactly( ship ) ).to.true;
		} );

		it( 'should check if ship with collision still have a collision after move', () => {
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			battlefield.shipsCollection.add( ship1 );
			battlefield.shipsCollection.add( ship2 );

			battlefield.moveShip( ship1, [ 1, 1 ] );
			battlefield.moveShip( ship2, [ 1, 1 ] );

			const spy = sinon.spy( battlefield, '_checkShipCollision' );

			battlefield.moveShip( ship1, [ 3, 3 ] );

			expect( spy.calledTwice ).to.true;
			expect( spy.firstCall.calledWithExactly( ship1 ) ).to.true;
			expect( spy.secondCall.calledWithExactly( ship2 ) ).to.true;
		} );
	} );

	describe( 'rotateShip()', () => {
		it( 'should rotate ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.rotateShip( ship );

			const field1 = battlefield.get( [ 1, 1 ] );
			const field2 = battlefield.get( [ 1, 2 ] );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );

			expect( field1 ).to.have.length( 1 );
			expect( field1.getFirstShip() ).to.equal( ship );

			expect( field2 ).to.have.length( 1 );
			expect( field2.getFirstShip() ).to.equal( ship );
		} );
	} );

	describe( '_checkShipCollision()', () => {
		it( 'should return `false` and mark ship as no collision when ship has no contact with other ships #1', () => {
			const ship = new Ship( { length: 1 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( battlefield._checkShipCollision( ship ) ).to.false;
			expect( ship.isCollision ).to.false;
		} );

		it( 'should return `false` and mark ship as no collision when ship has no contact with other ships #2', () => {
			// Ship is surrounded by other ships, but there is one field position of space between them.
			//
			// [2][2][2][2][3]
			// [5]         [3]
			// [5]   [1]   [3]
			// [5]         [3]
			// [5][4][4][4][4]

			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 4 } );
			const ship3 = new Ship( { length: 4 } );
			const ship4 = new Ship( { length: 4 } );
			const ship5 = new Ship( { length: 4 } );

			battlefield.moveShip( ship1, [ 2, 2 ] );
			battlefield.moveShip( ship2, [ 0, 0 ] );
			battlefield.moveShip( ship3, [ 4, 0 ], true );
			battlefield.moveShip( ship4, [ 1, 4 ] );
			battlefield.moveShip( ship5, [ 0, 1 ], true );

			expect( battlefield._checkShipCollision( ship1 ) ).to.false;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #1', () => {
			// [1,2]
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			battlefield.moveShip( ship1, [ 3, 3 ] );
			battlefield.moveShip( ship2, [ 3, 3 ] );

			expect( battlefield._checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #2', () => {
			// [ 1 ][1,2][ 2 ]
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, [ 0, 0 ] );
			battlefield.moveShip( ship2, [ 1, 0 ] );

			expect( battlefield._checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #3', () => {
			//      [ 1 ]
			// [ 2 ][1,2]
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, [ 1, 0 ], true );
			battlefield.moveShip( ship2, [ 0, 1 ] );

			expect( battlefield._checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when ship stick to other ships', () => {
			// [2][3][4]
			// [5][1][6]
			// [7][8][9]
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );
			const ship3 = new Ship( { length: 1 } );
			const ship4 = new Ship( { length: 1 } );
			const ship5 = new Ship( { length: 1 } );
			const ship6 = new Ship( { length: 1 } );
			const ship7 = new Ship( { length: 1 } );
			const ship8 = new Ship( { length: 1 } );
			const ship9 = new Ship( { length: 1 } );

			battlefield.moveShip( ship1, [ 2, 2 ] );
			battlefield.moveShip( ship2, [ 1, 1 ] );
			battlefield.moveShip( ship3, [ 2, 1 ] );
			battlefield.moveShip( ship4, [ 3, 1 ] );
			battlefield.moveShip( ship5, [ 3, 2 ] );
			battlefield.moveShip( ship6, [ 3, 3 ] );
			battlefield.moveShip( ship7, [ 2, 3 ] );
			battlefield.moveShip( ship8, [ 1, 3 ] );
			battlefield.moveShip( ship9, [ 1, 2 ] );

			expect( battlefield._checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
			expect( ship3.isCollision ).to.true;
			expect( ship4.isCollision ).to.true;
			expect( ship5.isCollision ).to.true;
			expect( ship6.isCollision ).to.true;
			expect( ship7.isCollision ).to.true;
			expect( ship8.isCollision ).to.true;
			expect( ship9.isCollision ).to.true;
		} );
	} );
} );
