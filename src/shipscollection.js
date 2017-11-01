import Ship from './ship.js';
import EmitterMixin from '@ckeditor/ckeditor5-utils/src/emittermixin.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';

/**
 * @mixes EmitterMixin.
 */
export default class ShipsCollection {
	constructor() {
		/**
		 * Stores Ships.
		 *
		 * @private
		 * @type {Map<Ship.id, Ship>}
		 */
		this._items = new Map();
	}

	/**
	 * Returns ship length.
	 *
	 * @returns {Number}
	 */
	get length() {
		return this._items.size;
	}

	/**
	 * Adds ships to the collection.
	 *
	 * @param {Ship|Array<Ship>} ship Ship instance ore list of ship instances.
	 */
	add( ship ) {
		if ( Array.isArray( ship ) ) {
			ship.forEach( shipItem => this.add( shipItem ) );
		} else {
			this._items.set( ship.id, ship );
			this.fire( 'add', ship );
		}
	}

	/**
	 * Returns ship of given id.
	 *
	 * @param {String} id Ship id.
	 * @returns {Ship}
	 */
	get( id ) {
		return this._items.get( id );
	}

	/**
	 * Returns reversed array of ships.
	 *
	 * @returns {Array.<Ship>} reversed array of Ships.
	 */
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

	/**
	 * @returns {Iterator.<Ship>}
	 */
	[ Symbol.iterator]() {
		return this._items.values();
	}

	/**
	 * Creates array of Ships based on give schema.
	 *
	 * @static
	 * @param schema
	 * @returns {Array<Ship>}
	 */
	static createShipsFromSchema( schema ) {
		return Object.keys( schema ).reduce( ( result, length ) => {
			let count = schema[ length ];

			while ( count-- ) {
				result.push( new Ship( { length: parseInt( length ) } ) );
			}

			return result;
		}, [] );
	}

	/**
	 * Creates array of Ships based on given ships JSON.
	 *
	 * @static
	 * @param {Object} config
	 * @returns {Array}
	 */
	static createShipsFromJSON( config ) {
		return config.map( data => new Ship( data ) );
	}
}

mix( ShipsCollection, EmitterMixin );
