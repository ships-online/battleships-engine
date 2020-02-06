import Battlefield from '../../src/battlefield.js';
import shotInterface from '../../src/battlefields/interfaces/shotinterface';
import Ship from '../../src/ship';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

describe( 'Battlefield shot interface', () => {
	let battlefield;

	beforeEach( () => {
		mix( Battlefield, shotInterface );

		battlefield = new Battlefield( 10, { 1: 4, 2: 3, 3: 2, 4: 1 } );
	} );

	afterEach( () => {
		battlefield.reset();
	} );

	it( 'should be as class interface', () => {
		expect( battlefield.shot ).to.be.a( 'function' );
	} );

	describe( 'shot', () => {
		it( 'should mark field as missed and return data when field is empty', () => {
			const result = battlefield.shot( [ 1, 1 ] );

			expect( battlefield.getField( [ 1, 1 ] ).isMissed ).to.true;
			expect( battlefield.getField( [ 1, 1 ] ).isHit ).to.false;
			expect( result ).to.deep.equal( {
				type: 'missed',
				position: [ 1, 1 ]
			} );
		} );

		it( 'should mark field as hit and return data when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			const result = battlefield.shot( [ 1, 1 ] );

			expect( battlefield.getField( [ 1, 1 ] ).isMissed ).to.false;
			expect( battlefield.getField( [ 1, 1 ] ).isHit ).to.true;
			expect( result ).to.deep.equal( {
				type: 'hit',
				position: [ 1, 1 ]
			} );
		} );

		it( 'should return data when field is already set as missed', () => {
			battlefield.markAsMissed( [ 1, 1 ] );

			expect( battlefield.shot( [ 1, 1 ] ) ).to.deep.equal( {
				type: 'missed',
				notEmpty: true,
				position: [ 1, 1 ]
			} );
		} );

		it( 'should return data when field is already set as hit', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.markAsHit( [ 1, 1 ], ship );

			expect( battlefield.shot( [ 1, 1 ] ) ).to.deep.equal( {
				type: 'hit',
				notEmpty: true,
				position: [ 1, 1 ]
			} );
		} );

		it( 'should set damage to ship when ship is on the field', () => {
			const ship = new Ship( { length: 2 } );

			battlefield.moveShip( ship, [ 1, 1 ] );

			battlefield.shot( [ 2, 1 ] );

			expect( ship.damages ).to.have.members( [ false, true ] );
		} );

		it( 'should set fire `shipSunk` event when ship is destroyed', () => {
			const ship = new Ship( { length: 2 } );
			const spy = sinon.spy();

			battlefield.moveShip( ship, [ 1, 1 ] );
			battlefield.on( 'shipSunk', spy );

			battlefield.shot( [ 1, 1 ] );
			battlefield.shot( [ 2, 1 ] );

			expect( spy.calledOnce ).to.true;
			expect( spy.firstCall.args[ 1 ] ).to.equal( ship );
		} );
	} );
} );
