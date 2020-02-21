import { expect } from 'chai';
import Field from '../src/field';
import Position from '../src/position';
import Ship from '../src/ship';

describe( 'Field', () => {
	let field: Field, position: Position;

	beforeEach( () => {
		position = new Position( 1, 1 );
		field = new Field( position );
	} );

	describe( 'constructor()', () => {
		it( 'should create instance', () => {
			expect( field.position ).to.equal( position );
		} );
	} );

	describe( 'isUnmarked', () => {
		it( 'should return true when field is not marked as missed or hit', () => {
			field.status = 'unmarked';
			expect( field.isUnmarked ).to.true;

			field.status = 'hit';
			expect( field.isUnmarked ).to.false;

			field.status = 'missed';
			expect( field.isUnmarked ).to.false;
		} );
	} );

	describe( 'markAsHit()', () => {
		it( 'should mark field as hit', () => {
			expect( field.isUnmarked ).to.true;

			field.markAsHit();

			expect( field.status ).to.equal( 'hit' );
		} );

		it( 'should throw when try to mark already marked field', () => {
			field.markAsHit();

			expect( () => {
				field.markAsHit();
			} ).to.throw( Error, 'Cannot mark already marked field.' );
		} );
	} );

	describe( 'markAsMissed()', () => {
		it( 'should mark field as missed', () => {
			expect( field.isUnmarked ).to.true;

			field.markAsMissed();

			expect( field.status ).to.equal( 'missed' );
		} );

		it( 'should throw when try to mark already marked field', () => {
			field.markAsMissed();

			expect( () => {
				field.markAsMissed();
			} ).to.throw( Error, 'Cannot mark already marked field.' );
		} );
	} );

	describe( 'addShip()', () => {
		it( 'should add ship to the field', () => {
			expect( field.length ).to.equal( 0 );

			field.addShip( new Ship( { length: 1 } ) );

			expect( field.length ).to.equal( 1 );
		} );
	} );

	describe( 'getFirstShip()', () => {
		it( 'should return first ship', () => {
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			field.addShip( ship1 );
			field.addShip( ship2 );

			expect( field.getFirstShip() ).to.equal( ship1 );
		} );
	} );

	describe( 'getFirstShip()', () => {
		it( 'should check is field has a ship', () => {
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			field.addShip( ship1 );

			expect( field.hasShip( ship1 ) ).to.true;
			expect( field.hasShip( ship2 ) ).to.false;
		} );
	} );

	describe( 'getShips()', () => {
		it( 'should return all ships', () => {
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			field.addShip( ship1 );
			field.addShip( ship2 );

			expect( field.getShips() ).to.have.members( [ ship1, ship2 ] );
		} );
	} );

	describe( 'removeShip()', () => {
		it( 'should remove ship of given id', () => {
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			field.addShip( ship1 );
			field.addShip( ship2 );

			expect( Array.from( field.getShips() ) ).to.have.members( [ ship1, ship2 ] );

			field.removeShip( ship1 );

			expect( field.getFirstShip() ).to.equal( ship2 );
			expect( Array.from( field.getShips() ) ).to.have.members( [ ship2 ] );
		} );
	} );

	describe( 'length', () => {
		it( 'should return number of ships in field', () => {
			expect( field ).to.length( 0 );

			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			field.addShip( ship1 );
			field.addShip( ship2 );

			expect( field ).to.length( 2 );

			field.removeShip( ship1 );

			expect( field ).to.length( 1 );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return field marked as hit', () => {
			const field = new Field( new Position( 1, 1 ) );

			field.markAsHit();

			expect( field.toJSON() ).to.deep.equal( {
				position: [ 1, 1 ],
				status: 'hit'
			} );
		} );

		it( 'should return field marked as missed', () => {
			const field = new Field( new Position( 1, 1 ) );

			field.markAsMissed();

			expect( field.toJSON() ).to.deep.equal( {
				position: [ 1, 1 ],
				status: 'missed'
			} );
		} );

		it( 'should throw when try to use unmarked field', () => {
			const field = new Field( new Position( 1, 1 ) );

			expect( () => {
				field.toJSON();
			} ).to.throw( Error, /^Cannot serialize unmarked field./ );
		} );
	} );
} );
