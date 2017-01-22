import Field from './field.js';
import ShipsCollection from './shipscollection.js';
import ObservableMixin from 'battleships-utils/src/observablemixin.js';
import mix from 'battleships-utils/src/mix.js';

/**
 * Stores information about items placed on the battlefield.
 *
 * @memberOf {game}
 */
export default class Battlefield {
	/**
	 * Creates instance of Battlefield class.
	 *
	 * @param {Number} size Size of the battlefield.
	 * @param {Object} [shipsSchema] Defines how many ships of specified length will be on the battlefield.
	 */
	constructor( size, shipsSchema ) {
		/**
		 * Size of the battlefield.
		 *
		 * @type {Number}
		 */
		this.size = size;

		this.shipsSchema = shipsSchema;

		/**
		 * Ships collection.
		 *
		 * @type {game.ShipsCollection}
		 */
		this.shipsCollection = new ShipsCollection();

		this.shipsCollection.on( 'add', ( evt, ship ) => {
			if ( ship.hasPosition() ) {
				this.moveShip( ship, ship.position, ship.isRotated );
			}
		} );

		/**
		 * Information about items placed on the battlefield.
		 *
		 * @protected
		 * @type {Map}
		 */
		this._fields = new Map();

		this.isLocked = false;
	}

	set( position, type ) {
		if ( type == 'missed' ) {
			this.setMissed( position );
		} else {
			this.setHit( position );
		}
	}

	setMissed( position ) {
		this._getOrCreate( position ).isMissed = true;
		this.fire( 'missed', position );
	}

	setHit( position ) {
		this._getOrCreate( position ).isHit = true;
		this.fire( 'hit', position );
	}

	/**
	 * Gets items from specified field.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @returns {Array<game.Item>} List of items.
	 * @returns {null} When field does not exist.
	 */
	get( position ) {
		return this._fields.get( position.join( 'x' ) );
	}

	_getOrCreate( position ) {
		let field = this.get( position );

		if ( !field ) {
			field = new Field( position );
			this._fields.set( field.id, field );
		}

		return field;
	}

	moveShip( ship, position, isRotated ) {
		if ( this.isLocked ) {
			return;
		}

		if ( isRotated === undefined ) {
			isRotated = ship.isRotated;
		}

		const max = this.size - ship.length;
		let [ x, y ] = position;

		if ( isRotated ) {
			y = y > max ? max : y;
		} else {
			x = x > max ? max : x;
		}

		// Update position of moved ship on the battlefield.
		ship.coordinates.forEach( ( pos ) => {
			const field = this.get( pos );

			if ( field && field.getShip( ship.id ) ) {
				if ( field.length == 1 ) {
					this._fields.delete( pos.join( 'x' ) );
				} else {
					field.removeShip( ship.id );
				}
			}
		} );

		ship.isRotated = isRotated;
		ship.position = [ x, y ];
		ship.coordinates.forEach( ( pos ) => this._getOrCreate( pos ).addShip( ship ) );

		this.fire( 'shipMoved', ship );
	}

	rotateShip( ship ) {
		this.moveShip( ship, ship.position, !ship.isRotated );
	}

	isShipInBound( ship ) {
		return ship.position[ 0 ] >= 0 && ship.tail[ 0 ] < this.size &&
			ship.position[ 1 ] >= 0 && ship.tail[ 1 ] < this.size;
	}

	validateShips( ships ) {
		return ships.every( ( ship ) => {
			return !ship.isCollision && this.isShipInBound( ship );
		} );
	}

	[ Symbol.iterator ]() {
		return this._fields.values();
	}

	static createWithShips( size, shipsSchema ) {
		const battlefield = new this( size, shipsSchema );

		battlefield.shipsCollection.add( ShipsCollection.createShipsFromSchema( shipsSchema ) );

		return battlefield;
	}
}

mix( Battlefield, ObservableMixin );
