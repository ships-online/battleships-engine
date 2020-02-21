import Position from '../../position';
import Battlefield from '../battlefield';
import Ship from '../../ship';

interface ShotInterface extends Battlefield {}
type ShootResult = { position: Position; type: 'missed' | 'hit'; sunkenShip?: Ship };

/**
 * Injects the shot API into Battlefield.
 */
class ShotInterface {
	/**
	 * @param position Position on the Battlefield.
	 * @returns Shot result.
	 */
	shot( position: Position ): ShootResult {
		const result: ShootResult = { position, type: 'missed' };

		if ( !this._hasField( position ) ) {
			this.markAsMissed( position );

			return result;
		}

		const field = this._getField( position );

		if ( field.isUnmarked ) {
			const ship = field.getFirstShip();

			ship.hit( position );
			this.markAsHit( position );
			result.type = 'hit';

			if ( ship.hasSunk ) {
				result.sunkenShip = ship;
			}
		}

		result.type = field.status as 'missed' | 'hit';

		return result;
	}
}

export default ShotInterface;
