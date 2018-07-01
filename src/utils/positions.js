/**
 * Returns position at the top of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTop( position ) {
	return [ position[ 0 ], position[ 1 ] - 1 ];
}

/**
 * Returns position at the right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheRight( position ) {
	return [ position[ 0 ] + 1, position[ 1 ] ];
}

/**
 * Returns position at the bottom of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottom( position ) {
	return [ position[ 0 ], position[ 1 ] + 1 ];
}

/**
 * Returns position at the left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheLeft( position ) {
	return [ position[ 0 ] - 1, position[ 1 ] ];
}

/**
 * Returns position at the top right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopRight( position ) {
	return getPositionAtTheRight( getPositionAtTheTop( position ) );
}

/**
 * Returns position at the bottom right of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomRight( position ) {
	return getPositionAtTheRight( getPositionAtTheBottom( position ) );
}

/**
 * Returns position at the bottom left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheBottomLeft( position ) {
	return getPositionAtTheLeft( getPositionAtTheBottom( position ) );
}

/**
 * Returns position at the top left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Number>} Position [ x, y ].
 */
export function getPositionAtTheTopLeft( position ) {
	return getPositionAtTheLeft( getPositionAtTheTop( position ) );
}

/**
 * Returns surrounding position at the top left of given position.
 *
 * @param {Array<Number>} position Position [ x, y ].
 * @returns {Array<Array>}
 */
export function getSurroundingPositions( position ) {
	return [
		getPositionAtTheTop( position ),
		getPositionAtTheTopRight( position ),
		getPositionAtTheRight( position ),
		getPositionAtTheBottomRight( position ),
		getPositionAtTheBottom( position ),
		getPositionAtTheBottomLeft( position ),
		getPositionAtTheLeft( position ),
		getPositionAtTheTopLeft( position )
	];
}

/**
 * Returns positions surrounding given position in the horizontal axis.
 *
 * @param {Array<Array>} position Position [ x, y ].
 * @returns {Array<Array>}
 */
export function getSurroundingHorizontal( position ) {
	return [ getPositionAtTheLeft( position ), getPositionAtTheRight( position ) ];
}

/**
 * Returns positions surrounding given position in the vertical axis.
 *
 * @param {Array<Array>} position Position [ x, y ].
 * @returns {Array<Array>}
 */
export function getSurroundingVertical( position ) {
	return [ getPositionAtTheTop( position ), getPositionAtTheBottom( position ) ];
}
