import { expect } from 'chai';

import CollisionInterface from '../../../src/battlefields/interfaces/collisioninterface';
import Battlefield from '../../../src/battlefields/battlefield';
import Position from '../../../src/position';
import mix from 'js-utils/src/mix';

describe( 'ShotInterface', () => {
	class CollisionBattlefield extends Battlefield {}
	interface CollisionBattlefield extends Battlefield, CollisionInterface {}
	mix( CollisionBattlefield, CollisionInterface );

	it( 'should be as class interface', () => {
		const battlefield = new CollisionBattlefield( 10, { 1: 1 } );

		expect( battlefield.checkCollision ).to.be.a( 'function' );

		battlefield.destroy();
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

			const battlefield = new CollisionBattlefield( 10, { 1: 1, 4: 4 } );
			const [ ship1, ship2, ship3, ship4, ship5 ] = battlefield.getShips();

			battlefield.moveShip( ship1.id, new Position( 2, 2 ) );
			battlefield.moveShip( ship2.id, new Position( 0, 0 ) );
			battlefield.moveShip( ship3.id, new Position( 4, 0 ), true );
			battlefield.moveShip( ship4.id, new Position( 1, 4 ) );
			battlefield.moveShip( ship5.id, new Position( 0, 1 ), true );

			expect( battlefield.checkCollision( ship1 ) ).to.false;
		} );

		it( 'should return `true` and mark ships as hasCollision when there is more than one ship on the same field #1', () => {
			// [1,2]
			const battlefield = new CollisionBattlefield( 10, { 1: 2 } );
			const [ ship1, ship2 ] = battlefield.getShips();

			battlefield.moveShip( ship1.id, new Position( 3, 3 ) );
			battlefield.moveShip( ship2.id, new Position( 3, 3 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #2', () => {
			// [ 1 ][1,2][ 2 ]
			const battlefield = new CollisionBattlefield( 10, { 2: 2 } );
			const [ ship1, ship2 ] = battlefield.getShips();

			battlefield.moveShip( ship1.id, new Position( 0, 0 ) );
			battlefield.moveShip( ship2.id, new Position( 1, 0 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #3', () => {
			//      [ 1 ]
			// [ 2 ][1,2]
			const battlefield = new CollisionBattlefield( 10, { 2: 2 } );
			const [ ship1, ship2 ] = battlefield.getShips();

			battlefield.moveShip( ship1.id, new Position( 1, 0 ), true );
			battlefield.moveShip( ship2.id, new Position( 0, 1 ) );

			expect( battlefield.checkCollision( ship1 ) ).to.true;
			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when ship sticks to other ships', () => {
			// [2][3][4]
			// [5][1][6]
			// [7][8][9]
			const battlefield = new CollisionBattlefield( 10, { 1: 9 } );
			const [ ship1, ship2, ship3, ship4, ship5, ship6, ship7, ship8, ship9 ] = battlefield.getShips();

			battlefield.moveShip( ship1.id, new Position( 2, 2 ) );
			battlefield.moveShip( ship2.id, new Position( 1, 1 ) );
			battlefield.moveShip( ship3.id, new Position( 2, 1 ) );
			battlefield.moveShip( ship4.id, new Position( 3, 1 ) );
			battlefield.moveShip( ship5.id, new Position( 3, 2 ) );
			battlefield.moveShip( ship6.id, new Position( 3, 3 ) );
			battlefield.moveShip( ship7.id, new Position( 2, 3 ) );
			battlefield.moveShip( ship8.id, new Position( 1, 3 ) );
			battlefield.moveShip( ship9.id, new Position( 1, 2 ) );

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
			const battlefield = new CollisionBattlefield( 10, { 2: 3 } );
			const [ ship1, ship2, ship3 ] = battlefield.getShips();

			// [1][1]
			// [2][2]
			// [3][3]
			battlefield.moveShip( ship1.id, new Position( 0, 0 ) );
			battlefield.moveShip( ship2.id, new Position( 0, 1 ) );
			battlefield.moveShip( ship3.id, new Position( 0, 2 ) );

			battlefield.checkCollision( ship2 );

			expect( ship1.hasCollision ).to.true;
			expect( ship2.hasCollision ).to.true;
			expect( ship3.hasCollision ).to.true;

			// [1][1]
			//          [2][2]
			// [3][3]
			battlefield.moveShip( ship2.id, new Position( 3, 1 ) );

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
