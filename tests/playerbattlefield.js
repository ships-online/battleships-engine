import PlayerBattlefield from 'src/playerbattlefield.js';
import Battlefield from 'src/battlefield.js';
import Ship from 'src/ship.js';

describe( 'Battlefield:', () => {
	let playerbattlefield;

	beforeEach( () => {
		playerbattlefield = new PlayerBattlefield( 5 );
	} );

	it( 'should extend Battlefield', () => {
		expect( playerbattlefield ).to.instanceof( Battlefield );
	} );

	it( 'should check collision after move', () => {
		const ship1 = new Ship( { length: 2 } );
		const ship2 = new Ship( { length: 2 } );

		playerbattlefield.moveShip( ship1, [ 1, 1 ] );
		playerbattlefield.moveShip( ship2, [ 1, 2 ] );

		expect( ship1.isCollision ).to.true;
		expect( ship2.isCollision ).to.true;

		playerbattlefield.moveShip( ship2, [ 1, 3 ] );

		expect( ship1.isCollision ).to.false;
		expect( ship2.isCollision ).to.false;
	} );
} );
