import Battlefield from '../src/battlefield';
import ShipsCollection from '../src/shipscollection';
import Ship from '../src/ship';
import Field from '../src/field';

describe( 'Battlefield', () => {
	let battlefield, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		battlefield = new Battlefield( 5, { 2: 2, 3: 2 } );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield', () => {
			expect( battlefield ).to.have.property( 'size', 5 );
			expect( battlefield ).to.have.property( 'isLocked', false );
			expect( battlefield ).to.have.property( 'shipsSchema' ).to.deep.equal( { 2: 2, 3: 2 } );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.instanceof( ShipsCollection );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.have.property( 'length', 0 );
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
	} );

	describe( 'settings', () => {
		it( 'should return object with a game settings', () => {
			expect( battlefield.settings ).to.deep.equal( {
				size: 5,
				shipsSchema: { 2: 2, 3: 2 }
			} );
		} );
	} );

	describe( 'markAsHit() / get()', () => {
		it( 'should create field marked as hit', () => {
			battlefield.markAsHit( [ 1, 1 ] );

			const result = battlefield.getField( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isHit ).to.true;
		} );

		it( 'should fire `hit` event', () => {
			const spy = sinon.spy();

			battlefield.on( 'hit', spy );
			battlefield.markAsHit( [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.have.members( [ 1, 1 ] );
		} );
	} );

	describe( 'markAsMissed() / get()', () => {
		it( 'should create field marked as missed', () => {
			battlefield.markAsMissed( [ 1, 1 ] );

			const result = battlefield.getField( [ 1, 1 ] );

			expect( result ).to.instanceof( Field );
			expect( result.length ).to.equal( 0 );
			expect( result.isMissed ).to.true;
		} );

		it( 'should fire `missed` event', () => {
			const spy = sinon.spy();

			battlefield.on( 'missed', spy );
			battlefield.markAsMissed( [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.have.members( [ 1, 1 ] );
		} );
	} );

	describe( 'markAs() / get()', () => {
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

	describe( 'get()', () => {
		it( 'should return `undefined` when field is empty', () => {
			expect( battlefield.getField( [ 1, 1 ] ) ).to.undefined;
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
			expect( battlefield.getField( [ 1, 1 ] ) ).to.undefined;
			expect( battlefield.getField( [ 2, 1 ] ) ).to.undefined;

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

		it( 'should fire `shipMoved` event', () => {
			const ship = new Ship( { length: 2 } );
			const spy = sinon.spy();

			battlefield.on( 'shipMoved', spy );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.equal( ship );
		} );

		it( 'should not move ship when battlefield is locked', () => {
			battlefield.isLocked = true;

			const ship = new Ship( { length: 2 } );
			const spy = sinon.spy();

			battlefield.on( 'shipMoved', spy );

			battlefield.moveShip( ship, [ 1, 1 ] );

			expect( spy.notCalled ).to.true;
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

		it( 'should fire `shipMoved` event', () => {
			const ship = new Ship( { length: 2 } );
			const spy = sinon.spy();

			battlefield.moveShip( ship, [ 1, 1 ] );

			battlefield.on( 'shipMoved', spy );

			battlefield.rotateShip( ship );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.equal( ship );
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
			battlefield.shipsCollection.add( new Ship( { id: 1, length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: 2, length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: 3, length: 2 } ) );
			battlefield.shipsCollection.add( new Ship( { id: 4, length: 2 } ) );

			battlefield.moveShip( battlefield.shipsCollection.get( 1 ), [ 1, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( 2 ), [ 2, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( 3 ), [ 3, 1 ] );
			battlefield.moveShip( battlefield.shipsCollection.get( 4 ), [ 4, 1 ] );

			battlefield.reset();

			expect( Array.from( battlefield ) ).to.deep.equal( [] );

			for ( const ship of battlefield.shipsCollection ) {
				expect( ship.position ).to.deep.equal( [ null, null ] );
				expect( ship.isCollision ).to.false;
			}
		} );

		it( 'should fire reset event', () => {
			const spy = sinon.spy();

			battlefield.on( 'reset', spy );

			battlefield.reset();

			sinon.assert.calledOnce( spy );
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
