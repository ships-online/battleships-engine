import Battlefield from '../../src/battlefields/battlefield';
import Position from '../../src/position';

type SerializedRow = { [ key: string ]: string };
export type SerializedBattlefield = { [ key: string ]: SerializedRow };

/**
 * Serializes battlefield to JSON format.
 * It is useful to print battlefield on browser or system console e.g.:
 *
 * 		const battlefield = new Battlefield();
 * 		console.table( serializeBattlefield( battlefield ) );
 *
 * @param battlefield Battlefield instance.
 * @returns Serialized battlefield.
 */
export default function serializeBattlefield( battlefield: Battlefield ): SerializedBattlefield {
	const result: SerializedBattlefield = {};

	for ( let y = 0; y < battlefield.size; y++ ) {
		const row: SerializedRow = {};

		for ( let x = 0; x < battlefield.size; x++ ) {
			const field = battlefield.getField( new Position( x, y ) );

			row[ x ] = field ? Array.from( field.getShips(), ship => ship.id ).join( ',' ) : '';
		}

		result[ y ] = row;
	}

	return result;
}
