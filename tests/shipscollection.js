import ShipsCollection from 'src/shipscollection.js';
import Ship from 'src/ship.js';

describe( 'ShipsCollection', () => {
	let shipsCollection, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		shipsCollection = new ShipsCollection();
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create empty shipsCollection', () => {
			expect( shipsCollection ).to.have.property( 'length', 0 );
		} );
	} );

	describe( 'add() / get()', () => {
		it( 'should add ship instance to the collection and get it by id', () => {
			const ship = new Ship( { length: 2, id: 1 } );

			shipsCollection.add( ship );

			expect( shipsCollection.length ).to.equal( 1 );
			expect( shipsCollection.get( 1 ) ).to.equal( ship );
		} );

		it( 'should add many ships to the collection and get in by id', () => {
			const ship1 = new Ship( { length: 2, id: 1 } );
			const ship2 = new Ship( { length: 2, id: 2 } );

			shipsCollection.add( [ ship1, ship2 ] );

			expect( shipsCollection.length ).to.equal( 2 );
			expect( shipsCollection.get( 1 ) ).to.equal( ship1 );
			expect( shipsCollection.get( 2 ) ).to.equal( ship2 );
		} );
	} );

	describe( 'getReversed()', () => {
		it( 'should get list of ships in reversed order', () => {
			const ship1 = new Ship( { length: 2, id: 1 } );
			const ship2 = new Ship( { length: 2, id: 2 } );

			shipsCollection.add( [ ship1, ship2 ] );

			const result = shipsCollection.getReversed();

			expect( result[ 0 ] ).to.equal( ship2 );
			expect( result[ 1 ] ).to.equal( ship1 );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return serialized ships collection', () => {
			const ship1 = new Ship( { length: 3, id: 1 } );
			const ship2 = new Ship( { length: 3, id: 2 } );
			const ship3 = new Ship( { length: 3, id: 3 } );

			sandbox.stub( ship1, 'toJSON' ).returns( { a: 'b' } );
			sandbox.stub( ship2, 'toJSON' ).returns( { c: 'd' } );
			sandbox.stub( ship3, 'toJSON' ).returns( { e: 'f' } );

			shipsCollection.add( [ ship1, ship2, ship3 ] );

			const result = shipsCollection.toJSON();

			expect( result ).to.have.length( 3 );
			expect( result[ 0 ] ).to.be.deep.equal( { a: 'b' } );
			expect( result[ 1 ] ).to.be.deep.equal( { c: 'd' } );
			expect( result[ 2 ] ).to.be.deep.equal( { e: 'f' } );
		} );
	} );

	describe( 'iterator', () => {
		it( 'should iterate trough collection', () => {
			const ship1 = new Ship( { length: 3, id: 1 } );
			const ship2 = new Ship( { length: 3, id: 2 } );
			const ship3 = new Ship( { length: 3, id: 3 } );

			let index = 0;
			shipsCollection.add( [ ship1, ship2, ship3 ] );

			for ( const item of shipsCollection ) {
				expect( item ).to.instanceof( Ship );
				index++;
			}

			expect( index ).to.equal( 3 );
		} );
	} );

	describe( 'static createShipsFromSchema()', () => {
		it( 'should create ships based on provided schema', () => {
			const result = ShipsCollection.createShipsFromSchema( { 2: 2, 3: 2 } );

			expect( result ).to.have.length( 4 );
			expect( result[ 0 ] ).to.have.property( 'length', 2 );
			expect( result[ 1 ] ).to.have.property( 'length', 2 );
			expect( result[ 2 ] ).to.have.property( 'length', 3 );
			expect( result[ 3 ] ).to.have.property( 'length', 3 );
		} );
	} );

	describe( 'static createShipsFromJSON()', () => {
		it( 'should create ships based on provided JSON', () => {
			const result = ShipsCollection.createShipsFromJSON( [
				{
					id: '1',
					length: '2',
					rotated: false
				},
				{
					id: '2',
					length: '3',
					rotated: true
				}
			] );

			expect( result ).to.have.length( 2 );
			expect( result[ 0 ] ).to.instanceof( Ship );
			expect( result[ 0 ] ).to.have.property( 'id', '1' );
			expect( result[ 1 ] ).to.instanceof( Ship );
			expect( result[ 1 ] ).to.have.property( 'id', '2' );
		} );
	} );
} );
