import Battlefield from './battlefield.js';
import RandomInterface from './battlefieldinterfaces/randominterface.js';
import CollisionInterface from './battlefieldinterfaces/collisioninterface.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';

/**
 * Class that represents Player Battlefield.
 *
 * @extends Battlefield
 * @implements RandomInterface
 * @implements CollisionInterface
 */
export default class PlayerBattlefield extends Battlefield {
	/**
	 * @inheritDoc
	 */
	constructor( size, shipsSchema ) {
		super( size, shipsSchema );

		/**
		 * Defines if some of ship placed on the battlefield have a collision.
		 *
		 * @observable
		 * @type {Boolean}
		 */
		this.set( 'isCollision', false );

		this.on( 'shipMoved', ( evt, ship ) => this._handleShipMove( ship ) );
	}

	/**
	 * Handles ship move and check if has a collision.
	 *
	 * @private
	 * @param {Ship} ship
	 */
	_handleShipMove( ship ) {
		this.verifyExistingCollisions( ship );
		this.checkShipCollision( ship );

		this.isCollision = Array.from( this ).some( ( field ) => {
			return Array.from( field ).some( ship => ship.isCollision );
		} );
	}
}

mix( Battlefield, RandomInterface );
mix( Battlefield, CollisionInterface );
