import Item from '../src/item.js';

describe( 'Item', () => {
	let item, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		item = new Item( 3, 1 );
	} );

	afterEach( () => sandbox.restore() );

	describe( 'constructor()', () => {
		it( 'should create an instance of Item with some properties', () => {
			expect( item ).to.have.property( 'id' ).to.equal( 1 );
			expect( item ).to.have.property( 'length' ).to.equal( 3 );
			expect( item ).to.have.property( 'orientation' ).to.equal( 'horizontal' );

			expect( item ).to.have.property( 'firstFieldPosition' ).to.instanceof( Array );
			expect( item ).to.have.property( 'firstFieldPosition' ).to.have.length( 2 );
			expect( item.firstFieldPosition[ 0 ] ).to.equal( null );
			expect( item.firstFieldPosition[ 1 ] ).to.equal( null );
		} );

		it( 'should make some properties observable', () => {
			const positionSpy = sandbox.spy();
			const orientationSpy = sandbox.spy();

			item.on( 'change:firstFieldPosition', positionSpy );
			item.on( 'change:orientation', orientationSpy );

			item.firstFieldPosition = [ 1, 1 ];
			item.orientation = 'vertical';

			expect( positionSpy.calledOnce ).to.true;
			expect( orientationSpy.calledOnce ).to.true;
		} );

		it( 'should create id when is not specified', () => {
			expect( new Item( 3 ) ).to.have.property( 'id' ).to.be.number;
		} );
	} );

	describe( 'coordinates', () => {
		it( 'should return array of coordinates on the battlefield when item has `horizontal` orientation', () => {
			item.firstFieldPosition = [ 1, 1 ];

			const result = item.coordinates;

			expect( result ).to.instanceof( Array );
			expect( result ).to.have.length( 3 );

			expect( result[ 0 ] ).to.have.length( 2 );
			expect( result[ 0 ][ 0 ] ).to.equal( 1 );
			expect( result[ 0 ][ 1 ] ).to.equal( 1 );

			expect( result[ 1 ] ).to.have.length( 2 );
			expect( result[ 1 ][ 0 ] ).to.equal( 2 );
			expect( result[ 1 ][ 1 ] ).to.equal( 1 );

			expect( result[ 2 ] ).to.have.length( 2 );
			expect( result[ 2 ][ 0 ] ).to.equal( 3 );
			expect( result[ 2 ][ 1 ] ).to.equal( 1 );
		} );

		it( 'should return array of coordinates on the battlefield when item has `vertical` orientation', () => {
			item.firstFieldPosition = [ 1, 1 ];
			item.rotate();

			const result = item.coordinates;

			expect( result ).to.instanceof( Array );
			expect( result ).to.have.length( 3 );

			expect( result[ 0 ] ).to.have.length( 2 );
			expect( result[ 0 ][ 0 ] ).to.equal( 1 );
			expect( result[ 0 ][ 1 ] ).to.equal( 1 );

			expect( result[ 1 ] ).to.have.length( 2 );
			expect( result[ 1 ][ 0 ] ).to.equal( 1 );
			expect( result[ 1 ][ 1 ] ).to.equal( 2 );

			expect( result[ 2 ] ).to.have.length( 2 );
			expect( result[ 2 ][ 0 ] ).to.equal( 1 );
			expect( result[ 2 ][ 1 ] ).to.equal( 3 );
		} );

		it( 'should return empty array if item is not placed on the battlefield', () => {
			expect( item.coordinates ).to.instanceof( Array );
			expect( item.coordinates ).to.have.length( 0 );
		} );
	} );

	describe( 'rotate()', () => {
		it( 'should toggle orientation between `horizontal` and `vertical`', () => {
			expect( item.orientation ).to.equal( 'horizontal' );

			item.rotate();

			expect( item.orientation ).to.equal( 'vertical' );

			item.rotate();

			expect( item.orientation ).to.equal( 'horizontal' );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should return item in JSON format', () => {
			let result = item.toJSON();

			expect( result ).to.have.property( 'id', 1 );
			expect( result ).to.have.property( 'coordinates' ).to.instanceof( Array );
		} );
	} );
} );
