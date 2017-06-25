import Battlefield from './battlefield';
import RandomInterface from './battlefieldinterfaces/randominterface';
import CollisionInterface from './battlefieldinterfaces/collisioninterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

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
		 * Defines if any of ships placed on the battlefield has a collision.
		 *
		 * @readonly
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
