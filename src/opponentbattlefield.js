import Battlefield from './battlefield';
import ShotInterface from './battlefieldinterfaces/shotinterface';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * Class that represents Opponent Battlefield.
 *
 * @extends Battlefield
 * @implements ShotInterface
 */
export default class OpponentBattlefield extends Battlefield {
}

mix( OpponentBattlefield, ShotInterface );
