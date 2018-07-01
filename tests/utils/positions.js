import {
	getPositionAtTheTopLeft,
	getPositionAtTheTop,
	getPositionAtTheTopRight,
	getPositionAtTheRight,
	getPositionAtTheBottomRight,
	getPositionAtTheBottom,
	getPositionAtTheBottomLeft,
	getPositionAtTheLeft,
	getSurroundingPositions,
	getSurroundingHorizontal,
	getSurroundingVertical
} from '../../src/utils/positions';

describe( 'positions', () => {
	describe( 'getPositionAtTheTopLeft()', () => {
		it( 'should return position at the top left of given position', () => {
			expect( getPositionAtTheTopLeft( [ 1, 1 ] ) ).to.deep.equal( [ 0, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheTop()', () => {
		it( 'should return position at the top of given position', () => {
			expect( getPositionAtTheTop( [ 1, 1 ] ) ).to.deep.equal( [ 1, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheTopRight()', () => {
		it( 'should return position at the top right of given position', () => {
			expect( getPositionAtTheTopRight( [ 1, 1 ] ) ).to.deep.equal( [ 2, 0 ] );
		} );
	} );

	describe( 'getPositionAtTheRight()', () => {
		it( 'should return position at the right of given position', () => {
			expect( getPositionAtTheRight( [ 1, 1 ] ) ).to.deep.equal( [ 2, 1 ] );
		} );
	} );

	describe( 'getPositionAtTheBottomRight()', () => {
		it( 'should return position at the bottom right of given position', () => {
			expect( getPositionAtTheBottomRight( [ 1, 1 ] ) ).to.deep.equal( [ 2, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheBottom()', () => {
		it( 'should return position at the bottom of given position', () => {
			expect( getPositionAtTheBottom( [ 1, 1 ] ) ).to.deep.equal( [ 1, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheBottomLeft()', () => {
		it( 'should return position at the bottom left of given position', () => {
			expect( getPositionAtTheBottomLeft( [ 1, 1 ] ) ).to.deep.equal( [ 0, 2 ] );
		} );
	} );

	describe( 'getPositionAtTheLeft()', () => {
		it( 'should return position at the bottom left of given position', () => {
			expect( getPositionAtTheLeft( [ 1, 1 ] ) ).to.deep.equal( [ 0, 1 ] );
		} );
	} );

	describe( 'getSurroundingPositions()', () => {
		it( 'should return surrounding position of given position', () => {
			expect( getSurroundingPositions( [ 1, 1 ] ) ).to.deep.equal( [
				[ 1, 0 ], [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 1, 2 ], [ 0, 2 ], [ 0, 1 ], [ 0, 0 ]
			] );
		} );
	} );

	describe( 'getSurroundingHorizontal()', () => {
		it( 'should return surrounding position in the horizontal axis', () => {
			expect( getSurroundingHorizontal( [ 1, 1 ] ) ).to.deep.equal( [ [ 0, 1 ], [ 2, 1 ] ] );
		} );
	} );

	describe( 'getSurroundingVertical()', () => {
		it( 'should return surrounding position in the vertical axis', () => {
			expect( getSurroundingVertical( [ 1, 1 ] ) ).to.deep.equal( [ [ 1, 0 ], [ 1, 2 ] ] );
		} );
	} );
} );
