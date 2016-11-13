import Ship from './ship.js';

/**
 * Manages a list of ship.
 *
 * @memberOf game
 */
export default class ShipsCollection {
	/**
	 * Creates an instance of ShipsCollection class, initialize with a sets of ships.
	 *
	 * @param {Object} [shipsConfig] Initial ships configuration.
	 */
	constructor( shipsConfig ) {
		/**
		 * Collection store.
		 *
		 * @private
		 * @member {Array} game.ShipsCollection#_ships
		 */
		this._ships = [];

		if ( shipsConfig ) {
			this.add( ShipsCollection.getShipsFromConfig( shipsConfig ) );
		}
	}

	/**
	 * Collection iterator.
	 */
	[ Symbol.iterator ]() {
		return this._ships[ Symbol.iterator ]();
	}

	/**
	 * Gets length of the collection.
	 *
	 * @returns {Number}
	 */
	get length() {
		return this._ships.length;
	}

	/**
	 * Adds ships to the collection.
	 *
	 * @param {game.Ship|Array<game.Ship>} ships Ship instance ore list of ship instances.
	 */
	add( ship ) {
		if ( Array.isArray( ship ) ) {
			ship.forEach( ( shipItem ) => this.add( shipItem ) );
		} else {
			this._ships.push( ship );
		}
	}

	/**
	 * Gets ship by id.
	 *
	 * @param {game.Ship#id} id Ship id.
	 * @returns {game.Ship|undefined}
	 */
	get( id ) {
		return this._ships.find( ( ship ) => ship.id == id );
	}

	/**
	 * Returns list of ships which has a collision.
	 *
	 * @returns {Array<game.Ship>}
	 */
	getWithCollision() {
		return this._ships.filter( ( item ) => item.isCollision );
	}

	/**
	 * Serializes every Ship in collection.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		return this._ships.map( ( ship ) => ship.toJSON() );
	}

	/**
	 * Creates list of Ships instances based on passed configuration.
	 *
	 * @param {Object} config Ships configuration.
	 * @returns {Array<game.Ship>} List of ship instances.
	 */
	static getShipsFromConfig( config ) {
		return Object.keys( config ).reduce( ( result, length ) => {
			let count = config[ length ];

			while ( count-- ) {
				result.push( new Ship( parseInt( length ) ) );
			}

			return result;
		}, [] );
	}
}
