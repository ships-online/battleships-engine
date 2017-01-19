import Battlefield from './battlefield.js';
import randomInterface from './battlefieldinterfaces/randominterface.js';
import collisionInterface from './battlefieldinterfaces/collisioninterface.js';
import mix from 'battleships-utils/src/mix.js';

/**
 * Stores information about items placed on the battlefield.
 *
 * @memberOf {game}
 */
export default class PlayerBattlefield extends Battlefield {
	/**
	 * Creates instance of Battlefield class.
	 *
	 * @inheritDoc
	 */
	constructor( size, shipsConfig ) {
		super( size, shipsConfig );

		this.on( 'shipMoved', ( evt, ship ) => this._handleShipMove( ship ) );
	}

	_handleShipMove( ship ) {
		this.verifyExistingCollisions( ship );
		this.checkShipCollision( ship );
	}
}

mix( Battlefield, randomInterface );
mix( Battlefield, collisionInterface );
