import Position, { PositionJSON } from './position';
import Ship from './ship';

/**
 * Class that represents single field on the battlefield.
 */
export default class Field {
	/**
	 * The position of the field.
	 */
	readonly position: Position;

	/**
	 * Field state.
	 *
	 * Field can have 3 states:
	 * * `true` - field is marked as hit
	 * * `false` - field is marked as missed
	 * * `undefined` - field is not marked yet
	 */
	private _state: boolean | undefined;

	/**
	 * List of all ships that cover this field.
	 */
	private _ships: Set<Ship> = new Set();

	/**
	 * @param position The position on the battlefield.
	 */
	constructor( position: Position | PositionJSON ) {
		if ( position instanceof Position ) {
			this.position = position;
		} else {
			this.position = Position.fromJSON( position );
		}
	}

	/**
	 * Marks field as hit.
	 */
	markAsHit(): void {
		this._state = true;
	}

	/**
	 * Checks if field is marked as hit.
	 */
	get isHit(): boolean {
		return this._state === true;
	}

	/**
	 * Marks field as missed.
	 */
	markAsMissed(): void {
		this._state = false;
	}

	/**
	 * Checks if field is marked as missed.
	 */
	get isMissed(): boolean {
		return this._state === false;
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
	 * Returns a list of all ships that covers this field.
	 */
	getShips(): IterableIterator<Ship> {
		return this._ships.values();
	}

	/**
	 * Returns the first ship on the field.
	 */
	getFirstShip(): Ship {
		return Array.from( this.getShips() )[ 0 ];
	}

	/**
	 * Remove ship from the field.
	 *
	 * @param ship Ship to remove.
	 */
	removeShip( ship: Ship ): void {
		this._ships.delete( ship );
	}
}
