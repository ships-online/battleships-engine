import ObservableMixin from 'battleships-utils/src/observablemixin.js';
import mix from 'battleships-utils/src/mix.js';
import uid from 'battleships-utils/src/uid.js';

/**
 * Ship.
 *
 * @memberOf game
 */
export default class Ship  {
	/**
	 * Create instance of Ship class.
	 */
	constructor( data ) {
		/**
		 * Ship id.
		 *
		 * @readonly
		 * @member {Number} game.Ship#id
		 */
		this.id = data.id || uid();

		/**
		 * Ship length.
		 *
		 * @readonly
		 * @member {Number} game.Ship#length
		 */
		this.length = data.length;

		/**
		 * Ship orientation.
		 *
		 * @observable
		 * @readonly
		 * @member {Boolean} game.Ship#isRotated
		 */
		this.set( 'isRotated', data.isRotated || false );

		/**
		 * Position of the ship first field on the battlefield. E.g. [ 1, 1 ].
		 *
		 * @observable
		 * @member {Array} game.Ship#position
		 */
		this.set( 'position', [ null, null ] );

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
		 * and at default every ship is a falsy value (no damage).
		 *
		 * 		[ false, false, false ] // Ship has length 3 and is no damaged.
		 * 		[ false, true, false ] // Ship has length 3 and middle field is hit.
		 * 		[ true, true, true ] // Ship has length 3 and is destroyed.
		 *
		 * @member {Array} game.Ship#damages
		 */
		this.damages = createFalsyArray( data.length );
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

		const fields = [ this.position ];

		for ( let i = 1; i < this.length; i++ ) {
			// Clone previous field.
			let nextField = fields[ i - 1 ].concat( [] );

			++nextField[ this.isRotated ? 1 : 0 ];

			fields.push( nextField );
		}

		return fields;
	}

	get isSunk() {
		return !this.damages.some( ( field ) => !field );
	}

	/**
	 * Toggle {#isRotated}
	 */
	rotate() {
		this.isRotated = !this.isRotated;
	}

	/**
	 * Serialize ship to JSON format.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			id: this.id,
			length: this.length,
			position: this.position,
			isRotated: this.isRotated
		};
	}

	setDamage( position ) {
		let index = 0;

		for( const pos of this.coordinates ) {
			if ( pos[ 0 ] === position[ 0 ] && pos[ 1 ] === position[ 1 ] ) {
				this.damages[ index ] = true;
			}

			index++;
		}
	}
}

mix( Ship, ObservableMixin );

function createFalsyArray( length ) {
	const arr = [];

	for( let i = 0; i < length; i++ ) {
		arr[ i ] = false;
	}

	return arr;
}
