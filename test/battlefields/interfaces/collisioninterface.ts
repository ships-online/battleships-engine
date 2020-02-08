import { expect } from 'chai';

import CollisionInterface from '../../../src/battlefields/interfaces/collisioninterface';
import Battlefield from '../../../src/battlefields/battlefield';
import Position from '../../../src/position';
import Ship from '../../../src/ship';
import mix from 'js-utils/src/mix';

describe( 'ShotInterface', () => {
	class CollisionBattlefield extends Battlefield {}
	interface CollisionBattlefield extends Battlefield, CollisionInterface {}
	mix( CollisionBattlefield, CollisionInterface );

	let battlefield: CollisionBattlefield;

	beforeEach( () => {
		battlefield = new CollisionBattlefield( 10, { 1: 2, 4: 4 } );
	} );

	afterEach( () => {
		battlefield.destroy();
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.checkCollision ).to.be.a( 'function' );
	} );

	describe( 'checkCollision()', () => {
		it( 'should return `false` and not mark ship as hasCollision when ship has no contact with other ships', () => {
			// Ship is surrounded by other ships, but there is a one field position of space between them.
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

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );
			battlefield.addShip( ship3 );
			battlefield.addShip( ship4 );
			battlefield.addShip( ship5 );

			battlefield.moveShip( ship1, new Position( 2, 2 ) );
			battlefield.moveShip( ship2, new Position( 0, 0 ) );
			battlefield.moveShip( ship3, new Position( 4, 0 ), true );
			battlefield.moveShip( ship4, new Position( 1, 4 ) );
			battlefield.moveShip( ship5, new Position( 0, 1 ), true );

			expect( battlefield.checkCollision( ship1 ) ).to.false;
		} );

		it( 'should return `true` and mark ships as hasCollision when there is more than one ship on the same field #1', () => {
			// [1,2]
			const ship1 = new Ship( { length: 1 } );
			const ship2 = new Ship( { length: 1 } );

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );

			battlefield.moveShip( ship1, new Position( 3, 3 ) );
			battlefield.moveShip( ship2, new Position( 3, 3 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #2', () => {
			// [ 1 ][1,2][ 2 ]
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );

			battlefield.moveShip( ship1, new Position( 0, 0 ) );
			battlefield.moveShip( ship2, new Position( 1, 0 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #3', () => {
			//      [ 1 ]
			// [ 2 ][1,2]
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );

			battlefield.moveShip( ship1, new Position( 1, 0 ), true );
			battlefield.moveShip( ship2, new Position( 0, 1 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when ship sticks to other ships', () => {
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

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );
			battlefield.addShip( ship3 );
			battlefield.addShip( ship4 );
			battlefield.addShip( ship5 );
			battlefield.addShip( ship6 );
			battlefield.addShip( ship7 );
			battlefield.addShip( ship8 );
			battlefield.addShip( ship9 );

			battlefield.moveShip( ship1, new Position( 2, 2 ) );
			battlefield.moveShip( ship2, new Position( 1, 1 ) );
			battlefield.moveShip( ship3, new Position( 2, 1 ) );
			battlefield.moveShip( ship4, new Position( 3, 1 ) );
			battlefield.moveShip( ship5, new Position( 3, 2 ) );
			battlefield.moveShip( ship6, new Position( 3, 3 ) );
			battlefield.moveShip( ship7, new Position( 2, 3 ) );
			battlefield.moveShip( ship8, new Position( 1, 3 ) );
			battlefield.moveShip( ship9, new Position( 1, 2 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
			expect( ship3.hasCollision ).to.true;
			expect( ship4.hasCollision ).to.true;
			expect( ship5.hasCollision ).to.true;
			expect( ship6.hasCollision ).to.true;
			expect( ship7.hasCollision ).to.true;
			expect( ship8.hasCollision ).to.true;
			expect( ship9.hasCollision ).to.true;
		} );

		it( 'should verify if ships on the battlefield still have a collision', () => {
			const ship1 = new Ship( { length: 2 } );
			const ship2 = new Ship( { length: 2 } );
			const ship3 = new Ship( { length: 2 } );

			battlefield.addShip( ship1 );
			battlefield.addShip( ship2 );
			battlefield.addShip( ship3 );

			// [1][1]
			// [2][2]
			// [3][3]
			battlefield.moveShip( ship1, new Position( 0, 0 ) );
			battlefield.moveShip( ship2, new Position( 0, 1 ) );
			battlefield.moveShip( ship3, new Position( 0, 2 ) );

			battlefield.checkCollision( ship2 );

			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
			expect( ship3.hasCollision ).to.true;

			// [1][1]
			//          [2][2]
			// [3][3]
			battlefield.moveShip( ship2, new Position( 3, 1 ) );

			battlefield.checkCollision( ship2 );

			expect( ship1.hasCollision ).to.false;
			expect( ship2.hasCollision ).to.false;
			expect( ship3.hasCollision ).to.false;
		} );
	} );

	// describe( 'static validateShips()', () => {
	// 	it( 'should return false when there is no ships to validate', () => {
	// 		expect( battlefield.validateShips( [] ) ).to.false;
	// 	} );
	//
	// 	it( 'should return true when ships are inside battlefield bounds and do not have a collision', () => {
	// 		const ship1 = new Ship( { length: 4 } );
	// 		const ship2 = new Ship( { length: 4 } );
	//
	// 		ship1.position = [ 1, 1 ];
	// 		ship2.position = [ 1, 3 ];
	//
	// 		expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.true;
	// 	} );
	//
	// 	it( 'should return false when ships are not inside battlefield bounds and do not have a collision', () => {
	// 		const ship1 = new Ship( { length: 4 } );
	// 		const ship2 = new Ship( { length: 4 } );
	//
	// 		ship1.position = [ 1, 1 ];
	// 		ship2.position = [ 2, 3 ];
	//
	// 		expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.false;
	// 	} );
	//
	// 	it( 'should return false when ships are not inside battlefield bounds and do have a collision', () => {
	// 		const ship1 = new Ship( { length: 4 } );
	// 		const ship2 = new Ship( { length: 4 } );
	//
	// 		ship1.position = [ 1, 1 ];
	// 		ship2.position = [ 2, 1 ];
	//
	// 		expect( battlefield.validateShips( [ ship1, ship2 ] ) ).to.false;
	// 	} );
	// } );
} );
