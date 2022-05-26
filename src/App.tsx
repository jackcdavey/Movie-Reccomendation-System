import React, {useState} from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"

import cosine_sim from "./algorithms/cosineSim"



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
	constructor(id: number, entries: Entry[]) {
		this.id = id
		this.entries = []
	}
}

export class Movie{
	id: number;
	entries: Entry[];
	constructor(id: number, entries: Entry[]) {
		this.id = id
		this.entries = []
	}
}

/////////////////////DATA INITIALIZATION/////////////////////////////


function dataToArray(input: string) { //Could implement a request num parameter to return diff types, like user, movie, filtered/unfiltered, etc?
	let inp = input.split(/\r?\n/);
	let entries: Entry[] = [];
	let users: User[] = [];
	let movies: Movie[] = [];
	for (let i = 0; i < inp.length; i++) {
		let line = inp[i].split(" ");
		entries.push(new Entry(
			parseInt(line[0]),
			parseInt(line[1]),
			parseInt(line[2])
		));
		
	}
	for (let i = 0; i < entries.length; i++) {
		if (users.find(user => user.id === entries[i].userId) === undefined) {//Add a new user if they have not yet been found
			let newUserId = entries[i].userId;
			let newUserEntries = [];
			for(let j = 0; j < entries.length; j++) { //Add all entries by this user
				if (entries[j].userId === newUserId)
						newUserEntries.push(entries[j]);
			}
			users.push(new User(entries[i].userId, newUserEntries ));
		}

		if (movies.find(movie => movie.id === entries[i].movieId) === undefined) {//Add a new movie if they have not yet been found
			let newMovieId = entries[i].movieId;
			let newMovieEntries = [];
			for (let j = 0; j < entries.length; j++) { //Add all entries for this movie
				if (entries[j].movieId === newMovieId)
					newMovieEntries.push(entries[j]);
			}
			movies.push(new Movie(entries[i].movieId, newMovieEntries));
		}
	}

	console.log("Users: " + users.length);
	console.log("Movies: " + movies.length);
	console.log("Entries: " + entries.length);

	return entries;
}

/////////////////////END DATA INITIALIZATION/////////////////////////////


/////////////////////OPERATIONS/////////////////////////////
function getDotProduct(a: Entry, b: Entry) {
	let sum = 0;
	for (let i = 0; i < a.rating; i++) {
		sum += a.rating * b.rating;
	}
	return sum;
}

function getMagnitude(input: Entry) {
	let sum = 0;
	for (let i = 0; i < input.rating; i++) {
		sum += Math.pow(input.rating, 2);
	}
	return Math.sqrt(sum);
}

function getCosine(a: Entry, b: Entry) {
	return getDotProduct(a, b) / (getMagnitude(a) * getMagnitude(b));
}

/////////////////////END OPERATIONS/////////////////////////////

/////////////////////ALGORITHMS/////////////////////////////

// function getUMCosineSim(user: User, movie: ) { }


function runCosineSimilarity(user: User, movie: Movie) {


}
// 	// //Iterate through the test data, and find the value that is highest for each userId
// 	let raw = dataToArray(train, false);
// 	let trainData = raw[0];
// 	let testUsers: User[] = [];
// 	let trainUsers: User[] = [];

// 	let output: Entry[] = [];
	

// 	//Create a user object for each unique user in the input Arr, and push it to an array of users
// 	for (let i = 0; i < rated.length; i++) {
// 		let userId = rated[i].userId;
// 		let movieId = rated[i].movieId;
// 		let rating = rated[i].rating;

// 		let user = testUsers.find(user => user.id === userId);
// 		if (user === undefined) {
// 			user = new User(userId);
// 			testUsers.push(user);
// 		}
// 		user.entries.push(new Entry(userId, movieId, rating));
// 	}

// 	//Create a user object for each unique user in the train data, and push it to an array of users
// 	for (let i = 0; i < trainData.length; i++) {
// 		let userId = trainData[i].userId;
// 		let movieId = trainData[i].movieId;
// 		let rating = trainData[i].rating;

