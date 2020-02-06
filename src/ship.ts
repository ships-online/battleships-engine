import Position, { PositionJSON } from './position';
import uid from 'js-utils/src/uid';

export type ShipConfig = { id?: string; isRotated?: boolean; position?: Position | PositionJSON; length: number };

/**
 * Single ship implementation.
 */
export default class Ship {
	/**
	 * The id if the ship.
	 */
	id: string;

	/**
	 * The position on the battlefield of the ship head field.
	 */
	position: Position;

	/**
	 * The length of the ship.
	 * In other words it's a number of fields that ship covers on the battlefield.
	 */
	length: number;

	/**
	 * The orientation of the ship (horizontal or vertical).
	 */
	isRotated = false;

	/**
	 * Defines if ship has a collision with other ship on the battlefield.
	 */
	hasCollision = false;

	/**
	 * Stores information about which field of ship has been hit.
	 *
	 * 		[ false, false, false ] // Ship has length 3 and has not been hit.
	 * 		[ false, true, false ] // Ship has length 3 and middle field has been hit.
	 * 		[ true, true, true ] // Ship has length 3 and is destroyed (all fields has been hit).
	 */
	hitFields: boolean[];

	constructor( { id = uid(), isRotated = false, position, length }: ShipConfig ) {
		this.id = id;
		this.length = length;
		this.isRotated = isRotated;
		this.hitFields = createFalsyArray( length );

		if ( position instanceof Position ) {
			this.position = position;
		} else if ( position ) {
			this.position = Position.fromJSON( position );
		}
	}

	/**
	 * Returns an array with positions of all ship fields.
	 */
	get coordinates(): Position[] {
		if ( !this.position ) {
			return [];
		}

		const positions: Position[] = [ this.position ];
		let lastPosition = this.position;
		let length = this.length;

		while ( --length ) {
			lastPosition = this.isRotated ? lastPosition.getShiftedBottom() : lastPosition.getShiftedRight();
			positions.push( lastPosition );
		}

		return positions;
	}

	/**
	 * Returns a position of the last Ship field.
	 */
	get tail(): Position {
		return this.coordinates.pop();
	}

	/**
	 * Returns `true` when all ship fields are hit.
	 */
	get hasSunk(): boolean {
		return this.hitFields.every( field => field === true );
	}

	/**
	 * Change ship orientation.
	 */
	rotate(): void {
		this.isRotated = !this.isRotated;
	}

	/**
	 * Marks field on a given position as hit.
	 *
	 * @param position
	 */
	hit( position: Position ): void {
		const coordinates = this.coordinates;

		for ( let i = 0; i < this.length; i++ ) {
			if ( position.isEqual( coordinates[ i ] ) ) {
				this.hitFields[ i ] = true;

				return;
			}
		}

		throw new Error( 'Ship has no field on this position.' );
	}

	/**
	 * Reset Ship data to default values.
	 */
	reset(): void {
		this.position = undefined;
		this.isRotated = false;
		this.hasCollision = false;
		this.hitFields = this.hitFields.map( () => false );
	}

	/**
	 * Returns plain object with ship data.
	 */
	toJSON(): ShipConfig {
		return {
			id: this.id,
			isRotated: this.isRotated,
			length: this.length,
			position: this.position.toJSON()
		};
	}
}

function createFalsyArray( length: number ): boolean[] {
	const arr: boolean[] = [];

	while ( length-- ) {
		arr.push( false );
	}

	return arr;
}
