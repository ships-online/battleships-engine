/**
 * Class that represents every defined field on the Battlefield.
 */
export default class Field {
	/**
	 * @param {Array<Number, Number>} position Position on the battlefield.
	 */
	constructor( position ) {
		/**
		 * Id of this field. The value is a position joined by `x` character.
		 *
		 * @type {String}
		 */
		this.id = position.join( 'x' );

		/**
		 * Current state of field.
		 *
		 * Field might have 3 states:
		 * * `true` - field is marked as hit
		 * * `false` - field is marked as missed
		 * * `undefined` - no shoot yet
		 *
		 * @private
		 * @type {Boolean|undefined}
		 */
		this._state = undefined;

		/**
		 * Stores ships placed on this field.
		 *
		 * @private
		 * @type {Map<String, Ship>}
		 */
		this._ships = new Map();
	}

	/**
	 * Marks field as hit.
	 */
	markAsHit() {
		this._state = true;
	}

	/**
	 * Defines if field is hit or not.
	 *
	 * @returns {Boolean}
	 */
	get isHit() {
		return this._state === true;
	}

	/**
	 * Marks field as missed.
	 */
	markAsMissed() {
		this._state = false;
	}

	/**
	 * Defines if field is missed or not.
	 *
	 * @returns {Boolean}
	 */
	get isMissed() {
		return this._state === false;
	}

	/**
	 * Returns number of ships in on the field.
	 *
	 * @returns {Number}
	 */
	get length() {
		return this._ships.size;
	}

	/**
	 * Returns position on the battlefield.
	 *
	 * @return {Array<Number,Number>}
	 */
	get position() {
		return this.id.split( 'x' ).map( item => parseInt( item, 10 ) );
	}

	/**
	 * Adds ship to the field.
	 *
	 * @param {Ship} ship Ship instance.
	 */
	addShip( ship ) {
		this._ships.set( ship.id, ship );
	}

	/**
	 * Gets ship of given if from yhe field.
	 *
	 * @param {String} id Ship id.
	 * @returns {Ship} Ship instance.
	 */
	getShip( id ) {
		return this._ships.get( id );
	}

	/**
	 * Returns first ship on the field.
	 *
	 * @returns {Ship} Ship instance.
	 */
	getFirstShip() {
		return Array.from( this._ships.values() )[ 0 ];
	}

	/**
	 * Remove ship of given if from the field.
	 *
	 * @param {String} id Ship id.
	 */
	removeShip( id ) {
		this._ships.delete( id );
	}

	/**
	 * @returns {Iterator.<Ship>}
	 */
	[ Symbol.iterator ]() {
		return this._ships.values();
	}
}
