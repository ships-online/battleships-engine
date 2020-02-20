import { clamp } from 'lodash';

export type PositionJSON = [ number, number ];

/**
 * Class that represents position on the battlefield.
 */
export default class Position {
	/**
	 * X axis position.
	 */
	readonly x: number;

	/**
	 * Y axis position.
	 */
	readonly y: number;

	constructor( x: number, y: number ) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Creates a position instance using given JSON data.
	 *
	 * @param json Serialized position.
	 */
	static fromJSON( json: PositionJSON ): Position {
		return new Position( json[ 0 ], json[ 1 ] );
	}

	/**
	 * Serializes position to JSON format.
	 */
	toJSON(): PositionJSON {
		return [ this.x, this.y ];
	}

	/**
	 * Serializes position to string.
	 */
	toString(): string {
		return this.x + 'x' + this.y;
	}

	/**
	 * Checks if position is equal to given position.
	 *
	 * @param position The position to check.
	 */
	isEqual( position: Position ): boolean {
		return this.x === position.x && this.y === position.y;
	}

	getShiftedBy( position: Position ): Position {
		return new Position( this.x + position.x, this.y + position.y );
	}

	getRelativeTo( position: Position ): Position {
		return new Position( this.x - position.x, this.y - position.y );
	}

	getClamped( lower: number, upper: number ): Position {
		return new Position( clamp( this.x, lower, upper ), clamp( this.y, lower, upper ) );
	}

	getShiftedTop(): Position {
		return new Position( this.x, this.y - 1 );
	}

	getShiftedTopRight(): Position {
		return new Position( this.x + 1, this.y - 1 );
	}

	getShiftedRight(): Position {
		return new Position( this.x + 1, this.y );
	}

	getShiftedBottomRight(): Position {
		return new Position( this.x + 1, this.y + 1 );
	}

	getShiftedBottom(): Position {
		return new Position( this.x, this.y + 1 );
	}

	getShiftedBottomLeft(): Position {
		return new Position( this.x - 1, this.y + 1 );
	}

	getShiftedLeft(): Position {
		return new Position( this.x - 1, this.y );
	}

	getShiftedTopLeft(): Position {
		return new Position( this.x - 1, this.y - 1 );
	}

	getSurroundingPositions(): Position[] {
		return [
			this.getShiftedTop(),
			this.getShiftedTopRight(),
			this.getShiftedRight(),
			this.getShiftedBottomRight(),
			this.getShiftedBottom(),
			this.getShiftedBottomLeft(),
			this.getShiftedLeft(),
			this.getShiftedTopLeft(),
		];
	}
}
