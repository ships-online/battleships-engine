import Field from './field.js';
import ShipsCollection from './shipscollection.js';
import EmitterMixin from 'lib/utils/emittermixin.js';
import mix from 'lib/utils/mix.js';
import { getSurroundingPositions } from 'lib/utils/positions.js';

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
	 * @param {Object} [shipsConfig] Defines how many ships of specified length will be on the battlefield.
	 */
	constructor( size, shipsConfig ) {
		/**
		 * Size of the battlefield.
		 *
		 * @type {Number}
		 */
		this.size = size;

		/**
		 * Ships collection.
		 *
		 * @type {game.ShipsCollection}
		 */
		this.shipsCollection = new ShipsCollection( shipsConfig );

		/**
		 * Information about items placed on the battlefield.
		 *
		 * @private
		 * @type {Map}
		 */
		this._fields = new Map();
	}

	_get( position ) {
		let field = this.get( position );

		if ( !field ) {
			field = new Field( position );
			this._fields.set( field.id, field );
		}

		return field;
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

	setShip( position, ship ) {
		this._get( position ).addShip( ship );
	}

	setMissed( position ) {
		this._get( position ).isMissed = true;
		this.fire( 'missed', position );
	}

	setHit( position ) {
		this._get( position ).isHit = true;
		this.fire( 'hit', position );
	}

	moveShip( ship, position, isRotated ) {
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

			if ( field.length == 1 ) {
				this._fields.delete( pos.join( 'x' ) );
			} else {
				field.removeShip( ship.id );
			}
		} );

		ship.isRotated = isRotated;
		ship.position = [ x, y ];

		ship.coordinates.forEach( ( pos ) => this.setShip( pos, ship ) );

		this._checkShipCollision( ship );

		for ( const ship of this.shipsCollection ) {
			if ( ship.isCollision ) {
				this._checkShipCollision( ship );
			}
		}
	}

	rotateShip( ship ) {
		this.moveShip( ship, ship.position, !ship.isRotated );
	}

	/**
	 * Check if ship has a collision with other ships. For each ship which has a collision set
	 * {@link game.Ship#isCollision} as `true`. If ship has no collision set {@link game.Ship#isCollision} as `false`.
	 *
	 * @protected
	 * @param {game.Ship} ship Ship instance.
	 * @returns {Boolean} if ship has collision return `true` otherwise return `false`.
	 */
	_checkShipCollision( ship ) {
		let isCollision = false;

		for ( const position of ship.coordinates ) {
			let field = this.get( position );

			// If there is more than one ship on this position then there is a collision.
			// Mark each ship on this field as collision.
			isCollision = checkShipCollisionOnField( ship, field ) || isCollision;

			// If surrounding fields contain other ship then mark each ship on this fields as collision.
			for ( const surroundingPosition of getSurroundingPositions( position ) ) {
				field = this.get( surroundingPosition );

				if ( field ) {
					isCollision = checkShipCollisionOnField( ship, field ) || isCollision;
				}
			}
		}

		ship.isCollision = isCollision;

		return isCollision;
	}
}

mix( Battlefield, EmitterMixin );

/**
 * Check if ship has collision with other ships at the same field.
 *
 * @private
 * @param {game.Ship} ship Ship instance.
 * @param {Array<{game.Item}>|null} field
 * @returns {boolean}
 */
function checkShipCollisionOnField( ship, field ) {
	let isCollision = false;

	for ( const item of field ) {
		if ( item !== ship ) {
			item.isCollision = isCollision = true;
		}
	}

	return isCollision;
}
