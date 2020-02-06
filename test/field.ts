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
		it( 'should create instance using position', () => {
			expect( field.position ).to.equal( position );
		} );

		it( 'should create instance using position JSON', () => {
			const field = new Field( [ 1, 2 ] );

			expect( field.position ).to.instanceof( Position );
			expect( field.position.toJSON() ).to.deep.equal( [ 1, 2 ] );
		} );
	} );

	describe( 'hit marker', () => {
		it( 'should mark field as hit', () => {
			expect( field.isHit ).to.false;

			field.markAsHit();

			expect( field.isHit ).to.true;
		} );
	} );

	describe( 'missed marker', () => {
		it( 'should mark field as missed', () => {
			expect( field.isMissed ).to.false;

			field.markAsMissed();

			expect( field.isMissed ).to.true;
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

			expect( Array.from( field.getShips() ) ).to.have.members( [ ship1, ship2 ] );
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
} );
