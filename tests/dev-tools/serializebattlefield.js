import serializeBattlefield from 'src/dev-tools/serializebattlefield.js';
import Battlefield from 'src/battlefield.js';
import Ship from 'src/ship.js';

describe( 'serializeBattlefield', () => {
	it( 'should return data of empty battlefield', () => {
		const battlefield = new Battlefield( 2 );

		const result = serializeBattlefield( battlefield );

		expect( result ).to.have.property( '0' ).to.object;
		expect( result[ '0' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '0' ] ).to.have.property( '1' ).to.equal( '' );

		expect( result ).to.have.property( '1' ).to.object;
		expect( result[ '1' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '1' ] ).to.have.property( '1' ).to.equal( '' );
	} );

	it( 'should return data of not empty battlefield', () => {
		const battlefield = new Battlefield( 2 );
		const item1 = new Ship( { id: 1, length: 2 } );
		const item2 = new Ship( { id: 2, length: 2 } );

		battlefield.moveShip( item1, [ 0, 1 ] );
		battlefield.moveShip( item2, [ 1, 0 ], true );

		const result = serializeBattlefield( battlefield );

		expect( result ).to.have.property( '0' ).to.object;
		expect( result[ '0' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '0' ] ).to.have.property( '1' ).to.equal( '2' );

		expect( result ).to.have.property( '1' ).to.object;
		expect( result[ '1' ] ).to.have.property( '0' ).to.equal( '1' );
		expect( result[ '1' ] ).to.have.property( '1' ).to.equal( '1,2' );
	} );
} );
