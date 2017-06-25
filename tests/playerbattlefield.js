import PlayerBattlefield from '../src/playerbattlefield';
import Battlefield from '../src/battlefield';
import Ship from '../src/ship';

describe( 'PlayerBattlefield', () => {
	let playerBattlefield;

	beforeEach( () => {
		playerBattlefield = new PlayerBattlefield( 5 );
	} );

	it( 'should extend Battlefield', () => {
		expect( playerBattlefield ).to.instanceof( Battlefield );
	} );

	it( 'should check collision after move', () => {
		const ship1 = new Ship( { length: 2 } );
		const ship2 = new Ship( { length: 2 } );

		playerBattlefield.moveShip( ship1, [ 1, 1 ] );
		playerBattlefield.moveShip( ship2, [ 1, 2 ] );

		expect( playerBattlefield.isCollision ).to.true;
		expect( ship1.isCollision ).to.true;
		expect( ship2.isCollision ).to.true;

		playerBattlefield.moveShip( ship2, [ 1, 3 ] );

		expect( playerBattlefield.isCollision ).to.false;
		expect( ship1.isCollision ).to.false;
		expect( ship2.isCollision ).to.false;
	} );
} );
