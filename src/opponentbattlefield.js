import Battlefield from './battlefield';
import ShootInterface from './battlefieldinterfaces/shootinterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * Class that represents Opponent Battlefield.
 *
 * @extends Battlefield
 * @implements ShootInterface
 */
export default class OpponentBattlefield extends Battlefield {
}

mix( OpponentBattlefield, ShootInterface );
