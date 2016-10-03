/**
 * Manages a list of ship.
 *
 * @memberOf game
 */
export default class ShipsCollection {
	/**
	 * Creates an instance of ShipsCollection class, initialize with a sets of ships.
	 */
	constructor() {
		/**
		 * Collection store.
		 *
		 * @private
		 * @member {Array} game.ShipsCollection#_ships
		 */
		this._ships = [];
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
	 * Adds ship to the collection.
	 *
	 * @param {game.Ship} ship Ship instance.
	 */
	add( ship ) {
		this._ships.push( ship );
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
}
