import Battlefield from '../src/battlefield.js';
import ShipsCollection from '../src/shipscollection.js';
import Item from '../src/item.js';
import Ship from '../src/ship.js';

describe( 'Battlefield:', () => {
	let battlefield, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		battlefield = new Battlefield( 5 );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield with some properties', () => {
			expect( battlefield ).to.have.property( 'size', 5 );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.instanceof( ShipsCollection );
			expect( battlefield ).to.have.property( 'shipsCollection' ).to.have.property( 'length', 10 );
		} );
	} );

	describe( 'set()', () => {
		it( 'should put item into empty field with no error', () => {
			const item = new Item( 1 );

			expect( () => battlefield.set( [ 1, 1 ], item ) ).to.not.throw;
		} );

		it( 'should put item into existing field with no error', () => {
			const item1 = new Item( 1 );
			const item2 = new Item( 1 );

			battlefield.set( [ 1, 1 ], item1 );

			expect( () => battlefield.set( [ 1, 1 ], item2 ) ).to.not.throw;
		} );
	} );

	describe( 'get()', () => {
		it( 'should get item from field where is only one item', () => {
			const item = new Item( 1 );

			battlefield.set( [ 1, 1 ], item );

			const field = battlefield.get( [ 1, 1 ] );

			expect( field ).to.have.length( 1 );
			expect( field ).to.have.members( [ item ] );
		} );

		it( 'should get items from field where is more than one item', () => {
			const item1 = new Item( 1 );
			const item2 = new Item( 1 );

			battlefield.set( [ 1, 1 ], item1 );
			battlefield.set( [ 1, 1 ], item2 );

			const field = battlefield.get( [ 1, 1 ] );

			expect( field ).to.have.length( 2 );
			expect( field ).to.have.members( [ item1, item2 ] );
		} );

		it( 'should retutn `null` when field is empty', () => {
			const field = battlefield.get( [ 1, 1 ] );

			expect( field ).to.null;
		} );
	} );

	describe( 'move()', () => {
		it( 'should put item on the battlefield', () => {
			const item = new Item( 2 );

			battlefield.move( item, [ 1, 1 ] );

			expect( item.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 2, 1 ] ] );

			expect( battlefield.get( [ 1, 1 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 1, 1 ] ) ).to.have.members( [ item ] );

			expect( battlefield.get( [ 2, 1 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 2, 1 ] ) ).to.have.members( [ item ] );
		} );

		it( 'should move item on the battlefield', () => {
			const item = new Item( 2 );

			battlefield.move( item, [ 1, 1 ] );
			battlefield.move( item, [ 2, 2 ] );

			expect( item.coordinates ).to.deep.equal( [ [ 2, 2 ], [ 3, 2 ] ] );

			expect( battlefield.get( [ 1, 1 ] ) ).to.null;
			expect( battlefield.get( [ 2, 1 ] ) ).to.null;

			expect( battlefield.get( [ 2, 2 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 2, 2 ] ) ).to.have.members( [ item ] );

			expect( battlefield.get( [ 3, 2 ] ) ).to.have.length( 1 );
			expect( battlefield.get( [ 3, 2 ] ) ).to.have.members( [ item ] );
		} );

		it( 'should move item when there is more than one item on the same field', () => {
			const item1 = new Item( 2 );
			const item2 = new Item( 2 );

			battlefield.move( item1, [ 1, 1 ] );
			battlefield.move( item2, [ 2, 1 ] );

			battlefield.move( item1, [ 2, 4 ] );

			expect( item1.coordinates ).to.deep.equal( [ [ 2, 4 ], [ 3, 4 ] ] );
		} );

		it( 'should put rotated item on the battlefield', () => {
			const item = new Item( 2 );

			battlefield.move( item, [ 1, 1 ], true );

			expect( item.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated item without moving', () => {
			const item = new Item( 2 );

			battlefield.move( item, [ 1, 1 ] );
			battlefield.move( item, [ 1, 1 ], true );

			expect( item.coordinates ).to.deep.equal( [ [ 1, 1 ], [ 1, 2 ] ] );
		} );

		it( 'should rotated item while moving', () => {
			const item = new Item( 2 );

			battlefield.move( item, [ 1, 1 ] );
			battlefield.move( item, [ 2, 2 ], true );

			expect( item.coordinates ).to.deep.equal( [ [ 2, 2 ], [ 2, 3 ] ] );
		} );
	} );

	describe( 'checkShipCollision()', () => {
		it( 'should return `false` and mark ship as no collision when ship has no contact with other ships #1', () => {
			const ship = new Ship( 1 );

			battlefield.move( ship, [ 1, 1 ] );

			expect( battlefield.checkShipCollision( ship ) ).to.false;
			expect( ship.isCollision ).to.false;
		} );

		it( 'should return `false` and mark ship as no collision when ship has no contact with other ships #2', () => {
			// Ship is surrounded by other ships, but there is one field position of space between them.
			//
			// [2][2][2][2][3]
			// [5]         [3]
			// [5]   [1]   [3]
			// [5]         [3]
			// [5][4][4][4][4]

			const ship1 = new Ship( 1 );
			const ship2 = new Ship( 4 );
			const ship3 = new Ship( 4 );
			const ship4 = new Ship( 4 );
			const ship5 = new Ship( 4 );

			battlefield.move( ship1, [ 2, 2 ] );
			battlefield.move( ship2, [ 0, 0 ] );
			battlefield.move( ship3, [ 4, 0 ], true );
			battlefield.move( ship4, [ 1, 4 ] );
			battlefield.move( ship5, [ 0, 1 ], true );

			expect( battlefield.checkShipCollision( ship1 ) ).to.false;
			expect( ship1.isCollision ).to.false;
			expect( ship2.isCollision ).to.false;
			expect( ship3.isCollision ).to.false;
			expect( ship4.isCollision ).to.false;
			expect( ship5.isCollision ).to.false;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #1', () => {
			// [1,2]
			const ship1 = new Ship( 1 );
			const ship2 = new Ship( 1 );

			battlefield.move( ship1, [ 3, 3 ] );
			battlefield.move( ship2, [ 3, 3 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #2', () => {
			// [ 1 ][1,2][ 2 ]
			const ship1 = new Ship( 2 );
			const ship2 = new Ship( 2 );

			battlefield.move( ship1, [ 0, 0 ] );
			battlefield.move( ship2, [ 1, 0 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when there is more than one ship on the same field #3', () => {
			//      [ 1 ]
			// [ 2 ][1,2]
			const ship1 = new Ship( 2 );
			const ship2 = new Ship( 2 );

			battlefield.move( ship1, [ 1, 0 ], true );
			battlefield.move( ship2, [ 0, 1 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
		} );

		it( 'should return `true` and mark ships as collision when ship stick to other ships', () => {
			// [2][3][4]
			// [5][1][6]
			// [7][8][9]
			const ship1 = new Ship( 1 );
			const ship2 = new Ship( 1 );
			const ship3 = new Ship( 1 );
			const ship4 = new Ship( 1 );
			const ship5 = new Ship( 1 );
			const ship6 = new Ship( 1 );
			const ship7 = new Ship( 1 );
			const ship8 = new Ship( 1 );
			const ship9 = new Ship( 1 );

			battlefield.move( ship1, [ 2, 2 ] );
			battlefield.move( ship2, [ 1, 1 ] );
			battlefield.move( ship3, [ 2, 1 ] );
			battlefield.move( ship4, [ 3, 1 ] );
			battlefield.move( ship5, [ 3, 2 ] );
			battlefield.move( ship6, [ 3, 3 ] );
			battlefield.move( ship7, [ 2, 3 ] );
			battlefield.move( ship8, [ 1, 3 ] );
			battlefield.move( ship9, [ 1, 2 ] );

			expect( battlefield.checkShipCollision( ship1 ) ).to.true;
			expect( ship1.isCollision ).to.true;
			expect( ship2.isCollision ).to.true;
			expect( ship3.isCollision ).to.true;
			expect( ship4.isCollision ).to.true;
			expect( ship5.isCollision ).to.true;
			expect( ship6.isCollision ).to.true;
			expect( ship7.isCollision ).to.true;
			expect( ship8.isCollision ).to.true;
			expect( ship9.isCollision ).to.true;
		} );
	} );

	describe( 'getPositionAtTheTopOf()', () => {
		expect( Battlefield.getPositionAtTheTopOf( [ 5, 5 ] ) ).to.deep.equal( [ 5, 4 ] );
	} );

	describe( 'getPositionAtTheRightOf()', () => {
		expect( Battlefield.getPositionAtTheRightOf( [ 5, 5 ] ) ).to.deep.equal( [ 6, 5 ] );
	} );

	describe( 'getPositionAtTheBottomOf()', () => {
		expect( Battlefield.getPositionAtTheBottomOf( [ 5, 5 ] ) ).to.deep.equal( [ 5, 6 ] );
	} );

	describe( 'getPositionAtTheLeftOf()', () => {
		expect( Battlefield.getPositionAtTheLeftOf( [ 5, 5 ] ) ).to.deep.equal( [ 4, 5 ] );
	} );
} );
