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
				expect( ship ).to.be.instanceof( Ship );
				count++;
			}

			expect( count ).to.equal( shipsCollection.length );
		} );
	} );

	describe( 'getter length', () => {
		it( 'should return collection length', () => {
			expect( shipsCollection.length ).to.be.equal( 5 );
		} );
	} );

	describe( 'get()', () => {
		it( 'should return specified ship by key', () => {
			const result = shipsCollection.get( 1 );

			expect( result ).to.be.instanceof( Ship );
			expect( result ).to.have.property( 'length' ).to.be.equal( 2 );
		} );
	} );

	describe( 'getShipsWithCollision()', () => {
		it( 'should return array of ships witch has a collision', () => {
			const ship1 = shipsCollection.get( 1 );
			const ship2 = shipsCollection.get( 3 );

			ship1.isCollision = true;
			ship2.isCollision = true;

			const result = shipsCollection.getShipsWithCollision();

			expect( result ).to.have.length( 2 );

			expect( result[ 0 ] ).to.deep.equal( ship1 );
			expect( result[ 1 ] ).to.deep.equal( ship2 );
		} );

		it( 'should return empty array if there is no ships with collision', () => {
			expect( shipsCollection.getShipsWithCollision() ).to.have.length( 0 );
		} );
	} );

	describe( 'toJSON()', () => {
		beforeEach( () => {
			for ( let ship of shipsCollection ) {
				sandbox.stub( ship, 'toJSON', () => {
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
