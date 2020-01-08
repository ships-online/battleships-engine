import Ship from './ship.js';
import Collection from '@ckeditor/ckeditor5-utils/src/collection.js';

/**
 * @extends Collection.
 */
export default class ShipsCollection extends Collection {
	/**
	 * Adds ships to the collection.
	 *
	 * @param {Ship|Array.<Ship>} ship Ship instance ore list of ship instances.
	 */
	add( ship ) {
		if ( Array.isArray( ship ) ) {
			ship.forEach( shipItem => super.add( shipItem ) );
		} else {
			super.add( ship );
		}
	}

	/**
	 * Serializes collection to JSON.
	 *
	 * @returns {Array<Object>}
	 */
	toJSON() {
		return Array.from( this, ship => ship.toJSON() );
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
