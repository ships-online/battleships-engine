import Battlefield from '../../src/battlefield';
import Ship from '../../src/ship';
import collisionInterface from '../../src/battlefieldinterfaces/collisioninterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

describe( 'Battlefield collision interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, collisionInterface );

		battlefield = new Battlefield( 5 );
	} );

	describe( 'checkShipCollision', () => {
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

	describe( 'verifyExistingCollisions', () => {
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
} );
