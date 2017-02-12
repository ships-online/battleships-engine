import Battlefield from './battlefield.js';
import ShootInterface from './battlefieldinterfaces/shootinterface.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';

/**
 * Class that represents Opponent Battlefield.
 *
 * @extends Battlefield
 * @implements ShootInterface
 */
export default class OpponentBattlefield extends Battlefield {
}

mix( OpponentBattlefield, ShootInterface );
