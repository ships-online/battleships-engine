import Battlefield from '../../src/battlefield';
import ShipsCollection from '../../src/shipscollection';
import randomInterface from '../../src/battlefieldinterfaces/randominterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

describe( 'Battlefield random interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, randomInterface );

		battlefield = new Battlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
		battlefield.shipsCollection.add( ShipsCollection.createShipsFromSchema( battlefield.shipsSchema ) )
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.random ).to.be.a( 'function' );
	} );

	it( 'should implement collision interface', () => {
		expect( battlefield.checkShipCollision ).to.be.a( 'function' );
	} );

	describe( 'random', () => {
		it( 'should place ships from shipsCollection on battlefield with no collision', () => {
			battlefield.random();

			for ( const ship of battlefield.shipsCollection ) {
				expect( ship.coordinates ).to.not.include( [ null, null ] );
				expect( ship.isCollision ).to.false;
			}
		} );

		it( 'should do nothing when battlefield is locked', () => {
			battlefield.isLocked = true;

			battlefield.random();

			for ( const ship of battlefield.shipsCollection ) {
				expect( ship.position ).to.deep.equal( [ null, null ] );
			}
		} );
	} );
} );
