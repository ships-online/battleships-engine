import Position from '../position';
import Field from '../field';
import Ship, { ShipJSON } from '../ship';
import { clamp } from 'lodash';
import Observable from 'js-utils/src/observable';
import mix from 'js-utils/src/mix';

interface Battlefield extends Observable {}
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
	protected _ships: Map<string, Ship> = new Map();

	/**
	 * List of fields on the battlefield.
	 */
	protected _fields: Map<string, Field> = new Map();

	/**
	 * @param size Size of the battlefield.
	 * @param shipsSchema Defines how many ships of specific length are allowed to be placed on the battlefield.
	 * @param [initialShips]
	 */
	constructor( size: number, shipsSchema: ShipsSchema, initialShips?: Ship[] ) {
		this.size = size;
		this.shipsSchema = shipsSchema;

		const ships = initialShips || Battlefield.createShipsFromSchema( shipsSchema );

		for ( const ship of ships ) {
			this._addShip( ship );
		}
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
	protected _createField( position: Position ): Field {
		const field = new Field( position );

		this._fields.set( position.toString(), field );

		return field;
	}

	/**
	 * Checks if field is already created.
	 *
	 * @param position
	 */
	protected _hasField( position: Position ): boolean {
		return this._fields.has( position.toString() );
	}

	/**
	 * Returns a field of the given position.
	 *
	 * @param position
	 */
	protected _getField( position: Position ): Field {
		return this._fields.get( position.toString() );
	}

	/**
	 * Removes a field on the given position.
	 *
	 * @param position
	 */
	protected _removeField( position: Position ): void {
		this._fields.delete( position.toString() );
	}

	/**
	 * Marks field of the given position as missed.
	 *
	 * @param position
	 */
	markAsMissed( position: Position ): void {
		if ( !this._hasField( position ) ) {
			this._createField( position );
		}

		this._getField( position ).markAsMissed();
		this.fire( 'missed', position );
	}

	/**
	 * Marks field of the given position as hit.
	 *
	 * @param position
	 */
	markAsHit( position: Position ): void {
		if ( !this._hasField( position ) ) {
			this._createField( position );
		}

		this._getField( position ).markAsHit();
		this.fire( 'hit', position );
	}

	/**
	 * Returns a list of all marked fields in JSON format.
	 */
	getFields(): Field[] {
		return Array.from( this._fields.values() ).filter( field => !field.isUnmarked );
	}

	/**
	 * Adds ship to the battlefield.
	 *
	 * @param ship
	 */
	protected _addShip( ship: Ship ): void {
		if ( this._ships.has( ship.id ) ) {
			throw new Error( 'Ship already added to the battlefield.' );
		}

		this._ships.set( ship.id, ship );

		if ( ship.position ) {
			this.moveShip( ship.id, ship.position, ship.isRotated );
		}
	}

	getShip( shipId: string ): Ship {
		if ( !this._ships.has( shipId ) ) {
			throw new Error( 'There is no ship of given id.' );
		}

		return this._ships.get( shipId );
	}

	/**
	 * Returns a list of all ships added to the battlefield in JSON format.
	 */
	getShips(): Ship[] {
		return Array.from( this._ships.values() );
	}

	/**
	 * Places given ship on the given position on the battlefield.
	 * Keeps ship in battlefield bounds.
	 *
	 * @param shipId Id of ship to place.
	 * @param position Target position.
	 * @param isRotated Ship orientation.
	 */
	moveShip( shipId: string, position: Position, isRotated?: boolean ): void {
		if ( this.isLocked ) {
			return;
		}

		const ship = this.getShip( shipId );

		if ( isRotated === undefined ) {
			isRotated = ship.isRotated;
		}

		let { x, y } = position;

		if ( isRotated ) {
			x = clamp( x, 0, this.size - 1 );
			y = clamp( y, 0, this.size - ship.length );
		} else {
			x = clamp( x, 0, this.size - ship.length );
			y = clamp( y, 0, this.size - 1 );
		}

		// Update fields according to old coordinates of ship.
		for ( const pos of ship.coordinates ) {
			const field = this._getField( pos );

			if ( field && field.hasShip( ship ) ) {
				if ( field.length == 1 ) {
					this._removeField( pos );
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
			if ( !this._hasField( pos ) ) {
				this._createField( pos );
			}

			this._getField( pos ).addShip( ship );
		}

		this.fire( 'shipMoved', ship );
	}

	/**
	 * Changes ship orientation.
	 *
	 * @param shipId
	 */
	rotateShip( shipId: string ): void {
		const { position, isRotated } = this.getShip( shipId );

		this.moveShip( shipId, position, !isRotated );
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
	static createShipsFromJSON( data: ShipJSON[] ): Ship[] {
		return data.map( shipJSON => Ship.fromJSON( shipJSON ) );
	}
}

mix( Battlefield, Observable );

export default Battlefield;
