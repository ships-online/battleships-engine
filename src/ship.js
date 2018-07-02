import ObservableMixin from '@ckeditor/ckeditor5-utils/src/observablemixin.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';
import uid from '@ckeditor/ckeditor5-utils/src/uid.js';

/**
 * @mixes ObservableMixin
 */
export default class Ship {
	/**
	 * @param {Object} data Configuration.
	 * @param {Number} data.length Ship length.
	 * @param {String} [data.id] Ship id.
	 * @param {Boolean} [data.isRotated] Ship orientation.
	 * @param {Array<Number, Number>} [data.position] Ship position on the battlefield.
	 */
	constructor( data ) {
		/**
		 * Ship id.
		 *
		 * @readonly
		 * @member {String} #id
		 */
		this.id = data.id || uid();

		/**
		 * Ship length.
		 *
		 * @readonly
		 * @type {Number}
		 */
		this.length = data.length;

		/**
		 * Ship orientation (horizontal or vertical).
		 *
		 * @observable
		 * @readonly
		 * @member {Boolean} #isRotated
		 */
		this.set( 'isRotated', data.isRotated || false );

		/**
		 * Ship position on the battlefield.
		 *
		 * @observable
		 * @member {Array<Number, Number>} #position
		 */
		this.set( 'position', data.position || [ null, null ] );

		/**
		 * Defines if ship has a collision with other ship on the battlefield.
		 *
		 * @observable
		 * @member {Boolean} #isCollision
		 */
		this.set( 'isCollision', false );

		/**
		 * Stores information which field of ship is damaged.
		 *
		 * 		[ false, false, false ] // Ship has length 3 and has no damages.
		 * 		[ false, true, false ] // Ship has length 3 and middle field is hit.
		 * 		[ true, true, true ] // Ship has length 3 and is destroyed.
		 *
		 * @type {Array<Boolean>}
		 */
		this.damages = createFalsyArray( data.length );
	}

	/**
	 * Returns array with position of ship fields.
	 *
	 * @returns {Array<Number, Number>}
	 */
	get coordinates() {
		const positions = [];

		for ( const position of this.getPositions() ) {
			positions.push( position );
		}

		return positions;
	}

	/**
	 * Returns position of last Ship field.
	 *
	 * @returns {Array<Number, Number>}
	 */
	get tail() {
		return this.coordinates[ this.length - 1 ];
	}

	/**
	 * Returns `true` when Ship is fully damaged.
	 *
	 * @returns {Boolean}
	 */
	get isSunk() {
		return !this.damages.some( field => !field );
	}

	/**
	 * Returns iterator that iterates over ship fields and returns its position.
	 *
	 * @returns {Iterable.<Array>}
	 */
	* getPositions() {
		const pos = this.position;
		let step = 0;

		while ( this.hasPosition() && step < this.length ) {
			yield this.isRotated ? [ pos[ 0 ], pos[ 1 ] + ( step++ ) ] : [ pos[ 0 ] + ( step++ ), pos[ 1 ] ];
		}
	}

	/**
	 * Returns true when Ship is placed on the Battlefield.
	 *
	 * @returns {Boolean}
	 */
	hasPosition() {
		return this.position.every( Number.isInteger );
	}

	/**
	 * Change ship orientation.
	 */
	rotate() {
		this.isRotated = !this.isRotated;
	}

	/**
	 * Returns plain object with ship data.
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

	/**
	 * Marks given field as damaged.
	 *
	 * @param {Array<Number, Number>} position
	 */
	setDamage( position ) {
		let index = 0;

		for ( const pos of this.getPositions() ) {
			if ( pos[ 0 ] === position[ 0 ] && pos[ 1 ] === position[ 1 ] ) {
				this.damages[ index ] = true;
			}

			index++;
		}
	}

	/**
	 * Reset Ship data to default values.
	 */
	reset() {
		this.position = [ null, null ];
		this.isRotated = false;
		this.isCollision = false;
		this.damages = createFalsyArray( this.length );
	}
}

mix( Ship, ObservableMixin );

function createFalsyArray( length ) {
	const arr = [];

	for ( let i = 0; i < length; i++ ) {
		arr[ i ] = false;
	}

	return arr;
}
