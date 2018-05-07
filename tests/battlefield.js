import Battlefield from '../src/battlefield';
import ShipsCollection from '../src/shipscollection';
import Ship from '../src/ship';
import Field from '../src/field';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

describe( 'Battlefield', () => {
	let battlefield, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		battlefield = new Battlefield( 5, { 2: 2, 3: 2 } );
	} );

	afterEach( () => {
		sandbox.restore();
		battlefield.destroy();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield', () => {
			expect( battlefield ).to.have.property( 'size', 5 );
			expect( battlefield ).to.have.property( 'isLocked', false );
			expect( battlefield ).to.have.property( 'shipsSchema' ).to.deep.equal( { 2: 2, 3: 2 } );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.instanceof( ShipsCollection );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.length( 0 );
			expect( battlefield ).to.have.property( '_fields' ).to.instanceof( Collection );
			expect( battlefield ).to.have.property( '_fields' ).to.length( 0 );
		} );

		it( 'should put ship added to the shipsCollection on the battlefield when ship has a position', () => {
			const ship = new Ship( {
				length: 2,
				position: [ 1, 1 ]
			} );

			battlefield.shipsCollection.add( ship );

			expect( battlefield.getField( [ 1, 1 ] ).getFirstShip() ).to.equal( ship );
			expect( battlefield.getField( [ 2, 1 ] ).getFirstShip() ).to.equal( ship );
		} );

		it( 'should delegate add and remove events from #_fields collection', () => {
			const addSpy = sandbox.spy();
			const removeSpy = sandbox.spy();

			battlefield.on( 'add', addSpy );
			battlefield.on( 'remove', removeSpy );

			battlefield._fields.fire( 'add' );

			sinon.assert.calledOnce( addSpy );

			battlefield._fields.fire( 'remove' );

			sinon.assert.calledOnce( removeSpy );
		} );
	} );

	describe( 'settings', () => {
		it( 'should return object with a game settings', () => {
			expect( battlefield.settings ).to.deep.equal( {
				size: 5,
				shipsSchema: { 2: 2, 3: 2 }
			} );
		} );
	} );

	describe( 'markAsHit() / getField()', () => {
		it( 'should create field marked as hit', () => {
			battlefield.markAsHit( [ 1, 1 ] );

			const result = battlefield.getField( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isHit ).to.true;
		} );
	} );

	describe( 'markAsMissed() / getField()', () => {
		it( 'should create field marked as missed', () => {
			battlefield.markAsMissed( [ 1, 1 ] );

			const result = battlefield.getField( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isMissed ).to.true;
		} );
	} );

	describe( 'markAs() / getField()', () => {
		it( 'should call `markAsMissed` when given type is `missed`', () => {
			const spy = sandbox.spy( battlefield, 'markAsMissed' );

			battlefield.markAs( [ 1, 1 ], 'missed' );

			expect( spy.calledOnce ).to.true;
			expect( spy.calledWithExactly( [ 1, 1 ] ) );
		} );

		it( 'should call `setHit` when given type is `hit`', () => {
			const spy = sandbox.spy( battlefield, 'markAsHit' );

			battlefield.markAs( [ 1, 1 ], 'hit' );

			expect( spy.calledOnce ).to.true;
			expect( spy.calledWithExactly( [ 1, 1 ] ) );
		} );
	} );

	describe( 'getField()', () => {
		it( 'should return `null` when field is empty', () => {
			expect( battlefield.getField( [ 1, 1 ] ) ).to.null;
		} );
	} );

	describe( 'moveShip()', () => {
		it( 'should put ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			const field1 = battlefield.getField( [ 1, 1 ] );
			const field2 = battlefield.getField( [ 2, 1 ] );

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
			expect( battlefield.getField( [ 1, 1 ] ) ).to.null;
			expect( battlefield.getField( [ 2, 1 ] ) ).to.null;

			// Ship should be on the next position.
			expect( battlefield.getField( [ 3, 3 ] ) ).to.have.length( 1 );
			expect( battlefield.getField( [ 3, 3 ] ).getFirstShip() ).to.equal( ship );

			expect( battlefield.getField( [ 4, 3 ] ) ).to.have.length( 1 );
			expect( battlefield.getField( [ 4, 3 ] ).getFirstShip() ).to.equal( ship );

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

		it( 'should not move ship when battlefield is locked', () => {
			battlefield.isLocked = true;

			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( ship.position ).to.deep.equal( [ null, null ] );
		} );
	} );

	describe( 'rotateShip()', () => {
		it( 'should rotate ship on the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.rotateShip( ship );

			const field1 = battlefield.getField( [ 1, 1 ] );
			const field2 = battlefield.getField( [ 1, 2 ] );

			expect( ship.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );

			expect( field1 ).to.have.length( 1 );
			expect( field1.getFirstShip() ).to.equal( ship );

			expect( field2 ).to.have.length( 1 );
			expect( field2.getFirstShip() ).to.equal( ship );
		} );
	} );

	describe( 'checkShipCollision()', () => {
		it( 'should be as class interface', () => {
			expect( battlefield.checkShipCollision ).to.be.a( 'function' );
		} );

		it( 'should return `false` and mark ship as no collision when ship has no contact with other ships #1', () => {
			const ship = new Ship( { length: 1 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( battlefield.checkShipCollision( ship ) ).to.false;
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

			expect( battlefield.checkShipCollision( ship1 ) ).to.false;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #1', () => {
			// [1,2]
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			battlefield.moveShip( ship1, [ 3, 3 ] );
			battlefield.moveShip( ship2, [ 3, 3 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #2', () => {
			// [ 1 ][1,2][ 2 ]
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, [ 0, 0 ] );
			battlefield.moveShip( ship2, [ 1, 0 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
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

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
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

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
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

	describe( 'verifyExistingCollisions()', () => {
		it( 'should verify if ships on the battlefield still have a collision', () => {
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );
			const ship3 = new Ship( { length: 2 } );

			// [1][1]
			// [2][2]
			// [3][3]
			battlefield.moveShip( ship1, [ 0, 0 ] );
			battlefield.moveShip( ship2, [ 0, 1 ] );
			battlefield.moveShip( ship3, [ 0, 2 ] );

			battlefield.checkShipCollision( ship2 );

			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
			expect( ship3.isCollision ).to.true;

			// [1][1]
			//          [2][2]
			// [3][3]
			battlefield.moveShip( ship2, [ 3, 1 ] );

			battlefield.verifyExistingCollisions();

			expect( ship1.isCollision ).to.false;
			expect( ship2.isCollision ).to.false;
			expect( ship3.isCollision ).to.false;
		} );
	} );

	describe( 'validateShips()', () => {
		it( 'should return true when ships are inside battlefield bounds and do not have a collision', () => {
			const ship1 = new Ship( { length: 4 } );
			const ship2 = new Ship( { length: 4 } );

			ship1.position = [ 1, 1 ];
			ship2.position = [ 1, 3 ];

			expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.true;
		} );

		it( 'should return false when ships are not inside battlefield bounds and do not have a collision', () => {
			const ship1 = new Ship( { length: 4 } );
			const ship2 = new Ship( { length: 4 } );

			ship1.position = [ 1, 1 ];
			ship2.position = [ 2, 3 ];

			expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.false;
		} );

		it( 'should return false when ships are not inside battlefield bounds and do have a collision', () => {
			const ship1 = new Ship( { length: 4 } );
			const ship2 = new Ship( { length: 4 } );

			ship1.position = [ 1, 1 ];
			ship2.position = [ 2, 1 ];

			expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.false;
		} );
	} );

	describe( 'reset()', () => {
		it( 'should reset battlefield and ship collection to the default values', () => {
			battlefield.shipsCollection.add( new Ship( { id: '1', length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: '2', length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: '3', length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: '4', length: 2 } ) );

			battlefield.moveShip( battlefield.shipsCollection.get( '1' ), [ 1, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( '2' ), [ 2, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( '3' ), [ 3, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( '4' ), [ 4, 1 ] );

			battlefield.reset();

			expect( Array.from( battlefield ) ).to.deep.equal( [] );

			for ( const ship of battlefield.shipsCollection ) {
				expect( ship.position ).to.deep.equal( [ null, null ] );
				expect( ship.isCollision ).to.false;
			}
		} );
	} );

	describe( 'destroy()', () => {
		it( 'should clear event emitters', () => {
			const spy1 = sandbox.spy( battlefield, 'stopListening' );
			const spy2 = sandbox.spy( battlefield.shipsCollection, 'stopListening' );

			battlefield.destroy();

			sinon.assert.called( spy1 );
			sinon.assert.called( spy2 );
		} );
	} );

	describe( 'iterator', () => {
		it( 'should provide interface to iterate over fields', () => {
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );
			const ship3 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, [ 1, 1 ] );
			battlefield.moveShip( ship2, [ 1, 1 ] ); // The same field!
			battlefield.moveShip( ship3, [ 2, 2 ] );

			let index = 0;

			for ( const field of battlefield ) {
				expect( field ).instanceof( Field );
				index++;
			}

			expect( index ).to.equal( 4 );
		} );
	} );
} );
