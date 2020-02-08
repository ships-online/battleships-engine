import { expect } from 'chai';

import OpponentBattlefield from '../../src/battlefields/opponentbattlefield';
import Battlefield from '../../src/battlefields/battlefield';

describe( 'OpponentBattlefield', () => {
	let battlefield: OpponentBattlefield;

	beforeEach( () => {
		battlefield = new OpponentBattlefield( 5, { 2: 1, 4: 1 } );
	} );

	afterEach( () => {
		battlefield.destroy();
	} );

	it( 'should extend Battlefield', () => {
		expect( battlefield ).to.instanceof( Battlefield );
	} );

	it( 'should implement ShotInterface', () => {
		expect( battlefield.shot ).to.be.a( 'function' );
	} );
} );
