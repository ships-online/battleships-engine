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
	 * @param {Array<game.Ship>} shipsConfig
	 */
	constructor( shipsConfig ) {
		/**
		 * @protected
		 * @member {Map} game.ShipsCollection#_ships
		 */
		this._ships = new Map();

		// Initialize collection with passed data.
		shipsConfig.map( ( shipLength ) => this._add( shipLength ) );
	}

	/**
	 * Create {@link game.Ship} instance and add to the collection. Every new added Ship has id incremented by 1.
	 *
	 * @private
	 * @param {Object} shipLength Ship length.
	 */
	_add( shipLength ) {
		this._ships.set( this.length, new Ship( shipLength ) );
	}

	/**
	 * Collection iterator.
	 */
	[ Symbol.iterator ]() {
		return this._ships[ Symbol.iterator ]();
	}

	/**
	 * Get ship instance by key.
	 *
	 * @param {Number} key
	 * @returns {Ship}
	 */
	get( key ) {
		return this._ships.get( key );
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
	 * Check if each ship in collection is valid.
	 * If every ship is valid then return `true` if at least one ship is not valid then return `false`.
	 *
	 * @returns {Boolean}
	 */
	get isValid() {
		for ( let ship of this ) {
			if ( !ship[1].isValid ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Serialize each Ship to JSON format.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		let result = [];

		for ( let ship of this ) {
			result.push( ship[1].toJSON() );
		}

		return result;
	}
}
