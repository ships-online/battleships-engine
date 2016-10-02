/**
 * Serializes battlefield to JSON format.
 * It is useful to dump battlefield on browser console e.g.:
 *
 * 		const battlefield = new Battlefield();
 * 		console.table( serializeBattlefield( battlefield ) );
 *
 * @param {game.Battlefield} battlefield Battlefield instance.
 * @returns {Object} Serialized battlefield.
 */
export default function serializeBattlefield( battlefield ) {
	const result = {};

	for ( let y = 0; y < battlefield.size; y++ ) {
		let row = {};

		for ( let x = 0; x < battlefield.size; x++ ) {
			const field = battlefield._get( [ x, y ] );

			row[ x ] = field ? field.map( item => item.id ).join( ',' ) : '';
		}

		result[ y ] = row;
	}

	return result;
}