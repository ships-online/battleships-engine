import Item from './item.js';

/**
 * Ship.
 *
 * @memberOf game
 * @extends game.Item
 */
class Ship extends Item {
	/**
	 * Create instance of Ship class.
	 *
	 * @param {Number} length Ship size.
	 * @param {Number} [id] Ship id.
	 */
	constructor( length, id ) {
		super( length, id );

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
}

export default Ship;
