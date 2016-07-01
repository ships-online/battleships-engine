import Ship from './ship.js';

/**
 * Manages a list of ships.
 *
 * @memberOf game
 */
export default class ShipsCollection {
	/**
	 * Create an instance of ShipsCollection class, initialize with a sets of ships.
	 *
	 * @param {Array<Number>} shipsConfig every array number define a ship with specified length.
	 */
	constructor( shipsConfig ) {
		/**
		 * Store for ship instances.
		 *
		 * @private
		 */
		this._ships = new Map();

		// Initialize collection base on passed shipsConfig.
		shipsConfig.map( ( shipLength ) => this._add( shipLength ) );
	}

	/**
	 * Collection iterator.
	 */
	[ Symbol.iterator ]() {
		return this._ships.values()[ Symbol.iterator ]();
	}

	/**
	 * Get length of the collection.
	 *
	 * @returns {Number}
	 */
	get length() {
		return this._ships.size;
	}

	/**
	 * Return array of ships which has a collision.
	 *
	 * @returns {Array<game.Ship>}
	 */
	getShipsWithCollision() {
		let filtered = [];

		for ( let ship of this ) {
			if ( ship.isCollision ) {
				filtered.push( ship );
			}
		}

		return filtered;
	}

	/**
	 * Create {@link game.Ship} instance and add to the collection. Every new added Ship has id incremented by 1.
	 *
	 * @private
	 * @param {Object} shipLength Ship length.
	 */
	_add( shipLength ) {
		const nextId = this.length;

		this._ships.set( nextId, new Ship( nextId, shipLength ) );
	}

	/**
	 * Get ship instance by id.
	 *
	 * @param {Number} id Ship id.
	 * @returns {Ship}
	 */
	get( id ) {
		return this._ships.get( id );
	}

	/**
	 * Serialize every Ship to JSON format.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		let result = [];

		for ( let ship of this ) {
			result.push( ship.toJSON() );
		}

		return result;
	}
}
