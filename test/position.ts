import Position from '../src/position';
import { expect } from 'chai';

describe( 'Position', () => {
	let position: Position;

	beforeEach( () => {
		position = new Position( 1, 1 );
	} );

	describe( 'constructor()', () => {
		it( 'should create a position instance', () => {
			expect( position ).to.have.property( 'x', 1 );
			expect( position ).to.have.property( 'y', 1 );
		} );
	} );

	describe( 'toString()', () => {
		it( 'should serialize position to string format', () => {
			expect( position.toString() ).to.equal( '1x1' );
		} );
	} );

	describe( 'toJSON()', () => {
		it( 'should serialize position to JSON format', () => {
			expect( position.toJSON() ).to.deep.equal( [ 1, 1 ] );
		} );
	} );

	describe( 'fromJSON()', () => {
		it( 'should create position instance based on JSON data', () => {
			const position = Position.fromJSON( [ 1, 2 ] );

			expect( position ).to.instanceof( Position );
			expect( position ).to.have.property( 'x', 1 );
			expect( position ).to.have.property( 'y', 2 );
		} );
	} );

	describe( 'isEqual()', () => {
		it( 'should return true when positions are the same', () => {
			const positionA = new Position( 1, 2 );
			const positionB = new Position( 1, 2 );

			expect( positionA.isEqual( positionB ) ).to.true;
			expect( positionA.isEqual( positionA ) ).to.true;
		} );

		it( 'should return false when positions are not the same', () => {
			const positionA = new Position( 1, 2 );
			const positionB = new Position( 1, 3 );

			expect( positionA.isEqual( positionB ) ).to.false;
		} );
	} );

	describe( 'getShiftedTop()', () => {
		it( 'should return position at the top side of the given position', () => {
			expect( position.getShiftedTop().toString() ).to.equal( '1x0' );
		} );
	} );

	describe( 'getShiftedTopRight()', () => {
		it( 'should return position at the top right side of the given position', () => {
			expect( position.getShiftedTopRight().toString() ).to.equal( '2x0' );
		} );
	} );

	describe( 'getShiftedRight()', () => {
		it( 'should return position at the right side of the given position', () => {
			expect( position.getShiftedRight().toString() ).to.equal( '2x1' );
		} );
	} );

	describe( 'getShiftedBottomRight()', () => {
		it( 'should return position at the bottom right side of the given position', () => {
			expect( position.getShiftedBottomRight().toString() ).to.equal( '2x2' );
		} );
	} );

	describe( 'getShiftedBottom()', () => {
		it( 'should return position at the bottom side of the given position', () => {
			expect( position.getShiftedBottom().toString() ).to.equal( '1x2' );
		} );
	} );

	describe( 'getShiftedBottomLeft()', () => {
		it( 'should return position at the bottom left side of the given position', () => {
			expect( position.getShiftedBottomLeft().toString() ).to.equal( '0x2' );
		} );
	} );

	describe( 'getShiftedLeft()', () => {
		it( 'should return position at the left side of the given position', () => {
			expect( position.getShiftedLeft().toString() ).to.equal( '0x1' );
		} );
	} );

	describe( 'getShiftedTopLeft()', () => {
		it( 'should return position at the top left side of the given position', () => {
			expect( position.getShiftedTopLeft().toString() ).to.equal( '0x0' );
		} );
	} );

	describe( 'getSurroundingPositions()', () => {
		it( 'should return position around the given position', () => {
			expect( position.getSurroundingPositions().map( pos => pos.toString() ) ).to.have.members( [
				'1x0', '2x0', '2x1', '2x2', '1x2', '0x2', '0x1', '0x0'
			] );
		} );
	} );
} );
