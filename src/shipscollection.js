import Ship from './ship.js';
import EmitterMixin from 'battleships-utils/src/emittermixin.js';
import mix from 'battleships-utils/src/mix.js';

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
		this._items = new Map();

		if ( shipsConfig ) {
			if ( Array.isArray( shipsConfig ) ) {
				this.add( ShipsCollection.getShipsFromJSON( shipsConfig ) );
			} else {
				this.add( ShipsCollection.getShipsFromConfig( shipsConfig ) );
			}
		}
	}

	get length() {
		return this._items.size;
	}

	/**
	 * Adds ships to the collection.
	 *
	 * @param {game.Ship|Array<game.Ship>} ship Ship instance ore list of ship instances.
	 */
	add( ship ) {
		if ( Array.isArray( ship ) ) {
			ship.forEach( ( shipItem ) => this.add( shipItem ) );
		} else {
			this._items.set( ship.id, ship );
			this.fire( 'add', ship );
		}
	}

	get( id ) {
		return this._items.get( id );
	}

	getReversed() {
		return Array.from( this._items.values() ).reverse();
	}

	/**
	 * Serializes collection to JSON.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		return Array.from( this._items.values() ).map( ( ship ) => ship.toJSON() );
	}

	[ Symbol.iterator]() {
		return this._items.values();
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

mix( ShipsCollection, EmitterMixin );
