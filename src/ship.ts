import {fill, isArrayLikeObject} from 'lodash-es';
import Position from './position';
import Observable, { ObservableInterface } from 'js-utils/src/observable';
import mix from 'js-utils/src/mix';
import uid from 'js-utils/src/uid';

type ShipData = { id?: string, isRotated?: boolean, length: number, position: Position | undefined };

/**
 * Single ship implementation.
 */
export default class Ship implements ObservableInterface {
	/**
	 * The id if the ship.
	 */
	id: string;

	/**
	 * The position on the battlefield of the ship head field.
	 */
	position: Position;

	/**
	 * The orientation of the ship (horizontal or vertical).
	 */
	isRotated: boolean;

	/**
	 * The length of the ship.
	 * In other words it's a number of fields that ship covers on the battlefield.
	 */
	length: number;

	/**
	 * Defines if ship has a collision with other ship on the battlefield.
	 */
	hasCollision: boolean;

	/**
	 * Stores information about which field of ship has been hit.
	 *
	 * 		[ false, false, false ] // Ship has length 3 and has not been hit.
	 * 		[ false, true, false ] // Ship has length 3 and middle field has been hit.
	 * 		[ true, true, true ] // Ship has length 3 and is destroyed (all fields has been hit).
	 */
	hitFields: boolean[];

	/**
	 * Number of fields
	 */
	/**
	 * @param {Object} data Configuration.
	 * @param {Number} data.length Ship length.
	 * @param {String} [data.id] Ship id.
	 * @param {Boolean} [data.isRotated] Ship orientation.
	 * @param {Array<Number, Number>} [data.position] Ship position on the battlefield.
	 */
	constructor( { id= uid(), isRotated= false, position, length }: ShipData ) {
		this.id = id;
		this.length = length;
		this.hitFields = createFalsyArray( length );
		this.createObservables( 'isRotated', 'position', 'hasCollision' );
	}

	/**
	 * Returns an array with positions of all ship fields.
	 */
	get coordinates(): Position[] {
		const positions: Position[] = [ this.position ];
		let lastPosition = this.position;
		let length = this.length;

		while ( --length ) {
			lastPosition = this.isRotated ? lastPosition.getShiftedBottom() : lastPosition.getShiftedRight();
			positions.push( lastPosition );
		}

		return positions;
	}

	/**
	 * Returns a position of the last Ship field.
	 */
	get tail(): Position {
		return this.coordinates.pop();
	}

	/**
	 * Returns `true` when all ship fields are hit.
	 */
	get hasSunk(): boolean {
		return this.hitFields.every( field => field === true );
	}

	/**
	 * Change ship orientation.
	 */
	rotate(): void {
		this.isRotated = !this.isRotated;
	}

	/**
	 * Returns plain object with ship data.
	 *
	 * @returns {Object}
	 */
	toJSON(): object {
		return {
			id: this.id,
			position: this.position,
			isRotated: this.isRotated,
			length: this.length
		};
	}

	/**
	 * Marks field on a given position as hit.
	 *
	 * @param position
	 */
	hit( position: Position ) {
		const coordinates = this.coordinates;

		for ( let i = 0; i < this.length; i++ ) {
			if ( position.isEqual( coordinates[ i ] ) ) {
				this.hitFields[ i ] = true;

				return;
			}
		}
	}

	/**
	 * Reset Ship data to default values.
	 */
	reset() {
		this.position = undefined;
		this.isRotated = false;
		this.hasCollision = false;
		this.hitFields = this.hitFields.map( () => false );
	}
}

mix( Ship, Observable );

function createFalsyArray( length: number ): boolean[] {
	const arr: boolean[] = [];

	while( length-- ) {
		arr.push( false );
	}

	return arr;
}
