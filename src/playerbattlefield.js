import Battlefield from './battlefield';
import ShipsCollection from './shipscollection';
import RandomInterface from './battlefieldinterfaces/randominterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * Class that represents Player Battlefield.
 *
 * @extends Battlefield
 * @implements RandomInterface
 */
export default class PlayerBattlefield extends Battlefield {
	/**
	 * @inheritDoc
	 */
	constructor( size, shipsSchema ) {
		super( size, shipsSchema );

		this.shipsCollection.add( ShipsCollection.createShipsFromSchema( this.shipsSchema ) );
	}
}

mix( Battlefield, RandomInterface );