// 		let user = trainUsers.find(user => user.id === userId);
// 		if (user === undefined) {
// 			user = new User(userId);
// 			trainUsers.push(user);
// 		}
// 		if(user)
// 			user.entries.push(new Entry(userId, movieId, rating));
// 	}

	
// 	for (let i = 0; i < testUsers.length; i++) {
// 		let maxSimilarity = 0;
// 		let closestUserId = -1;
// 		let testU = testUsers[i].entries;
// 		for (let j = 0; j < trainUsers.length; j++) {
// 			let trainU = trainUsers[j].entries;
// 			let res = getCosine(testU[0], trainU[0]);
// 			if (res > maxSimilarity) {
// 				maxSimilarity = res;
// 				closestUserId = trainUsers[j].id;
// 			}
// 		}
// 		console.log("Max similarity for user " + testUsers[i].id + " is " + maxSimilarity + " with training user " + closestUserId);
// 		// console.log("Closest user to " + i + " is: " + closestUserId);
// 	}
	
// }


function runPearsonCorrelation(input: string[]) {
	let res = input;
	

	return res;
}

/////////////////////END ALGORITHMS/////////////////////////////


function App() {
	const [algChoice, setAlgChoice] = useState(0);
	const [testNum, setTestNum] = useState(0);

	function startTest() {
		let dataset = '';
		if(testNum === 5)
			dataset = test5;
		else if(testNum === 10)
			dataset = test10;
		else if(testNum === 20)
			dataset = test20;
		
		// let testEntries: Entry[] = [];
		let testEntries = dataToArray(dataset); 
		// testEntries.push(dataToArray(dataset)[0]);
		let trainEntries = dataToArray(train);
		let predictingEntries: Entry[] = [];
		for(let i = 0; i < testEntries.length; i++) {
			if (testEntries[i].rating === 0) {
				predictingEntries.push(testEntries[i]);
			}
		}
		console.log("Making predictions for " + predictingEntries.length + " entries");


		if(algChoice === 0) {
			// runCosineSimilarity(data[0], data[1], testNum);
		}
	}

	return (
		<div style={{ textAlign: 'center', justifyContent: 'center', width: '100vw'}}>
			<h2 style={styles.header}>Running Test: {testNum} Using Algorithm: {algChoice} </h2>
			<button style={{backgroundColor:'green', padding: '2%', borderRadius: '10px', color: 'white', fontWeight: 'bold'}}onClick={() => { startTest() }}>START</button>

		<div style={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'center',
			width: '70vw',
			backgroundColor: 'gray',
				margin: '5%',
			marginLeft: '15%',
			borderRadius: '25px'
		}}>
			<div style={{ display: 'flex', flexDirection: "column", alignItems: "center", width: "80%", padding: "2%" }}>
				<h2 style={styles.header}>Test File</h2>
				<button style={styles.button} onClick={() => { setTestNum(5) }}>Test 5</button>
				<button style={styles.button} onClick={() => { setTestNum(10)}}>Test 10</button>
				<button style={styles.button} onClick={() => { setTestNum(20) }}>Test 20</button>
			</div>
			<div style={{ display: 'flex', flexDirection: "column", alignItems: "center", width: "80%", padding: "2%" }}>
				<h2 style={styles.header}>Algorithm</h2>
				<button style={styles.button} onClick={() => {setAlgChoice(1) }}>Cosine</button>
				<button style={styles.button} onClick={() => { setAlgChoice(2) }}>Pearson</button>
				<button style={styles.button} onClick={() => { setAlgChoice(3) }}>IUF</button>
				<button style={styles.button} onClick={() => { setAlgChoice(4) }}>Case Amplification</button>
				<button style={styles.button} onClick={() => { setAlgChoice(5) }}>Item-based</button>
				<button style={styles.button} onClick={() => { setAlgChoice(6) }}>Custom</button>
			</div>
			</div>
			</div>
	)
}

const styles = {
	button: {
		margin: '2%',
		width: '100%',
		height: '10%',
		fontSize: '20px',
	},

	header: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		color: '#FFFFFF',
		
		// textAlign: 'center'
	},
}


export default App
