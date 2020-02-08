import { expect } from 'chai';

import serializeBattlefield, { SerializedBattlefield } from '../../src/dev-tools/serializebattlefield';
import Battlefield from '../../src/battlefields/battlefield';
import Position from '../../src/position';
import Ship from '../../src/ship';

describe( 'serializeBattlefield', () => {
	it( 'should return data of empty battlefield', () => {
		const battlefield = new Battlefield( 2, { 1: 1 } );

		const result: SerializedBattlefield = serializeBattlefield( battlefield );

		expect( result ).to.have.property( '0' ).to.be.a( 'object' );
		expect( result[ '0' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '0' ] ).to.have.property( '1' ).to.equal( '' );

		expect( result ).to.have.property( '1' ).to.be.a( 'object' );
		expect( result[ '1' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '1' ] ).to.have.property( '1' ).to.equal( '' );
	} );

	it( 'should return data of not empty battlefield', () => {
		const battlefield = new Battlefield( 2, { 2: 2 } );
		const ship1 = new Ship( { id: '1', length: 2 } );
		const ship2 = new Ship( { id: '2', length: 2 } );

		battlefield.moveShip( ship1, new Position( 0, 1 ) );
		battlefield.moveShip( ship2, new Position( 1, 0 ), true );

		const result = serializeBattlefield( battlefield );

		expect( result ).to.have.property( '0' ).to.be.a( 'object' );
		expect( result[ '0' ] ).to.have.property( '0' ).to.equal( '' );
		expect( result[ '0' ] ).to.have.property( '1' ).to.equal( '2' );

		expect( result ).to.have.property( '1' ).to.be.a( 'object' );
		expect( result[ '1' ] ).to.have.property( '0' ).to.equal( '1' );
		expect( result[ '1' ] ).to.have.property( '1' ).to.equal( '1,2' );
	} );
} );
