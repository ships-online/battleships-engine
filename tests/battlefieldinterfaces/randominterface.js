import Battlefield from 'src/battlefield.js';
import randomInterface from 'src/battlefieldinterfaces/randominterface.js';
import mix from 'lib/utils/mix.js';

describe( 'Battlefield random interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, randomInterface );

		battlefield = new Battlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.random ).to.function;
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
