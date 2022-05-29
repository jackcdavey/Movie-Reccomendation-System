export class Entry {
	userId: number;
	movieId: number;
	rating: number;

	constructor(userId: number, movieId: number, rating: number) {
		this.userId = userId
		this.movieId = movieId
		this.rating = rating
	}
}

export class User {
	id: number;
	entries: Entry[];
	avgRating() {
		let sum = 0
		for (let i = 0; i < this.entries.length; i++) {
			sum += this.entries[i].rating
		}
		return sum / this.entries.length
	}
	constructor(id: number, entries: Entry[]) {
		this.id = id
		this.entries = entries
	}
}

export class Movie{
	id: number;
	entries: Entry[];
	avgRating() {
		let sum = 0
		for (let i = 0; i < this.entries.length; i++) {
			sum += this.entries[i].rating
		}
		return sum / this.entries.length
	}
	constructor(id: number, entries: Entry[]) {
		this.id = id
		this.entries = []
	}
}

export class Dataset {
	entries: Entry[];
	users: User[];
	movies: Movie[];
	constructor(entries: Entry[], users: User[], movies: Movie[]) {
		this.entries = entries
		this.users = users
		this.movies = movies
	}
}
//Yeah, ik this is a horribly inefficient way of storing the data... ehhh

