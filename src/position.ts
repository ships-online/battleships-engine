export default class Position {
	readonly x: number;
	readonly y: number;

	constructor( x: number, y: number ) {
		this.x = x;
		this.y = y;
	}

	toString(): string {
		return this.x + 'x' + this.y;
	}

	toJSON(): [ number, number ] {
		return [ this.x, this.y ];
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
