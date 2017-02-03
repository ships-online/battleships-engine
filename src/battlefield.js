import Field from './field.js';
import ShipsCollection from './shipscollection.js';
import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';

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

		this.set( 'isLocked', false );

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
	}

	setField( position, type ) {
		if ( type == 'missed' ) {
			this.setMissed( position );
		} else {
			this.setHit( position );
		}
	}

	setMissed( position ) {
		this._getFieldOrCreate( position ).isMissed = true;
		this.fire( 'missed', position );
	}

	setHit( position ) {
		this._getFieldOrCreate( position ).isHit = true;
		this.fire( 'hit', position );
	}

	/**
	 * Gets items from specified field.
	 *
	 * @param {Array<Number>} position Position on the battlefield e.g. [ x, y ].
	 * @returns {Array<game.Item>} List of items.
	 * @returns {null} When field does not exist.
	 */
	getField( position ) {
		return this._fields.get( position.join( 'x' ) );
	}

	_getFieldOrCreate( position ) {
		let field = this.getField( position );

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
			const field = this.getField( pos );

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
		ship.coordinates.forEach( ( pos ) => this._getFieldOrCreate( pos ).addShip( ship ) );

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

	clear() {
		this._fields.clear();

		for ( const ship of this.shipsCollection ) {
			ship.reset();
		}
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
