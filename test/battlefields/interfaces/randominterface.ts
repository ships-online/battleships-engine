import { expect } from 'chai';

import Battlefield from '../../../src/battlefields/battlefield';
import RandomInterface from '../../../src/battlefields/interfaces/randominterface';
import mix from 'js-utils/src/mix';

describe( 'RandomInterface', () => {
	class RandomBattlefield extends Battlefield {}
	interface RandomBattlefield extends Battlefield, RandomInterface {}
	mix( RandomBattlefield, RandomInterface );

	let battlefield: RandomBattlefield;

	beforeEach( () => {
		battlefield = new RandomBattlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	afterEach( () => {
		battlefield.destroy();
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.random ).to.be.a( 'function' );
	} );

	it( 'should implement collision interface', () => {
		expect( battlefield.checkCollision ).to.be.a( 'function' );
	} );

	describe( 'random()', () => {
		it( 'should arrange ships on battlefield with no collision', () => {
			for ( const ship of battlefield.getShips() ) {
				expect( ship.position ).to.undefined;
				expect( ship.hasCollision ).to.false;
			}

			battlefield.random();

			for ( const ship of battlefield.getShips() ) {
				expect( ship.position ).to.not.undefined;
				expect( ship.hasCollision ).to.false;
			}
		} );

		it( 'should do nothing when battlefield is locked', () => {
			battlefield.isLocked = true;

			battlefield.random();

			for ( const ship of battlefield.getShips() ) {
				expect( ship.position ).to.undefined;
			}
		} );

		it( 'should not get into infinite loop when random interface is not able to arrange ships', () => {
			battlefield = new RandomBattlefield( 1, { 1: 2 } );

			battlefield.random();

			for ( const ship of battlefield.getShips() ) {
				expect( ship.hasCollision ).to.true;
			}
		} );
	} );
} );
