import EmitterMixin from '../../src/utils/emittermixin.js';

describe( 'EmitterMixin:', () => {
	let emitterInstance;

	beforeEach( () => {
		emitterInstance = Object.create( EmitterMixin );
	} );

	describe( 'on()', () => {
		it( 'should store event with a callback', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();

			emitterInstance.on( expectedEvent, expectedCallback );

			expect( emitterInstance._events[ expectedEvent ] ).to.include( expectedCallback );
		} );

		it( 'should store multiple events with multiple callbacks', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();
			const otherExpectedEvent = 'otherEvent';
			const otherExpectedCallback = sinon.spy();

			emitterInstance.on( expectedEvent, expectedCallback );
			emitterInstance.on( expectedEvent, otherExpectedCallback );
			emitterInstance.on( otherExpectedEvent, expectedCallback );
			emitterInstance.on( otherExpectedEvent, otherExpectedCallback );

			expect( emitterInstance._events[ expectedEvent ] ).to.include.members( [ expectedCallback, otherExpectedCallback ] );
			expect( emitterInstance._events[ otherExpectedEvent ] ).to.include.members( [ expectedCallback, otherExpectedCallback ] );
		} );
	} );

	describe( 'off()', () => {
		it( 'should remove callback from event', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();
			const otherExpectedCallback = sinon.spy();

			emitterInstance._events = {
				[expectedEvent]: [ expectedCallback, otherExpectedCallback ]
			};

			emitterInstance.off( expectedEvent, expectedCallback );

			expect( emitterInstance._events[ expectedEvent ] ).to.include.members( [ otherExpectedCallback ] );
		} );

		it( 'should do nothing if callback is not attached to event', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();
			const fakeCallback = sinon.spy();

			emitterInstance._events = {
				[expectedEvent]: [ expectedCallback ]
			};

			emitterInstance.off( expectedEvent, fakeCallback );

			expect( emitterInstance._events[ expectedEvent ] ).to.include.members( [ expectedCallback ] );
		} );

		it( 'should do nothing if event does not exist', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();
			const fakeEvent = 'fakeEvent';

			emitterInstance._events = {
				[expectedEvent]: [ expectedCallback ]
			};

			emitterInstance.off( fakeEvent, expectedCallback );

			expect( emitterInstance._events[ expectedEvent ] ).to.include.members( [ expectedCallback ] );
		} );
	} );

	describe( 'emit()', () => {
		it( 'should fire all callback attached to event', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();
			const otherExpectedCallback = sinon.spy();
			const unexpectedCallback = sinon.spy();

			emitterInstance._events = {
				[expectedEvent]: [ expectedCallback, otherExpectedCallback ],
				'otherEvent': [ unexpectedCallback ]
			};

			emitterInstance.emit( expectedEvent );

			expect( expectedCallback ).to.be.called;
			expect( otherExpectedCallback ).to.be.called;
			expect( unexpectedCallback ).to.be.not.called;
		} );

		it( 'should pass additional parameters to the callback', () => {
			const expectedEvent = 'someEvent';
			const expectedCallback = sinon.spy();

			emitterInstance._events = {
				[expectedEvent]: [ expectedCallback ]
			};

			emitterInstance.emit( expectedEvent, 'param1', 'param2' );

			sinon.assert.calledWithExactly( expectedCallback, 'param1', 'param2' );
		} );
	} );
} );
