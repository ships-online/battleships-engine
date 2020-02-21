import { expect } from 'chai';

import PlayerBattlefield from '../../src/battlefields/playerbattlefield';
import Battlefield from '../../src/battlefields/battlefield';
import Ship from '../../src/ship';
import Position from '../../src/position';

describe( 'PlayerBattlefield', () => {
	let battlefield: PlayerBattlefield, initialShips: Ship[];

	beforeEach( () => {
		initialShips = PlayerBattlefield.createShipsFromJSON( [
			{ id: '1', length: 2 },
			{ id: '2', length: 2 }
		] );

		battlefield = new PlayerBattlefield( 5, { 2: 2 }, initialShips );
	} );

	afterEach( () => {
		battlefield.destroy();
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

	it( 'should check collision after move', () => {
		const [ ship1, ship2 ] = initialShips;

		expect( battlefield.hasCollision ).to.false;
		expect( ship1.hasCollision ).to.false;
		expect( ship2.hasCollision ).to.false;

		battlefield.moveShip( '1', new Position( 1, 1 ) );
		battlefield.moveShip( '2', new Position( 1, 2 ) );

		expect( battlefield.hasCollision ).to.true;
		expect( ship1.hasCollision ).to.true;
		expect( ship2.hasCollision ).to.true;

		battlefield.moveShip( '2', new Position( 1, 3 ) );

		expect( battlefield.hasCollision ).to.false;
		expect( ship1.hasCollision ).to.false;
		expect( ship2.hasCollision ).to.false;
	} );
} );
