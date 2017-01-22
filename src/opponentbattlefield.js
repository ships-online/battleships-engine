import Battlefield from './battlefield.js';
import shootInterface from './battlefieldinterfaces/shootinterface.js';
import mix from '@ckeditor/ckeditor5-utils/src/mix.js';

export default class OpponentBattlefield extends Battlefield {
}

mix( OpponentBattlefield, shootInterface );
