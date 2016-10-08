import ShipsCollection from '../src/shipscollection.js';
import Ship from '../src/ship.js';

describe( 'ShipsCollection:', () => {
	let shipsCollection, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		shipsCollection = new ShipsCollection();
	} );

	afterEach( () => sandbox.restore() );

	describe( 'constructor()', () => {
		it( 'should create empty shipsCollection', () => {
			expect( shipsCollection ).to.have.property( 'length', 0 );
		} );

		it( 'should create not empty shipsCollection when ships config is provided', () => {
			shipsCollection = new ShipsCollection( { 2: 2 } );

			expect( shipsCollection ).to.have.property( 'length', 2 );
		} );

		it( 'should provide iterator interface', () => {
			shipsCollection.add( new Ship( 1 ) );
			shipsCollection.add( new Ship( 1 ) );

			let count = 0;

			for ( let ship of shipsCollection ) {
				expect( ship ).to.instanceof( Ship );
				count++;
			}

			expect( count ).to.equal( shipsCollection.length );
		} );
	} );

	describe( 'add()', () => {
		it( 'should add new ship to collection', () => {
			expect( shipsCollection ).to.have.property( 'length' ).to.equal( 0 );

			shipsCollection.add( new Ship( 1 ) );

			expect( shipsCollection ).to.have.property( 'length' ).to.be.equal( 1 );
		} );

		it( 'should add new ships to collection', () => {
			expect( shipsCollection ).to.have.property( 'length' ).to.equal( 0 );

			shipsCollection.add( [ new Ship( 1 ), new Ship( 1 ) ] );

			expect( shipsCollection ).to.have.property( 'length' ).to.be.equal( 2 );
		} );
	} );

	describe( 'get()', () => {
		it( 'should return specified ship by id', () => {
			const ship1 = new Ship( 3, 1 );
			const ship2 = new Ship( 3, 2 );
			const ship3 = new Ship( 3, 3 );

			shipsCollection.add( ship1 );
			shipsCollection.add( ship2 );
			shipsCollection.add( ship3 );

			expect( shipsCollection.get( 1 ) ).to.deep.equal( ship1 );
			expect( shipsCollection.get( 2 ) ).to.deep.equal( ship2 );
			expect( shipsCollection.get( 3 ) ).to.deep.equal( ship3 );
		} );
	} );

	describe( 'getWithCollision()', () => {
		it( 'should return array of ships which has a collision', () => {
			const ship1 = new Ship( 1 );
			const ship2 = new Ship( 1 );
			const ship3 = new Ship( 1 );
			const ship4 = new Ship( 1 );

			ship1.isCollision = true;
			ship3.isCollision = true;

			shipsCollection.add( ship1 );
			shipsCollection.add( ship2 );
			shipsCollection.add( ship3 );
			shipsCollection.add( ship4 );

			const result = shipsCollection.getWithCollision();

			expect( result ).to.have.length( 2 );

			expect( result[ 0 ] ).to.deep.equal( ship1 );
			expect( result[ 1 ] ).to.deep.equal( ship3 );
		} );

		it( 'should return empty array if there is no ships with collision', () => {
			expect( shipsCollection.getWithCollision() ).to.have.length( 0 );
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
