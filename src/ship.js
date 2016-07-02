import mix from './utils/mix.js';
import ObservableMixin from './utils/observablemixin.js';

/**
 * Ship model.
 *
 * @memberOf game
 */
class Ship {
	/**
	 * Create instance of Ship model.
	 *
	 * @param {Number} id Ship id.
	 * @param {Number} length Ship size.
	 */
	constructor( id, length ) {
		/**
		 * Ship id.
		 *
		 * @readonly
		 * @member {Number} Ship#id
		 */
		this.id = id;

		/**
		 * Position of the first ship field on the battlefield. E.g. [ 1, 1 ].
		 *
		 * @observable
		 * @member {Array} game.Ship#position
		 */
		this.set( 'position', [ null, null ] );

		/**
		 * Ship orientation.
		 *
		 * @observable
		 * @readonly
		 * @member {'horizontal'|'vertical'} game.Ship#orientation
		 */
		this.set( 'orientation', 'horizontal' );

		/**
		 * Flag defines if ship placement on the battlefield is valid or invalid (ship has a collision with other ship
		 * or stick out of the battlefield bounds).
		 *
		 * @observable
		 * @member {Boolean} game.Ship#isCollision
		 */
		this.set( 'isCollision', false );

		/**
		 * Store information with field of ship is damaged (hit). Array of damages has the same length as ship length
		 * and at default every item is a falsy value (no damage).
		 *
		 * 		[ false, false, false ] // Ship has length 3 and is no damaged.
		 * 		[ false, true, false ] // Ship has length 3 and middle field is hit.
		 * 		[ true, true, true ] // Ship has length 3 and is destroyed.
		 *
		 * @observable
		 * @member {Array} game.Ship#damages
		 */
		this.set( 'damages', new Array( length ) );
	}

	/**
	 * Get ship length (count of fields).
	 *
	 * @returns {Number}
	 */
	get length() {
		return this.damages.length;
	}

	/**
	 * Return array of coordinates on battlefield.
	 *
	 * @returns {Array<Array>}
	 */
	get coordinates() {
		if ( typeof this.position[ 0 ] != 'number' || typeof this.position[ 1 ] != 'number' ) {
			return [];
		}

		let fields = [ this.position ];

		for ( let i = 1; i <= this.length - 1; i++ ) {
			let nextField = fields[ i - 1 ].concat( [] ); // Copy array

			++nextField[ this.orientation == 'horizontal' ? 0 : 1 ];

			fields.push( nextField );
		}

		return fields;
	}

	/**
	 * Toggle {#orientation} between `vertical` and `horizontal`.
	 */
	rotate() {
		this.orientation = this.orientation == 'horizontal' ? 'vertical' : 'horizontal';
	}

	/**
	 * Serialize ship model to JSON format.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			id: this.id,
			coordinates: this.coordinates
		};
	}
}

mix( Ship, ObservableMixin );

export default Ship;
