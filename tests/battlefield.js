import Battlefield from '../src/battlefield.js';
import Ship from '../src/ship.js';

describe( 'Battlefield:', () => {
	let battlefield, sandbox;

	beforeEach( () => {
		sandbox = sinon.sandbox.create();
		battlefield = new Battlefield( 10 );
	} );

	afterEach( () => {
		sandbox.restore();
	} );

	describe( 'constructor()', () => {
		it( 'should create an instance of Battlefield with some properties', () => {
			expect( battlefield ).to.have.property( 'size', 10 );
		} );
	} );

	describe( 'setToField()', () => {
		it( 'should set any item to the field on the battlefield', () => {
			const item1 = { id: 1 };
			const item2 = { id: 2 };

			battlefield.setToField( [ 0, 0 ], item1 );
			battlefield.setToField( [ 1, 1 ], item2 );
			battlefield.setToField( [ 2, 2 ], item1 );
			battlefield.setToField( [ 2, 2 ], item2 );

			const result00 = battlefield._fields.get( '0x0' );
			const result11 = battlefield._fields.get( '1x1' );
			const result22 = battlefield._fields.get( '2x2' );

			expect( result00 ).to.deep.equal( [ item1 ] );
			expect( result11 ).to.deep.equal( [ item2 ] );
			expect( result22 ).to.deep.equal( [ item1, item2 ] );
		} );
	} );

	describe( 'getField()', () => {
		it( 'should get items on existing field', () => {
			const item1 = { id: 1 };
			const item2 = { id: 2 };

			battlefield._fields.set( '5x3', [ item1, item2 ] );

			const result = battlefield.getField( [ 5, 3 ] );

			expect( result ).to.deep.equal( [ item1, item2 ] );
		} );

		it( 'should return null when field does not exist', () => {
			expect( battlefield.getField( [ 1, 1 ] ) ).to.be.null;
		} );
	} );

	describe( 'deleteFromField()', () => {
		it( 'should remove specified item from specified field', () => {
			const item1 = { id: 1 };
			const item2 = { id: 2 };
			const item3 = { id: 3 };

			battlefield._fields.set( '5x3', [ item1, item2, item3 ] );

			battlefield.removeFromField( [ 5, 3 ], item2 );

			const result = battlefield._fields.get( '5x3' );

			expect( result ).to.deep.equal( [ item1, item3 ] );
		} );

		it( 'should remove whole field if there was only one item on field', () => {
			const item = { id: 1 };

			battlefield._fields.set( '5x3', [ item ] );

			battlefield.removeFromField( [ 5, 3 ], item );

			expect( battlefield._fields.get( '5x3' ) ).to.be.undefined;
		} );
	} );

	describe( 'updateShipPosition()', () => {
		it( 'should put ship on the empty battlefield', () => {
			const ship = new Ship( 1, 3 );

			battlefield.updateShipPosition( ship, [ 2, 2 ] );

			expect( battlefield._fields.size ).to.equal( 3 );

			expect( battlefield._fields.get( '2x2' ) ).to.deep.equal( [ ship ] );
			expect( battlefield._fields.get( '3x2' ) ).to.deep.equal( [ ship ] );
			expect( battlefield._fields.get( '4x2' ) ).to.deep.equal( [ ship ] );
		} );

		it( 'should move ship on the battlefield when ship is the only ship on the battlefield', () => {
			const ship = new Ship( 1, 3 );

			// Put ship on the empty battlefield.
			battlefield.updateShipPosition( ship, [ 2, 2 ] );

			// Move ship.
			battlefield.updateShipPosition( ship, [ 5, 2 ] );

			expect( battlefield._fields.size ).to.equal( 3 );

			expect( battlefield._fields.get( '2x2' ) ).to.be.undefined;
			expect( battlefield._fields.get( '3x2' ) ).to.be.undefined;
			expect( battlefield._fields.get( '4x2' ) ).to.be.undefined;

			expect( battlefield._fields.get( '5x2' ) ).to.deep.equal( [ ship ] );
			expect( battlefield._fields.get( '6x2' ) ).to.deep.equal( [ ship ] );
			expect( battlefield._fields.get( '7x2' ) ).to.deep.equal( [ ship ] );
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

	describe( 'checkCollision()', () => {
		it( 'should return false when there is only one ship on the battlefield', () => {
			const ship = new Ship( 1, 1 );

			battlefield.updateShipPosition( ship, [ 5, 5 ] );

			expect( battlefield.checkCollision( ship ) ).to.be.false;
			expect( ship.isCollision ).to.be.false;
		} );

		it( 'should return true when two ships are on the same field', () => {
			const ship1 = new Ship( 1, 1 );
			const ship2 = new Ship( 1, 1 );

			battlefield.updateShipPosition( ship1, [ 5, 5 ] );
			battlefield.updateShipPosition( ship2, [ 5, 5 ] );

			expect( battlefield.checkCollision( ship1 ) ).to.be.true;
			expect( ship1.isCollision ).to.be.true;
			expect( ship2.isCollision ).to.be.true;
		} );

		describe( 'there is one field of space between two ships', () => {
			let ship1, ship2;

			beforeEach( () => {
				ship1 = new Ship( 1, 1 );
				ship2 = new Ship( 1, 1 );

				battlefield.updateShipPosition( ship1, [ 5, 5 ] );
			} );

			it( 'should return false if one ship is at the top of other', () => {
				battlefield.updateShipPosition( ship2, [ 5, 3 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.false;
				expect( ship1.isCollision ).to.be.false;
				expect( ship2.isCollision ).to.be.false;
			} );

			it( 'should return false if one ship is at the right of other', () => {
				battlefield.updateShipPosition( ship2, [ 7, 5 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.false;
				expect( ship1.isCollision ).to.be.false;
				expect( ship2.isCollision ).to.be.false;
			} );

			it( 'should return false if one ship is at the bottom of other', () => {
				battlefield.updateShipPosition( ship2, [ 5, 7 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.false;
				expect( ship1.isCollision ).to.be.false;
				expect( ship2.isCollision ).to.be.false;
			} );

			it( 'should return false if one ship is at the left of other', () => {
				battlefield.updateShipPosition( ship2, [ 3, 5 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.false;
				expect( ship1.isCollision ).to.be.false;
				expect( ship2.isCollision ).to.be.false;
			} );
		} );

		describe( 'there is no field of space between two ships', () => {
			let ship1, ship2;

			beforeEach( () => {
				ship1 = new Ship( 1, 1 );
				ship2 = new Ship( 1, 1 );

				battlefield.updateShipPosition( ship1, [ 5, 5 ] );
			} );

			it( 'should return true if one ship is at the top of other', () => {
				battlefield.updateShipPosition( ship2, [ 5, 4 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.true;
				expect( ship1.isCollision ).to.be.true;
				expect( ship2.isCollision ).to.be.true;
			} );

			it( 'should return true if one ship is at the right of other', () => {
				battlefield.updateShipPosition( ship2, [ 6, 5 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.true;
				expect( ship1.isCollision ).to.be.true;
				expect( ship2.isCollision ).to.be.true;
			} );

			it( 'should return true if one ship is at the bottom of other', () => {
				battlefield.updateShipPosition( ship2, [ 5, 6 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.true;
				expect( ship1.isCollision ).to.be.true;
				expect( ship2.isCollision ).to.be.true;
			} );

			it( 'should return true if one ship is at the left of other', () => {
				battlefield.updateShipPosition( ship2, [ 4, 5 ] );

				expect( battlefield.checkCollision( ship1 ) ).to.be.true;
				expect( ship1.isCollision ).to.be.true;
				expect( ship2.isCollision ).to.be.true;
			} );
		} );
	} );
} );
