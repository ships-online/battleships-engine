export default class Field {
	constructor( position ) {
		this.id = position.join( 'x' );
		this._state = undefined;
		this._ships = new Map();
	}

	set isHit( value ) {
		this._state = value;
	}

	get isHit() {
		return this._state === true;
	}

	set isMissed( value ) {
		this._state = !value;
	}

	get isMissed() {
		return this._state === false;
	}

	get length() {
		return this._ships.size;
	}

	addShip( ship ) {
		this._ships.set( ship.id, ship );
	}

	getShip( id ) {
		return this._ships.get( id );
	}

	getFirstShip() {
		return this._ships.values().next().value;
	}

	removeShip( id ) {
		this._ships.delete( id );
	}

	[ Symbol.iterator ]() {
		return this._ships.values();
	}
}
