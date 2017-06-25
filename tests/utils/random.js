import random from 'src/utils/random.js';

describe( 'random', () => {
	it( 'should generate random number in given range', () => {
		for ( let i = 0; i < 100; i++ ) {
			const result = random( 1, 3 );

			expect( result ).to.be.a( 'number' );
			expect( result ).to.within( 1, 3 );
		}
	} );
} );
