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

	isEqual( position: Position ): boolean {
		return this.x === position.x && this.y === position.y;
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
}
