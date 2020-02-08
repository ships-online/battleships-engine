import { expect } from 'chai';

import PlayerBattlefield from '../../src/battlefields/playerbattlefield';
import Battlefield from '../../src/battlefields/battlefield';
import Ship from '../../src/ship';
import Position from '../../src/position';

describe( 'PlayerBattlefield', () => {
	let battlefield: PlayerBattlefield;

	beforeEach( () => {
		battlefield = new PlayerBattlefield( 5, { 2: 1, 4: 1 } );
	} );

	it( 'should extend Battlefield', () => {
		expect( battlefield ).to.instanceof( Battlefield );
	} );

	it( 'should implement CollisionInterface', () => {
		expect( battlefield.checkCollision ).to.be.a( 'function' );
	} );

	it( 'should implement RandomInterface', () => {
		expect( battlefield.random ).to.be.a( 'function' );
	} );

	it( 'should create ships based on schema', () => {
		expect( Array.from( battlefield.getShips(), ship => ship.length ) ).to.have.members( [ 2, 4 ] );
	} );

	it( 'should check collision after move', () => {
		const ship1 = new Ship( { length: 2 } );
		const ship2 = new Ship( { length: 2 } );

		battlefield.addShip( ship1 );
		battlefield.addShip( ship2 );

		expect( battlefield.hasCollision ).to.false;
		expect( ship1.hasCollision ).to.false;
		expect( ship2.hasCollision ).to.false;

		battlefield.moveShip( ship1, new Position( 1, 1 ) );
		battlefield.moveShip( ship2, new Position( 1, 2 ) );

		expect( battlefield.hasCollision ).to.true;
		expect( ship1.hasCollision ).to.true;
		expect( ship2.hasCollision ).to.true;

		battlefield.moveShip( ship2, new Position( 1, 3 ) );

		expect( battlefield.hasCollision ).to.false;
		expect( ship1.hasCollision ).to.false;
		expect( ship2.hasCollision ).to.false;
	} );
} );
