import Battlefield, { ShipsSchema } from './battlefield';
import RandomInterface from './interfaces/randominterface';
import Ship from '../ship';
import mix from 'js-utils/src/mix';

interface PlayerBattlefield extends Battlefield, RandomInterface {}

/**
 * Class that represents Player Battlefield.
 */
class PlayerBattlefield extends Battlefield {
	constructor( size: number, shipsSchema: ShipsSchema, initialShips?: Ship[] ) {
		super( size, shipsSchema, initialShips );

		this.set( 'hasCollision', false );
		this.on( 'shipMoved', ( evt, ship: Ship ) => this.checkCollision( ship ) );
	}
}

mix( PlayerBattlefield, RandomInterface );

export default PlayerBattlefield;
