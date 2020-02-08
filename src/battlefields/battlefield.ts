import Emitter from 'js-utils/src/emitter';
import mix from 'js-utils/src/mix';
import Position from '../position';
import Field from '../field';
import Ship, { ShipConfig } from '../ship';

interface Battlefield extends Emitter {}
export type ShipsSchema = { [ key: string ]: number };

/**
 * Stores information about items placed on the battlefield and provides API to arrange them.
 */
class Battlefield {
	/**
	 * The size of the battlefield.
	 */
	readonly size: number;

	/**
	 * Definition of ships that can be placed on the battlefield.
	 */
	readonly shipsSchema: ShipsSchema;

	/**
	 * Defines when battlefield API is locked for all actions.
	 */
	isLocked = false;

	/**
	 * List of ships on the battlefield.
	 */
	protected _ships: Set<Ship> = new Set();

	/**
	 * List of fields on the battlefield.
	 */
	protected _fields: Map<string, Field> = new Map();

	/**
	 * @param size Size of the battlefield.
	 * @param shipsSchema Defines how many ships of specific length are allowed to be placed on the battlefield.
	 */
	constructor( size: number, shipsSchema: ShipsSchema ) {
		this.size = size;
		this.shipsSchema = shipsSchema;
	}

	/**
	 * Returns battlefield settings.
	 */
	get settings(): object {
		return {
			size: this.size,
			shipsSchema: this.shipsSchema
		};
	}

	/**
	 * Create an empty field.
	 *
	 * @param position
	 */
	createField( position: Position ): Field {
		if ( this.hasField( position ) ) {
			throw new Error( 'Field already exists.' );
		}

		const field = new Field( position );

		this._fields.set( position.toString(), field );

		return field;
	}

	/**
	 * Checks if field is already created.
	 *
	 * @param position
	 */
	hasField( position: Position ): boolean {
		return this._fields.has( position.toString() );
	}

	/**
	 * Returns a field of the given position.
	 *
	 * @param position
	 */
	getField( position: Position ): Field {
		return this._fields.get( position.toString() );
	}

	/**
	 * Removes a field on the given position.
	 *
	 * @param position
	 */
	removeField( position: Position ): void {
		if ( !this.hasField( position ) ) {
			throw new Error( 'Cannot remove not existing field.' );
		}

		this._fields.delete( position.toString() );
	}

	/**
	 * Adds ship to the battlefield.
	 *
	 * @param ship
	 */
	addShip( ship: Ship ): void {
		if ( this._ships.has( ship ) ) {
			throw new Error( 'Ship already added to the battlefield.' );
		}

		this._ships.add( ship );

		if ( ship.position ) {
			this.moveShip( ship, ship.position, ship.isRotated );
		}
	}

	/**
	 * Removes ship from the battlefield.
	 *
	 * @param ship
	 */
	removeShip( ship: Ship ): void {
		if ( !this._ships.has( ship ) ) {
			throw new Error( 'Cannot remove not existing ship.' );
		}

		this._ships.delete( ship );
	}

	/**
	 * Returns all ships on added to the battlefield.
	 */
	getShips(): IterableIterator<Ship> {
		return this._ships.values();
	}

	/**
	 * Places given ship on the given position on the battlefield.
	 * Keeps ship in battlefield bounds.
	 *
	 * @param ship Ship to place.
	 * @param position Target position.
	 * @param isRotated Ship orientation.
	 */
	moveShip( ship: Ship, position: Position, isRotated?: boolean ): void {
		if ( this.isLocked ) {
			return;
		}

		if ( isRotated === undefined ) {
			isRotated = ship.isRotated;
		}

		let { x, y } = position;
		const max = this.size - ship.length;

		if ( isRotated ) {
			y = Math.min( y, max );
		} else {
			x = Math.min( x, max );
		}

		// Update fields according to old coordinates of ship.
		for ( const pos of ship.coordinates ) {
			const field = this.getField( pos );

			if ( field && field.hasShip( ship ) ) {
				if ( field.length == 1 ) {
					this.removeField( pos );
				} else {
					field.removeShip( ship );
				}
			}
		}

		// Update ship data.
		ship.isRotated = isRotated;
		ship.position = new Position( x, y );

		// Update fields according to new coordinates of ship.
		for ( const pos of ship.coordinates ) {
			if ( !this.hasField( pos ) ) {
				this.createField( pos );
			}

			this.getField( pos ).addShip( ship );
		}

		this.fire( 'shipMoved', ship );
	}

	/**
	 * Changes ship orientation.
	 *
	 * @param ship
	 */
	rotateShip( ship: Ship ): void {
		this.moveShip( ship, ship.position, !ship.isRotated );
	}

	/**
	 * Destroys the class instance.
	 */
	destroy(): void {
		this.stopListening();
	}

	/**
	 * Creates a list of Ships based on the give schema.
	 */
	static createShipsFromSchema( schema: ShipsSchema ): Ship[] {
		const ships: Ship[] = [];

		for ( const shipLength of Object.keys( schema ) ) {
			for ( let i = schema[ shipLength ]; i > 0; i-- ) {
				ships.push( new Ship( { length: parseInt( shipLength ) } ) );
			}
		}

		return ships;
	}

	/**
	 * Creates a list of Ships based on the given ships JSON.
	 */
	static createShipsFromJSON( config: ShipConfig[] ): Ship[] {
		return config.map( data => new Ship( data ) );
	}
}

mix( Battlefield, Emitter );

export default Battlefield;
