import Position from './position';
import Ship from './ship';

/**
 * Class that represents single field on the battlefield.
 */
export default class Field {
	/**
	 * The status of the field.
	 */
	status: 'hit' | 'missed' | 'unmarked' = 'unmarked';

	/**
	 * The position of the field.
	 */
	readonly position: Position;

	/**
	 * List of all ships that cover this field.
	 */
	private _ships: Set<Ship> = new Set();

	/**
	 * @param position The position on the battlefield.
	 */
	constructor( position: Position ) {
		this.position = position;
	}

	/**
	 * Marks field as hit.
	 */
	markAsHit(): void {
		if ( !this.isUnmarked ) {
			throw new Error( 'Cannot mark already marked field.' );
		}

		this.status = 'hit';
	}

	/**
	 * Marks field as missed.
	 */
	markAsMissed(): void {
		if ( !this.isUnmarked ) {
			throw new Error( 'Cannot mark already marked field.' );
		}

		this.status = 'missed';
	}

	/**
	 * Checks if field is marked as missed.
	 */
	get isUnmarked(): boolean {
		return this.status === 'unmarked';
	}

	/**
	 * Returns number of ships that covers this field.
	 */
	get length(): number {
		return this._ships.size;
	}

	/**
	 * Adds ship that covers this field.
	 *
	 * @param ship Ship instance.
	 */
	addShip( ship: Ship ): void {
		this._ships.add( ship );
	}

	/**
	 * Checks if a given ship covers this field.
	 *
	 * @param ship The ship to check.
	 */
	hasShip( ship: Ship ): boolean {
		return this._ships.has( ship );
	}

	/**
	 * Remove ship from the field.
	 *
	 * @param ship Ship to remove.
	 */
	removeShip( ship: Ship ): void {
		this._ships.delete( ship );
	}

	/**
	 * Returns a list of all ships that covers this field.
	 */
	getShips(): Ship[] {
		return Array.from( this._ships.values() );
	}

	/**
	 * Returns the first ship on the field.
	 */
	getFirstShip(): Ship {
		return this.getShips().shift();
	}
}
