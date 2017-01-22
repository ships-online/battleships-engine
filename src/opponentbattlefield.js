import Battlefield from './battlefield.js';
import shootInterface from './battlefieldinterfaces/shootinterface.js';
import mix from 'battleships-utils/src/mix.js';

export default class OpponentBattlefield extends Battlefield {
}

mix( OpponentBattlefield, shootInterface );
