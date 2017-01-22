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
	 */
	constructor() {
		this._items = new Map();
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
		return Array.from( this._items.values(), ship => ship.toJSON() );
	}

	[ Symbol.iterator]() {
		return this._items.values();
	}

	static createShipsFromSchema( schema ) {
		return Object.keys( schema ).reduce( ( result, length ) => {
			let count = schema[ length ];

			while ( count-- ) {
				result.push( new Ship( { length: parseInt( length ) } ) );
			}

			return result;
		}, [] );
	}

	static createShipsFromJSON( config ) {
		return config.map( ( data ) => new Ship( data ) );
	}
}

mix( ShipsCollection, EmitterMixin );
