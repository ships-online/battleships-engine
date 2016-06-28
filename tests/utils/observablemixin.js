import ObservableMixin from '../../src/utils/observablemixin.js';
import EmitterMixin from '../../src/utils/observablemixin.js';
import mix from '../../src/utils/mix.js';

describe( 'utils', () => {
	describe( 'ObservableMixin', () => {
		it( 'mixes in EmitterMixin', () => {
			expect( ObservableMixin ).to.have.property( 'on', EmitterMixin.on );
			expect( ObservableMixin ).to.have.property( 'off', EmitterMixin.off );
			expect( ObservableMixin ).to.have.property( 'emit', EmitterMixin.emit );
		} );

		it( 'implements set method', () => {
			expect( ObservableMixin ).to.contain.keys( 'set' );
		} );

		describe( 'set', () => {
			class Observable {
				constructor( attrs ) {
					if ( attrs ) {
						this.set( attrs );
					}
				}
			}

			mix( Observable, ObservableMixin );

			let Car, car;

			beforeEach( () => {
				Car = class extends Observable {
				};

				car = new Car( {
					color: 'red',
					year: 2015
				} );
			} );

			it( 'should work when passing an object', () => {
				car.set( {
					color: 'blue',	// Override
					wheels: 4,
					seats: 5
				} );

				expect( car ).to.deep.equal( {
					color: 'blue',
					year: 2015,
					wheels: 4,
					seats: 5
				} );
			} );

			it( 'should work when passing a key/value pair', () => {
				car.set( 'color', 'blue' );
				car.set( 'wheels', 4 );

				expect( car ).to.deep.equal( {
					color: 'blue',
					year: 2015,
					wheels: 4
				} );
			} );

			it( 'should get correctly after set', () => {
				car.color = 'blue';

				expect( car.color ).to.equal( 'blue' );
			} );

			it( 'should fire the "change" event', () => {
				let spyColor = sinon.spy();
				let spyYear = sinon.spy();
				let spyWheels = sinon.spy();

				car.on( 'change:color', spyColor );
				car.on( 'change:year', spyYear );
				car.on( 'change:wheels', spyWheels );

				// Set property in all possible ways.
				car.color = 'blue';
				car.set( { year: 2003 } );
				car.set( 'wheels', 4 );

				// Check number of calls.
				sinon.assert.calledOnce( spyColor );
				sinon.assert.calledOnce( spyYear );
				sinon.assert.calledOnce( spyWheels );

				// Check context.
				sinon.assert.calledOn( spyColor, car );
				sinon.assert.calledOn( spyYear, car );
				sinon.assert.calledOn( spyWheels, car );

				// Check params.
				sinon.assert.calledWithExactly( spyColor, 'color', 'blue', 'red' );
				sinon.assert.calledWithExactly( spyYear, 'year', 2003, 2015 );
				sinon.assert.calledWithExactly( spyWheels, 'wheels', 4, sinon.match.typeOf( 'undefined' ) );
			} );

			it( 'should not fire the "change" event for the same attribute value', () => {
				let spyColor = sinon.spy();

				car.on( 'change:color', spyColor );

				// Set the "color" property in all possible ways.
				car.color = 'red';
				car.set( 'color', 'red' );
				car.set( { color: 'red' } );

				sinon.assert.notCalled( spyColor );
			} );

			it( 'should throw when overriding already existing property', () => {
				car.normalProperty = 1;

				expect( () => {
					car.set( 'normalProperty', 2 );
				} ).to.throw( Error, 'Cannot override an existing property.' );

				expect( car ).to.have.property( 'normalProperty', 1 );
			} );

			it( 'should throw when overriding already existing property (in the prototype)', () => {
				class Car extends Observable {
					method() {
					}
				}

				car = new Car();

				expect( () => {
					car.set( 'method', 2 );
				} ).to.throw( Error, 'Cannot override an existing property.' );

				expect( car.method ).to.be.a( 'function' );
			} );

			it( 'should allow setting attributes with undefined value', () => {
				let spySeats = sinon.spy();

				car.on( 'change:seats', spySeats );
				car.set( 'seats', undefined );

				sinon.assert.calledOnce( spySeats );
				expect( car ).to.contain.keys( 'seats' );
				expect( car.seats ).to.be.undefined;

				car.set( 'seats', 5 );

				sinon.assert.calledTwice( spySeats );
				expect( car ).to.have.property( 'seats', 5 );
			} );
		} );
	} );
} );
