import Battlefield, { ShipsSchema } from './battlefield';
import CollisionInterface from './interfaces/collisioninterface';
import RandomInterface from './interfaces/randominterface';
import Ship from '../ship';
import mix from 'js-utils/src/mix';

interface PlayerBattlefield extends Battlefield, CollisionInterface, RandomInterface {}

/**
 * Class that represents Player Battlefield.
 */
class PlayerBattlefield extends Battlefield {
	constructor( size: number, shipsSchema: ShipsSchema ) {
		super( size, shipsSchema );

		for ( const ship of Battlefield.createShipsFromSchema( this.shipsSchema ) ) {
			this._ships.add( ship );
		}

		this.hasCollision = false;
		this.on( 'shipMoved', ( evt, ship: Ship ) => this.checkCollision( ship ) );
	}
}

mix( PlayerBattlefield, RandomInterface );

export default PlayerBattlefield;
