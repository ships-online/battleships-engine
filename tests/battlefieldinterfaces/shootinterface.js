import Battlefield from 'src/battlefield.js';
import shootInterface from 'src/battlefieldinterfaces/shootinterface.js';
import Ship from 'src/ship.js';
import mix from 'battleships-utils/src/mix.js';

describe( 'Battlefield shoot interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, shootInterface );

		battlefield = new Battlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.shoot ).to.function;
	} );

	describe( 'shoot', () => {
		it( 'should mark field as missed when field is empty', () => {
			battlefield.shoot( [ 1, 1 ] );

			expect( battlefield.get( [ 1, 1 ] ).isMissed ).to.true;
			expect( battlefield.get( [ 1, 1 ] ).isHit ).to.false;
		} );

		it( 'should mark field as hit when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			battlefield.shoot( [ 1, 1 ] );

			expect( battlefield.get( [ 1, 1 ] ).isMissed ).to.false;
			expect( battlefield.get( [ 1, 1 ] ).isHit ).to.true;
		} );

		it( 'should set damage to field as hit when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			battlefield.shoot( [ 2, 1 ] );

			expect( ship.damages ).to.have.members( [ false, true ] );
		} );

		it( 'should set fire `shipSunk` event when ship is destroyed', () => {
			const ship = new Ship( { length: 2 } );
			const spy = sinon.spy();

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.on( 'shipSunk', spy );

			battlefield.shoot( [ 1, 1 ] );
			battlefield.shoot( [ 2, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.equal( ship );
		} );
	} );
} );
