import sinon from 'sinon';
import { expect } from 'chai';

import Battlefield from '../../src/battlefields/battlefield';
import Ship from '../../src/ship';
import Field from '../../src/field';
import Position from '../../src/position';

describe( 'Battlefield', () => {
	let battlefield: Battlefield, sandbox: sinon.SinonSandbox, initialShips: Ship[];

	beforeEach( () => {
		sandbox = sinon.createSandbox();

		initialShips = Battlefield.createShipsFromJSON( [
			{ id: '1', length: 2 },
			{ id: '2', length: 2 },
			{ id: '3', length: 3 }
		] );

		battlefield = new Battlefield( 5, { 2: 2, 3: 1 }, initialShips );
	} );

	afterEach( () => {
		sandbox.restore();
		battlefield.destroy();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield', () => {
			expect( battlefield ).to.have.property( 'size', 5 );
			expect( battlefield ).to.have.property( 'isLocked', false );
			expect( battlefield ).to.have.property( 'shipsSchema' ).to.deep.equal( { 2: 2, 3: 1 } );

			expect( battlefield.getShips().map( ship => ship.length ) ).to.have.members( [ 2, 2, 3 ] );
			expect( battlefield.getShips().map( ship => ship.id ) ).to.have.members( [ '1', '2', '3' ] );
		} );

		it( 'should create an instance of Battlefield with default ships based on schema', () => {
			const battlefield = new Battlefield( 5, { 1: 2, 2: 2 } );

			expect( battlefield.getShips() ).to.length( 4 );
			expect( battlefield.getShips().map( ship => ship.length ) ).to.have.members( [ 1, 1, 2, 2 ] );

			battlefield.destroy();
		} );

		it( 'should throw when given ships are duplicated', () => {
			const [ ship ] = initialShips;
			const ships = [ ship, ship ];

			expect( () => {
				// eslint-disable-next-line no-new
				new Battlefield( 5, { 2: 2 }, ships );
			} ).to.throw( Error, 'Ship already added to the battlefield.' );
		} );

		it( 'should move ship to the correct field when ship position is defined', () => {
			class TestBattlefield extends Battlefield {
				getField( position: Position ): Field {
					return this._fields.get( position.toString() );
				}
			}

			const [ ship1, ship2 ] = initialShips;
			const position = new Position( 1, 1 );

			ship1.position = position;

			const battlefield = new TestBattlefield( 5, { 2: 1 }, [ ship1, ship2 ] );

			expect( battlefield.getField( position ).getShips() ).to.have.members( [ ship1 ] );

			return battlefield.destroy();
		} );
	} );

	describe( 'settings', () => {
		it( 'should return object with a game settings', () => {
			expect( battlefield.settings ).to.deep.equal( {
				size: 5,
				shipsSchema: { 2: 2, 3: 1 }
			} );
		} );
	} );

	describe( 'markedAsMissed()', () => {
		it( 'should add field and mark as missed', () => {
			expect( battlefield.getFields() ).to.length( 0 );

			battlefield.markAsMissed( new Position( 2, 2 ) );

			expect( battlefield.getFields().map( field => field.position.toJSON() ) ).to.deep.equal( [ [ 2, 2 ] ] );
		} );

		it( 'should mark already added field as missed', () => {
			battlefield.moveShip( '1', new Position( 2, 2 ) );

			expect( battlefield.getFields() ).to.length( 0 );

			battlefield.markAsMissed( new Position( 2, 2 ) );

			expect( battlefield.getFields().map( field => field.position.toJSON() ) ).to.deep.equal( [ [ 2, 2 ] ] );
		} );
	} );

	describe( 'markedAsHit()', () => {
		it( 'should add field and mark as hit', () => {
			expect( battlefield.getFields() ).to.length( 0 );

			battlefield.markAsHit( new Position( 2, 2 ) );

			expect( battlefield.getFields().map( field => field.position.toJSON() ) ).to.deep.equal( [ [ 2, 2 ] ] );
		} );

		it( 'should mark already added field as hit', () => {
			battlefield.moveShip( '1', new Position( 2, 2 ) );

			expect( battlefield.getFields() ).to.length( 0 );

			battlefield.markAsHit( new Position( 2, 2 ) );

			expect( battlefield.getFields().map( field => field.position.toJSON() ) ).to.deep.equal( [ [ 2, 2 ] ] );
		} );
	} );

	describe( 'getFields()', () => {
		it( 'should return data of all marked fields', () => {
			battlefield.moveShip( '1', new Position( 1, 1 ) );
			battlefield.markAsHit( new Position( 1, 1 ) );
			battlefield.markAsHit( new Position( 2, 2 ) );
			battlefield.markAsMissed( new Position( 3, 3 ) );

			const fields = battlefield.getFields();

			expect( fields ).to.length( 3 );

			expect( fields[ 0 ] ).to.instanceof( Field );
			expect( fields[ 0 ].status ).to.equal( 'hit' );
			expect( fields[ 0 ].position.toJSON() ).to.deep.equal( [ 1, 1 ] );

			expect( fields[ 1 ] ).to.instanceof( Field );
			expect( fields[ 1 ].status ).to.equal( 'hit' );
			expect( fields[ 1 ].position.toJSON() ).to.deep.equal( [ 2, 2 ] );

			expect( fields[ 2 ] ).to.instanceof( Field );
			expect( fields[ 2 ].status ).to.equal( 'missed' );
			expect( fields[ 2 ].position.toJSON() ).to.deep.equal( [ 3, 3 ] );
		} );
	} );

	describe( 'getShips()', () => {
		it( 'should return all ships added to the battlefield', () => {
			expect( battlefield.getShips() ).to.deep.equal( initialShips );
		} );
	} );

	describe( 'getShip()', () => {
		it( 'should return ship of given id', () => {
			const [ ship1, ship2 ] = initialShips;

			expect( battlefield.getShip( '1' ) ).to.equal( ship1 );
			expect( battlefield.getShip( '2' ) ).to.equal( ship2 );
		} );

		it( 'should throw when there is no ship of given id', () => {
			expect( () => {
				battlefield.getShip( 'unknown' );
			} ).to.throw( Error, 'There is no ship of given id.' );
		} );
	} );

	describe( 'moveShip()', () => {
		it( 'should put ship on the correct fields', () => {
			const [ ship ] = initialShips;

			expect( ship.coordinates ).to.deep.equal( [] );

			const posA = new Position( 1, 1 );
			const posB = new Position( 2, 1 );

			battlefield.moveShip( '1', posA );

			expect( ship.coordinates ).to.deep.equal( [ posA, posB ] );
		} );

		it( 'should put rotated ship on the correct fields', () => {
			const [ ship ] = initialShips;

			expect( ship.coordinates ).to.deep.equal( [] );

			const posA = new Position( 1, 1 );
			const posB = new Position( 1, 2 );

			battlefield.moveShip( '1', posA, true );

			expect( ship.coordinates ).to.deep.equal( [ posA, posB ] );
		} );

		it( 'should move ship from one fields to the others', () => {
			const [ ship ] = initialShips;

			const oldPosHead = Position.fromJSON( [ 1, 1 ] );
			const oldPosTail = Position.fromJSON( [ 2, 1 ] );

			const newPosHead = Position.fromJSON( [ 3, 3 ] );
			const newPosTail = Position.fromJSON( [ 4, 3 ] );

			// Put ship.
			battlefield.moveShip( '1', oldPosHead );
			expect( ship.coordinates ).to.deep.equal( [ oldPosHead, oldPosTail ] );

			// Then move it.
			battlefield.moveShip( '1', newPosHead );
			expect( ship.coordinates ).to.deep.equal( [ newPosHead, newPosTail ] );
		} );

		it( 'should move ship when there is more than one ship on the same field', () => {
			const [ ship1 ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 1 ) );
			battlefield.moveShip( '2', new Position( 2, 1 ) );
			battlefield.moveShip( '1', new Position( 2, 4 ) );

			expect( ship1.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 2, 4 ], [ 3, 4 ] ] );
		} );

		it( 'should rotated ship with no move', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.moveShip( '1', new Position( 1, 1 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated ship while moving', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.moveShip( '1', new Position( 2, 2 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 2, 2 ], [ 2, 3 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 4, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 3, 1 ], [ 4, 1 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds on ship rotate', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 4 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 3 ], [ 1, 4 ] ] );
		} );

		it( 'should not move ship when battlefield is locked', () => {
			battlefield.isLocked = true;

			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 4 ), true );

			expect( ship.coordinates ).to.deep.equal( [] );
		} );

		it( 'should throw when there is no ship of given id', () => {
			expect( () => {
				battlefield.moveShip( 'unknown', new Position( 1, 1 ) );
			} ).to.throw( Error, 'There is no ship of given id.' );
		} );
	} );

	describe( 'rotateShip()', () => {
		it( 'should rotate ship', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( '1', new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.rotateShip( '1' );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should throw when there is no ship of given id', () => {
			expect( () => {
				battlefield.rotateShip( 'unknown' );
			} ).to.throw( Error, 'There is no ship of given id.' );
		} );
	} );

	describe( 'destroy()', () => {
		it( 'should clear event emitters', () => {
			const spy = sandbox.spy( battlefield, 'stopListening' );

			battlefield.destroy();

			sinon.assert.called( spy );
		} );
	} );

	describe( 'static createShipsFromSchema()', () => {
		it( 'should create ships based on provided schema', () => {
			const ships = Battlefield.createShipsFromSchema( { 2: 2, 3: 2 } );

			expect( ships ).to.have.length( 4 );
			expect( ships[ 0 ] ).to.have.property( 'length', 2 );
			expect( ships[ 1 ] ).to.have.property( 'length', 2 );
			expect( ships[ 2 ] ).to.have.property( 'length', 3 );
			expect( ships[ 3 ] ).to.have.property( 'length', 3 );
		} );
	} );

	describe( 'static createShipsFromJSON()', () => {
		it( 'should create ships based on provided JSON', () => {
			const result = Battlefield.createShipsFromJSON( [
				{ id: '1', length: 2, isRotated: false },
				{ id: '2', length: 3, isRotated: true }
			] );

			expect( result ).to.have.length( 2 );
			expect( result[ 0 ] ).to.instanceof( Ship );
			expect( result[ 0 ] ).to.have.property( 'id', '1' );
			expect( result[ 1 ] ).to.instanceof( Ship );
			expect( result[ 1 ] ).to.have.property( 'id', '2' );
		} );
	} );
} );
