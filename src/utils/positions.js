/**
 * Returns position at the top of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopOf( position ) {
	return [ position[ 0 ], position[ 1 ] - 1 ];
}

/**
 * Returns position at the right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheRightOf( position ) {
	return [ position[ 0 ] + 1, position[ 1 ] ];
}

/**
 * Returns position at the bottom of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomOf( position ) {
	return [ position[ 0 ], position[ 1 ] + 1 ];
}

/**
 * Returns position at the left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheLeftOf( position ) {
	return [ position[ 0 ] - 1, position[ 1 ] ];
}

/**
 * Returns position at the top right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopRightOf( position ) {
	return getPositionAtTheRightOf( getPositionAtTheTopOf( position ) );
}

/**
 * Returns position at the bottom right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomRightOf( position ) {
	return getPositionAtTheRightOf( getPositionAtTheBottomOf( position ) );
}

/**
 * Returns position at the bottom left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomLeftOf( position ) {
	return getPositionAtTheLeftOf( getPositionAtTheBottomOf( position ) );
}

/**
 * Returns position at the top left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopLeftOf( position ) {
	return getPositionAtTheLeftOf( getPositionAtTheTopOf( position ) );
}

/**
 * Returns surrounding position at the top left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Array>}
 */
export function getSurroundingPositions( position ) {
	return [
		getPositionAtTheTopOf( position ),
		getPositionAtTheTopRightOf( position ),
		getPositionAtTheRightOf( position ),
		getPositionAtTheBottomRightOf( position ),
		getPositionAtTheBottomOf( position ),
		getPositionAtTheBottomLeftOf( position ),
		getPositionAtTheLeftOf( position ),
		getPositionAtTheTopLeftOf( position )
	];
}
