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
		ship.coordinates.forEach( ( pos ) => this._get( pos ).addShip( ship ) );

		this.fire( 'shipMoved', ship );
	}

	rotateShip( ship ) {
		this.moveShip( ship, ship.position, !ship.isRotated );
	}

	[ Symbol.iterator ]() {
		return this._fields.values();
	}
}

mix( Battlefield, EmitterMixin );
