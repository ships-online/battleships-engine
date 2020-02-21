import { expect } from 'chai';

import Battlefield from '../../../src/battlefields/battlefield';
import ShotInterface from '../../../src/battlefields/interfaces/shotinterface';
import Ship from '../../../src/ship';
import Position from '../../../src/position';
import mix from 'js-utils/src/mix';

describe( 'ShotInterface', () => {
	class ShotBattlefield extends Battlefield {}
	interface ShotBattlefield extends ShotInterface {}
	mix( Battlefield, ShotInterface );

	let battlefield: ShotBattlefield, initialShips: Ship[];

	beforeEach( () => {
		initialShips = Battlefield.createShipsFromSchema( { 2: 2 } );
		battlefield = new ShotBattlefield( 10, { 2: 2 }, initialShips );
	} );

	afterEach( () => {
		battlefield.destroy();
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.shot ).to.be.a( 'function' );
	} );

	describe( 'shot', () => {
		it( 'should mark field as missed and return data when field is empty', () => {
			const position = new Position( 1, 1 );

			const result = battlefield.shot( position );

			expect( result ).to.deep.equal( { type: 'missed', position } );

			const fields = battlefield.getFields();

			expect( fields ).to.length( 1 );
			expect( fields[ 0 ].status ).to.equal( 'missed' );
			expect( fields[ 0 ].position ).to.deep.equal( position );
		} );

		it( 'should return the same data when shot the same empty field more than once', () => {
			const position = new Position( 1, 1 );

			const result1 = battlefield.shot( position );
			const result2 = battlefield.shot( position );

			expect( result1 ).to.deep.equal( result2 );
		} );

		it( 'should mark field as hit and return data when ship is on the field', () => {
			const position = new Position( 1, 1 );
			const [ ship ] = initialShips;

			battlefield.moveShip( ship.id, position );

			const result = battlefield.shot( position );

			const fields = battlefield.getFields();

			expect( result ).to.deep.equal( { type: 'hit', position } );
			expect( fields ).to.length( 1 );

			expect( fields[ 0 ].position ).to.deep.equal( position );
			expect( fields[ 0 ].status ).to.equal( 'hit' );
		} );

		it( 'should return the same data when shot the same non empty field more than once', () => {
			const position = new Position( 1, 1 );
			const [ ship ] = initialShips;

			battlefield.moveShip( ship.id, position );

			const result1 = battlefield.shot( position );
			const result2 = battlefield.shot( position );

			expect( result1 ).to.deep.equal( result2 );
		} );

		it( 'should set damage to ship when ship is on the field (head)', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( ship.id, new Position( 1, 1 ) );
			battlefield.shot( new Position( 1, 1 ) );

			expect( ship.hitFields ).to.have.members( [ true, false ] );
		} );

		it( 'should set damage to ship when ship is on the field (tail)', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( ship.id, new Position( 1, 1 ) );
			battlefield.shot( new Position( 2, 1 ) );

			expect( ship.hitFields ).to.have.members( [ false, true ] );
		} );

		it( 'should return sunken ship in the result', () => {
			const [ ship ] = initialShips;

			battlefield.moveShip( ship.id, new Position( 1, 1 ) );
			battlefield.shot( new Position( 1, 1 ) );

			const position = new Position( 2, 1 );
			const result = battlefield.shot( position );

			expect( result ).to.deep.equal( {
				type: 'hit',
				position,
				sunkenShip: ship
			} );
		} );
	} );
} );
