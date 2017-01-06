import Field from 'src/field.js';

describe( 'Field', () => {
	let field;

	beforeEach( () => {
		field = new Field( [ 1, 1 ] );
	} );

	it( 'should create instance with id', () => {
		expect( field.id ).to.equal( '1x1' );
	} );

	describe( 'isHit', () => {
		it( 'should set and get hit state', () => {
			expect( field.isHit ).to.false;

			field.isHit = true;

			expect( field.isHit ).to.true;
		} );
	} );

	describe( 'isMissed', () => {
		it( 'should set and get missed state', () => {
			expect( field.isMissed ).to.false;

			field.isMissed = true;

			expect( field.isMissed ).to.true;
		} );
	} );

	describe( 'length', () => {
		it( 'should return number of ships in field', () => {
			expect( field.length ).to.equal( 0 );

			field.addShip( { id: 's1' } );
			field.addShip( { id: 's2' } );

			expect( field.length ).to.equal( 2 );
		} );
	} );

	describe( 'addShip() / getShip()', () => {
		it( 'should add and get ship to the field', () => {
			const ship = { id: 's1' };

			field.addShip( ship );

			expect( field.getShip( 's1' ) ).to.equal( ship );
		} );
	} );

	describe( 'getFirstShip()', () => {
		it( 'should get first ship', () => {
			field.addShip( { id: 's1' } );
			field.addShip( { id: 's2' } );

			expect( field.getFirstShip() ).to.have.property( 'id', 's1' );
		} );
	} );

	describe( 'removeShip()', () => {
		it( 'should remove ship of given id', () => {
			field.addShip( { id: 's1' } );
			field.addShip( { id: 's2' } );

			field.removeShip( 's1' );

			expect( field.getShip( 's1' ) ).to.not.ok;
		} );
	} );

	describe( 'iterator', () => {
		it( 'should iterate over ships', () => {
			field.addShip( { id: 's1' } );
			field.addShip( { id: 's2' } );

			let index = 0;

			for ( const ship of field ) {
				expect( ship ).to.have.property( 'id', `s${ ++index }` );
			}

			expect( index ).to.equal( 2 );
		} );
	} );
} );
