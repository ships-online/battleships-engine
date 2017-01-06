import Ship from './ship.js';
import Collection from 'lib/utils/collection.js';

/**
 * Manages a list of ship.
 *
 * @memberOf game
 */
export default class ShipsCollection extends Collection {
	/**
	 * Creates an instance of ShipsCollection class, initialize with a sets of ships.
	 *
	 * @param {Object} [shipsConfig] Initial ships configuration.
	 */
	constructor( shipsConfig ) {
		super();

		if ( shipsConfig ) {
			if ( Array.isArray( shipsConfig ) ) {
				this.add( ShipsCollection.getShipsFromJSON( shipsConfig ) );
			} else {
				this.add( ShipsCollection.getShipsFromConfig( shipsConfig ) );
			}
		}
	}

	/**
	 * Adds ships to the collection.
	 *
	 * @param {game.Ship|Array<game.Ship>} ship Ship instance ore list of ship instances.
	 */
	add( ship ) {
		if ( Array.isArray( ship ) ) {
			ship.forEach( ( shipItem ) => super.add( shipItem ) );
		} else {
			super.add( ship );
		}
	}

	getReversed() {
		return Array.from( this._items ).reverse();
	}

	/**
	 * Serializes every Ship in collection.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		return this.map( ( ship ) => ship.toJSON() );
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
				result.push( new Ship( { length: parseInt( length ) } ) );
			}

			return result;
		}, [] );
	}

	static getShipsFromJSON( config ) {
		return config.map( ( data ) => new Ship( data ) );
	}
}
