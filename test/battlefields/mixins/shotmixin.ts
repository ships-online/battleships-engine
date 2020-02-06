import { expect } from 'chai';

import Battlefield from '../../../src/battlefields/battlefield';
import ShotMixin, { ShotInterface } from '../../../src/battlefields/mixins/shotmixin';
import Ship from '../../../src/ship';
import Position from '../../../src/position';
import mix from 'js-utils/src/mix';

describe( 'CollisionMixin', () => {
	class ShotBattlefield extends Battlefield {}
	interface ShotBattlefield extends Battlefield, ShotInterface {}
	mix( ShotBattlefield, ShotMixin );

	let battlefield: ShotBattlefield;

	beforeEach( () => {
		battlefield = new ShotBattlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	afterEach( () => {
		battlefield.destroy();
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.shot ).to.be.a( 'function' );
	} );

	describe( 'shot', () => {
		it( 'should mark field as missed and return data when field is empty', () => {
			const result = battlefield.shot( new Position( 1, 1 ) );
			const position = new Position( 1, 1 );

			expect( battlefield.getField( position ).isMissed ).to.true;
			expect( battlefield.getField( position ).isHit ).to.false;
			expect( result ).to.deep.equal( { type: 'missed', position } );
		} );

		it( 'should mark field as hit and return data when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );
			const position = new Position( 1, 1 );

			battlefield.moveShip( ship, position );

			const result = battlefield.shot( position );

			expect( battlefield.getField( position ).isMissed ).to.false;
			expect( battlefield.getField( position ).isHit ).to.true;
			expect( result ).to.deep.equal( { type: 'hit', position } );
		} );

		it( 'should return data when field is already set as missed', () => {
			const position = new Position( 1, 1 );

			battlefield.createField( position ).markAsMissed();

			expect( battlefield.shot( position ) ).to.deep.equal( { type: 'missed', position } );
		} );

		it( 'should return data when field is already set as hit', () => {
			const position = new Position( 1, 1 );
			const ship = new Ship( { length: 2, position } );
			const field = battlefield.createField( position );

			field.addShip( ship );
			field.markAsHit();

			expect( battlefield.shot( position ) ).to.deep.equal( { type: 'hit', position } );
		} );

		it( 'should set damage to ship when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 1 ) );

			battlefield.shot( new Position( 2, 1 ) );

			expect( ship.hitFields ).to.have.members( [ false, true ] );
		} );

		it( 'should return sunken ship in the result', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, new Position( 1, 1 ) );

			battlefield.shot( new Position( 1, 1 ) );
			const result = battlefield.shot( new Position( 2, 1 ) );

			expect( result ).to.have.property( 'sunkenShip', ship );
		} );
	} );
} );
