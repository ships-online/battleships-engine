import {
	getPositionAtTheTopLeftOf,
	getPositionAtTheTopOf,
	getPositionAtTheTopRightOf,
	getPositionAtTheRightOf,
	getPositionAtTheBottomRightOf,
	getPositionAtTheBottomOf,
	getPositionAtTheBottomLeftOf,
	getPositionAtTheLeftOf,
	getSurroundingPositions
} from 'src/utils/positions.js';

describe( 'positions', () => {
	describe( 'getPositionAtTheTopLeftOf', () => {
		it( 'should return position at the top left of given position', () => {
			expect( getPositionAtTheTopLeftOf( [ 1, 1 ] ) ).to.deep.equal( [ 0, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheTopOf', () => {
		it( 'should return position at the top of given position', () => {
			expect( getPositionAtTheTopOf( [ 1, 1 ] ) ).to.deep.equal( [ 1, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheTopRightOf', () => {
		it( 'should return position at the top right of given position', () => {
			expect( getPositionAtTheTopRightOf( [ 1, 1 ] ) ).to.deep.equal( [ 2, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheRightOf', () => {
		it( 'should return position at the right of given position', () => {
			expect( getPositionAtTheRightOf( [ 1, 1 ] ) ).to.deep.equal( [ 2, 1 ] );
		} );
	} );

	describe( 'getPositionAtTheBottomRightOf', () => {
		it( 'should return position at the bottom right of given position', () => {
			expect( getPositionAtTheBottomRightOf( [ 1, 1 ] ) ).to.deep.equal( [ 2, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheBottomOf', () => {
		it( 'should return position at the bottom of given position', () => {
			expect( getPositionAtTheBottomOf( [ 1, 1 ] ) ).to.deep.equal( [ 1, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheBottomLeftOf', () => {
		it( 'should return position at the bottom left of given position', () => {
			expect( getPositionAtTheBottomLeftOf( [ 1, 1 ] ) ).to.deep.equal( [ 0, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheLeftOf', () => {
		it( 'should return position at the bottom left of given position', () => {
			expect( getPositionAtTheLeftOf( [ 1, 1 ] ) ).to.deep.equal( [ 0, 1 ] );
		} );
	} );

	describe( 'getSurroundingPositions', () => {
		it( 'should return surrounding position of given position', () => {
			expect( getSurroundingPositions( [ 1, 1 ] ) ).to.deep.equal( [
				[ 1, 0 ], [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 1, 2 ], [ 0, 2 ], [ 0, 1 ], [ 0, 0 ]
			] );
		} );
	} );
} );
