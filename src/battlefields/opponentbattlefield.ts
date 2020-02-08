import Battlefield from './battlefield';
import ShotInterface from './interfaces/shotinterface';
import mix from 'js-utils/src/mix';

interface OpponentBattlefield extends Battlefield, ShotInterface {}

/**
 * Class that represents Opponent Battlefield.
 */
class OpponentBattlefield extends Battlefield {}

mix( OpponentBattlefield, ShotInterface );

export default OpponentBattlefield;
