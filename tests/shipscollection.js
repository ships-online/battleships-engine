import ShipsCollection from 'src/shipscollection.js';
import Collection from 'lib/utils/collection.js';
import Ship from 'src/ship.js';

describe( 'ShipsCollection:', () => {
	let shipsCollection, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		shipsCollection = new ShipsCollection();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should extend Collection class', () => {
			expect( shipsCollection ).instanceof( Collection )
		} );

		it( 'should create empty shipsCollection', () => {
			expect( shipsCollection ).to.have.property( 'length', 0 );
		} );

		it( 'should create not empty shipsCollection when ships config is provided', () => {
			shipsCollection = new ShipsCollection( { 2: 2 } );

			expect( shipsCollection ).to.have.property( 'length', 2 );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return serialized ships collection', () => {
			const ship1 = new Ship( 3, 1 );
			const ship2 = new Ship( 3, 2 );
			const ship3 = new Ship( 3, 3 );

			sandbox.stub( ship1, 'toJSON' ).returns( { a: 'b' } );
			sandbox.stub( ship2, 'toJSON' ).returns( { c: 'd' } );
			sandbox.stub( ship3, 'toJSON' ).returns( { e: 'f' } );

			shipsCollection.add( ship1 );
			shipsCollection.add( ship2 );
			shipsCollection.add( ship3 );

			const result = shipsCollection.toJSON();

			expect( result ).to.have.length( 3 );
			expect( result[ 0 ] ).to.be.deep.equal( { a: 'b' } );
			expect( result[ 1 ] ).to.be.deep.equal( { c: 'd' } );
			expect( result[ 2 ] ).to.be.deep.equal( { e: 'f' } );
		} );
	} );

	describe( 'getShipsFromConfig()', () => {
		it( 'should create ships of the same length', () => {
			const result = ShipsCollection.getShipsFromConfig( { 2: 2 } );

			expect( result ).to.have.length( 2 );
			expect( result[ 0 ] ).to.have.property( 'length', 2 );
			expect( result[ 1 ] ).to.have.property( 'length', 2 );
		} );

		it( 'should create ships of different length', () => {
			const result = ShipsCollection.getShipsFromConfig( { 4: 1, 2: 2 } );

			expect( result ).to.have.length( 3 );
			expect( result[ 0 ] ).to.have.property( 'length', 2 );
			expect( result[ 1 ] ).to.have.property( 'length', 2 );
			expect( result[ 2 ] ).to.have.property( 'length', 4 );
		} );
	} );
} );
