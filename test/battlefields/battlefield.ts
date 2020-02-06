import sinon from 'sinon';
import { expect } from 'chai';

import Battlefield from '../../src/battlefields/battlefield';
import Ship from '../../src/ship';
import Field from '../../src/field';
import Position from '../../src/position';

describe( 'Battlefield', () => {
	let battlefield: Battlefield, sandbox: sinon.SinonSandbox;

	beforeEach( () => {
		sandbox = sinon.createSandbox();
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

	describe( 'createField()', () => {
		it( 'should create a field instance using position instance', () => {
			const position = new Position( 1, 1 );
			const field = battlefield.createField( position );

			expect( field ).to.instanceof( Field );
			expect( field.position ).to.equal( position );
		} );

		it( 'should throw when add more than one field at the same position', () => {
			const position = new Position( 1, 1 );

			battlefield.createField( position );

			expect( () => {
				battlefield.createField( position );
			} ).to.throw( Error, 'Field already exists.' );
		} );
	} );

	describe( 'hasField()', () => {
		it( 'should check if battlefield has a field of a given position', () => {
			const position = new Position( 1, 1 );

			expect( battlefield.hasField( position ) ).to.false;

			battlefield.createField( position );

			expect( battlefield.hasField( position ) ).to.true;
		} );
	} );

	describe( 'getField()', () => {
		it( 'should return field from the given position', () => {
			const position = new Position( 1, 1 );
			const field = battlefield.createField( position );

			expect( battlefield.getField( position ) ).to.equal( field );
			expect( battlefield.getField( new Position( 4, 4 ) ) ).to.undefined;
		} );
	} );

	describe( 'removeField()', () => {
		it( 'should remove field from battlefield', () => {
			const position = new Position( 1, 1 );

			battlefield.createField( position );

			expect( battlefield.hasField( position ) ).to.true;

			battlefield.removeField( position );

			expect( battlefield.hasField( position ) ).to.false;
		} );

		it( 'should throw when remove non-existing field', () => {
			const position = new Position( 1, 1 );

			expect( () => {
				battlefield.removeField( position );
			} ).to.throw( Error, 'Cannot remove not existing field.' );
		} );
	} );

	describe( 'addShip()', () => {
		it( 'should add ship to the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.addShip( ship );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship ] );
		} );

		it( 'should add ship to the battlefield and place on correct field when ship position has been defined', () => {
			const position = new Position( 1, 1 );
			const ship = new Ship( { length: 2, position } );

			battlefield.addShip( ship );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship ] );
			expect( Array.from( battlefield.getField( position ).getShips() ) ).to.have.members( [ ship ] );
		} );

		it( 'should throw when remove non-added ship', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.addShip( ship );

			expect( () => {
				battlefield.addShip( ship );
			} ).to.throw( Error, 'Ship already added to the battlefield.' );
		} );
	} );

	describe( 'removeShip()', () => {
		it( 'should remove ship from the battlefield', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.addShip( ship );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship ] );

			battlefield.removeShip( ship );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [] );
		} );

		it( 'should throw when remove non-added ship', () => {
			const ship = new Ship( { length: 2 } );

			expect( () => {
				battlefield.removeShip( ship );
			} ).to.throw( Error, 'Cannot remove not existing ship.' );
		} );
	} );

	describe( 'getShips()', () => {
		it( 'should return all ships added to the battlefield', () => {
			const ship1 = new Ship( { length: 2, position: [ 1, 1 ] } );
			const ship2 = new Ship( { length: 1 } );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [] );

			battlefield.addShip( ship1 );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship1 ] );

			battlefield.addShip( ship2 );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship1, ship2 ] );

			battlefield.removeShip( ship1 );

			expect( Array.from( battlefield.getShips() ) ).to.have.members( [ ship2 ] );
		} );
	} );

	describe( 'moveShip()', () => {
		it( 'should put ship on the correct fields', () => {
			const ship = new Ship( { length: 2 } );

			const posA = new Position( 1, 1 );
			const posB = new Position( 2, 1 );

			battlefield.moveShip( ship, posA );

			const field1 = battlefield.getField( posA );
			const field2 = battlefield.getField( posB );

			expect( ship.coordinates ).to.deep.equal( [ posA, posB ] );

			expect( field1 ).to.have.length( 1 );
			expect( field1.getFirstShip() ).to.equal( ship );

			expect( field2 ).to.have.length( 1 );
			expect( field2.getFirstShip() ).to.equal( ship );
		} );

		it( 'should put rotated ship on the correct fields', () => {
			const ship = new Ship( { length: 2 } );

			const posA = new Position( 1, 1 );
			const posB = new Position( 1, 2 );

			battlefield.moveShip( ship, posA, true );

			const field1 = battlefield.getField( posA );
			const field2 = battlefield.getField( posB );

			expect( ship.coordinates ).to.deep.equal( [ posA, posB ] );

			expect( field1 ).to.have.length( 1 );
			expect( field1.getFirstShip() ).to.equal( ship );

			expect( field2 ).to.have.length( 1 );
			expect( field2.getFirstShip() ).to.equal( ship );
		} );

		it( 'should move ship from one fields to the others', () => {
			const ship = new Ship( { length: 2 } );

			const oldPosHead = Position.fromJSON( [ 1, 1 ] );
			const oldPosTail = Position.fromJSON( [ 2, 1 ] );

			const newPosHead = Position.fromJSON( [ 3, 3 ] );
			const newPosTail = Position.fromJSON( [ 4, 3 ] );

			// Put ship.
			battlefield.moveShip( ship, oldPosHead );

			expect( ship.coordinates ).to.deep.equal( [ oldPosHead, oldPosTail ] );

			// Then move it.
			battlefield.moveShip( ship, newPosHead );

			expect( ship.coordinates ).to.deep.equal( [ newPosHead, newPosTail ] );

			// Previous position should be empty.
			expect( battlefield.hasField( oldPosHead ) ).to.false;
			expect( battlefield.hasField( oldPosTail ) ).to.false;

			const headField = battlefield.getField( newPosHead );
			const tailField = battlefield.getField( newPosTail );

			// Ship should be on the next position.
			expect( Array.from( headField.getShips() ) ).to.have.members( [ ship ] );
			expect( Array.from( tailField.getShips() ) ).to.have.members( [ ship ] );

			expect( ship.coordinates ).to.deep.equal( [ newPosHead, newPosTail ] );
		} );

		it( 'should move ship when there is more than one ship on the same field', () => {
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.moveShip( ship1, new Position( 1, 1 ) );
			battlefield.moveShip( ship2, new Position( 2, 1 ) );
			battlefield.moveShip( ship1, new Position( 2, 4 ) );

			expect( ship1.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 2, 4 ], [ 3, 4 ] ] );
		} );

		it( 'should rotated ship with no move', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.moveShip( ship, new Position( 1, 1 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated ship while moving', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.moveShip( ship, new Position( 2, 2 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 2, 2 ], [ 2, 3 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 4, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 3, 1 ], [ 4, 1 ] ] );
		} );

		it( 'should keep ship inside battlefield bounds on ship rotate', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 4 ), true );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 3 ], [ 1, 4 ] ] );
		} );

		it( 'should not move ship when battlefield is locked', () => {
			battlefield.isLocked = true;

			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 4 ), true );

			expect( ship.position ).to.undefined;
		} );
	} );

	describe( 'rotateShip()', () => {
		it( 'should rotate ship', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 1 ) );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			battlefield.rotateShip( ship );

			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );
	} );

	describe( 'destroy()', () => {
		it( 'should clear event emitters', () => {
			const spy = sandbox.spy( battlefield, 'stopListening' );

			battlefield.destroy();

			sinon.assert.called( spy );
		} );
	} );
} );
