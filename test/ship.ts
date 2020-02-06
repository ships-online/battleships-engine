import { expect } from 'chai';
import sinon from 'sinon';

import Ship from '../src/ship';
import Position from '../src/position';

describe( 'Ship', () => {
	let sandbox: sinon.SinonSandbox, ship: Ship;

	beforeEach( () => {
		sandbox = sinon.createSandbox();
		ship = new Ship( {
			id: 'some-id',
			length: 3,
			isRotated: true,
			position: new Position( 1, 1 )
		} );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Ship with given values', () => {
			expect( ship ).to.have.property( 'id', 'some-id' );
			expect( ship ).to.have.property( 'length', 3 );
			expect( ship ).to.have.property( 'isRotated', true );
			expect( ship ).to.have.property( 'hasCollision', false );
			expect( ship ).to.have.property( 'hitFields' ).to.deep.equal( [ false, false, false ] );

			expect( ship ).to.have.property( 'position' ).to.instanceof( Position );
			expect( ship.position.toJSON() ).to.deep.equal( [ 1, 1 ] );
		} );

		it( 'should create an instance of Ship with default values', () => {
			ship = new Ship( { length: 3 } );

			expect( ship ).to.have.property( 'id' ).to.be.a( 'string' );
			expect( ship ).to.have.property( 'length', 3 );
			expect( ship ).to.have.property( 'isRotated', false );
			expect( ship ).to.have.property( 'hasCollision', false );
			expect( ship ).to.have.property( 'hitFields' ).to.deep.equal( [ false, false, false ] );

			expect( ship.position ).to.undefined;
		} );

		it( 'should create an instance of Ship with position given as a JSON', () => {
			ship = new Ship( { length: 3, position: [ 1, 2 ] } );

			expect( ship.position ).to.instanceof( Position );
			expect( ship.position.toJSON() ).to.deep.equal( [ 1, 2 ] );
		} );
	} );

	describe( 'coordinates', () => {
		it( 'should return array of positions of each ship fields', () => {
			ship.position = new Position( 1, 1 );
			ship.isRotated = false;

			expect( ship.coordinates ).to.have.length( 3 );
			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ], [ 3, 1 ] ] );
		} );

		it( 'should return array of positions of each ship fields when ship is rotated', () => {
			ship.position = new Position( 1, 1 );
			ship.isRotated = true;

			expect( ship.coordinates ).to.have.length( 3 );
			expect( ship.coordinates.map( pos => pos.toJSON() ) ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ], [ 1, 3 ] ] );
		} );

		it( 'should return empty array if ship has no position', () => {
			ship.position = null;

			expect( ship.coordinates ).to.deep.equal( [] );
		} );
	} );

	describe( 'tail', () => {
		it( 'should return position of ship tail #1', () => {
			ship = new Ship( { length: 4 } );

			ship.position = new Position( 1, 1 );

			expect( ship.tail ).instanceof( Position );
			expect( ship.tail.toJSON() ).to.deep.equal( [ 4, 1 ] );
		} );

		it( 'should return position of ship tail #2', () => {
			ship = new Ship( { length: 4 } );

			ship.position = new Position( 1, 1 );
			ship.rotate();

			expect( ship.tail ).instanceof( Position );
			expect( ship.tail.toJSON() ).to.deep.equal( [ 1, 4 ] );
		} );

		it( 'should return position of ship tail #3', () => {
			ship = new Ship( { length: 1 } );

			ship.position = new Position( 1, 1 );

			expect( ship.tail ).instanceof( Position );
			expect( ship.tail.toJSON() ).to.deep.equal( [ 1, 1 ] );
		} );
	} );

	describe( 'hasSunk', () => {
		it( 'should return false when there is at least one non-hit field', () => {
			ship.hitFields = [ false, false, false ];

			expect( ship.hasSunk ).to.false;

			ship.hitFields = [ false, true, true ];

			expect( ship.hasSunk ).to.false;
		} );

		it( 'should return true when all fields are hit', () => {
			ship.hitFields = [ true, true, true ];

			expect( ship.hasSunk ).to.true;
		} );
	} );

	describe( 'rotate()', () => {
		it( 'should toggle isRotated state', () => {
			ship.isRotated = false;

			expect( ship.isRotated ).to.false;

			ship.rotate();

			expect( ship.isRotated ).to.true;

			ship.rotate();

			expect( ship.isRotated ).to.false;
		} );
	} );

	describe( 'hit()', () => {
		it( 'should set mark given field as hit', () => {
			ship.position = new Position( 1, 1 );
			ship.isRotated = false;

			expect( ship.hitFields ).to.deep.equal( [ false, false, false ] );

			ship.hit( new Position( 2, 1 ) );

			expect( ship.hitFields ).to.deep.equal( [ false, true, false ] );

			ship.hit( new Position( 3, 1 ) );

			expect( ship.hitFields ).to.deep.equal( [ false, true, true ] );

			ship.hit( new Position( 1, 1 ) );

			expect( ship.hitFields ).to.deep.equal( [ true, true, true ] );
		} );

		it( 'should throw when ship has no field on given position', () => {
			ship.position = new Position( 1, 1 );
			ship.isRotated = false;

			expect( () => {
				ship.hit( new Position( 5, 5 ) );
			} ).to.throw( Error, 'Ship has no field on this position.' );
		} );
	} );

	describe( 'reset()', () => {
		it( 'should reset ship to the default values', () => {
			const ship = new Ship( { length: 2, position: [ 1, 1 ] } );

			ship.isRotated = true;
			ship.hit( new Position( 1, 1 ) );
			ship.hasCollision = true;

			ship.reset();

			expect( ship.position ).to.undefined;
			expect( ship.hitFields ).to.deep.equal( [ false, false ] );
			expect( ship.isRotated ).to.false;
			expect( ship.hasCollision ).to.false;
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return ship in JSON format', () => {
			ship = new Ship( {
				id: 'some-id',
				length: 3,
				isRotated: true,
				position: [ 1, 1 ]
			} );

			const json = ship.toJSON();

			expect( json ).to.have.property( 'id', 'some-id' );
			expect( json ).to.have.property( 'length', 3 );
			expect( json ).to.have.property( 'isRotated', true );
			expect( json ).to.have.property( 'position' ).to.deep.equal( [ 1, 1 ] );
		} );
	} );
} );
