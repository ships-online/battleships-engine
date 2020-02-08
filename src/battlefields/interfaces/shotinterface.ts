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

		if ( !this.hasField( position ) ) {
			this.createField( position ).markAsMissed();

			return result;
		}

		const field = this.getField( position );

		if ( field.isMissed ) {
			result.type = 'missed';
		} else if ( field.isHit ) {
			result.type = 'hit';
		} else {
			const ship = field.getFirstShip();

			ship.hit( position );
			field.markAsHit();
			result.type = 'hit';

			if ( ship.hasSunk ) {
				result.sunkenShip = ship;
			}
		}

		return result;
	}
}

export default ShotInterface;
