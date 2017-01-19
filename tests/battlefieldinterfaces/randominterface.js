import Battlefield from 'src/battlefield.js';
import randomInterface from 'src/battlefieldinterfaces/randominterface.js';
import collisionInterface from 'src/battlefieldinterfaces/collisioninterface.js';
import mix from 'battleships-utils/src/mix.js';

describe( 'Battlefield random interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, randomInterface );

		battlefield = new Battlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.random ).to.function;
	} );

	it( 'should implement collsion interface', () => {
		expect( battlefield.checkCollision ).to.function;
	} );

	describe( 'random', () => {
		it( 'should place ships on battlefield with no collision', () => {
			battlefield.random();

			for ( const ship of battlefield.shipsCollection ) {
				expect( ship.coordinates ).to.not.include( [ null, null ] );
				expect( ship.isCollision ).to.false;
			}
		} );
	} );
} );