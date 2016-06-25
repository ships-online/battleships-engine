import ShipsCollection from '../src/shipscollection.js';
import Ship from '../src/ship.js';

describe( 'ShipsCollection:', () => {
	let shipsCollection, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		shipsCollection = new ShipsCollection( [ 1, 2, 2, 3, 4 ] );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of ShipCollection with store for ships instances', () => {
			expect( shipsCollection ).to.have.property( '_ships' ).to.be.instanceof( Map );
		} );

		it( 'should create the same amount of ship instances as length of passed config', () => {
			expect( shipsCollection ).to.have.property( '_ships' ).to.have.property( 'size' ).to.be.equal( 5 );
		} );

		it( 'should provide iterator interface', () => {
			let count = 0;

			for ( let ship of shipsCollection ) {
				expect( ship[ 0 ] ).to.be.equal( count++ );
				expect( ship[ 1 ] ).to.be.instanceof( Ship );
			}

			expect( count ).to.equal( shipsCollection.length );
		} );
	} );

	describe( 'getter length', () => {
		it( 'should return collection length', () => {
			expect( shipsCollection.length ).to.be.equal( 5 );
		} );
	} );

	describe( 'getter isValid', () => {
		beforeEach( () => {
			for ( let ship of shipsCollection ) {
				ship[ 1 ].isValid = true;
			}
		} );

		it( 'should return true if every item in collection is valid', () => {
			expect( shipsCollection.isValid ).to.be.true;
		} );

		it( 'should return false if at least one item in collection is invalid', () => {
			shipsCollection.get( 2 ).isValid = false;

			expect( shipsCollection.isValid ).to.be.false;
		} );
	} );

	describe( 'get()', () => {
		it( 'should return specified ship by key', () => {
			const result = shipsCollection.get( 1 );

			expect( result ).to.be.instanceof( Ship );
			expect( result ).to.have.property( 'length' ).to.be.equal( 2 );
		} );
	} );

	describe( 'toJSON()', () => {
		beforeEach( () => {
			for ( let ship of shipsCollection ) {
				sandbox.stub( ship[ 1 ], 'toJSON', () => {
					return { foo: 'bar' };
				} );
			}
		} );

		it( 'should return serialized ships collection', () => {
			const result = shipsCollection.toJSON();

			expect( result ).to.have.length( 5 );
			expect( result[ 0 ] ).to.be.deep.equal( { foo: 'bar' } );
			expect( result[ 1 ] ).to.be.deep.equal( { foo: 'bar' } );
			expect( result[ 2 ] ).to.be.deep.equal( { foo: 'bar' } );
			expect( result[ 3 ] ).to.be.deep.equal( { foo: 'bar' } );
			expect( result[ 4 ] ).to.be.deep.equal( { foo: 'bar' } );
		} );
	} );
} );
