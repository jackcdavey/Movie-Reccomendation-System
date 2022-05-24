import React from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"



//create an object for each line, with user id, movie id, and rating, and push it to an array
class Entry {
	userId: number;
	movieId: number;
	rating: number;

	constructor(userId: number, movieId: number, rating: number) {
		this.userId = userId
		this.movieId = movieId
		this.rating = rating
	}
}

class User {
	id: number;
	entries: Entry[];
	constructor(id: number) {
		this.id = id
		this.entries = []
	}
}

/////////////////////DATA INITIALIZATION/////////////////////////////


function dataToArray(input: string, filter: boolean) {
	let inp = input.split(/\r?\n/);
	let rated = [];
	let unrated = [];
	let entries = [];
	for (let i = 0; i < inp.length; i++) {
		let line = inp[i].split(" ");
		entries.push(new Entry(
			parseInt(line[0]),
			parseInt(line[1]),
			parseInt(line[2])
		));
		
		if (filter) {
			if (entries[i].rating === 0)
				unrated.push(entries[i]);
			else
				rated.push(entries[i]);
		}

	}
	if (filter) {
		return [rated, unrated];
	}
	return [entries, entries];
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

function runCosineSimilarity(rated: Entry[], unrated: Entry[], testNum: number) {
	// //Iterate through the test data, and find the value that is highest for each userId
	let raw = dataToArray(train, false);
	let trainData = raw[0];
	let testUsers: User[] = [];
	let trainUsers: User[] = [];

	let output: Entry[] = [];
	

	//Create a user object for each unique user in the input Arr, and push it to an array of users
	for (let i = 0; i < rated.length; i++) {
		let userId = rated[i].userId;
		let movieId = rated[i].movieId;
		let rating = rated[i].rating;

		let user = testUsers.find(user => user.id === userId);
		if (user === undefined) {
			user = new User(userId);
			testUsers.push(user);
		}
		user.entries.push(new Entry(userId, movieId, rating));
	}

	//Create a user object for each unique user in the train data, and push it to an array of users
	for (let i = 0; i < trainData.length; i++) {
		let userId = trainData[i].userId;
		let movieId = trainData[i].movieId;
		let rating = trainData[i].rating;

		let user = trainUsers.find(user => user.id === userId);
		if (user === undefined) {
			user = new User(userId);
			trainUsers.push(user);
		}
		if(user)
			user.entries.push(new Entry(userId, movieId, rating));
	}

	
	for (let i = 0; i < testUsers.length; i++) {
		let maxSimilarity = 0;
		let closestUserId = -1;
		let testU = testUsers[i].entries;
		for (let j = 0; j < trainUsers.length; j++) {
			let trainU = trainUsers[j].entries;
			let res = getCosine(testU[0], trainU[0]);
			if (res > maxSimilarity) {
				maxSimilarity = res;
				closestUserId = trainUsers[j].id;
			}
		}
		console.log("Max similarity for user " + testUsers[i].id + " is " + maxSimilarity + " with training user " + closestUserId);
		// console.log("Closest user to " + i + " is: " + closestUserId);
	}
	
}


function runPearsonCorrelation(input: string[]) {
	let res = input;
	

	return res;
}

/////////////////////END ALGORITHMS/////////////////////////////





/////////////////////TESTS/////////////////////////////

function runTest5() {
	let data = dataToArray(test5, true);
	let rated = data[0];
	let unrated = data[1];
	runCosineSimilarity(rated, unrated, 5);
}

function runTest10() {
	let data = dataToArray(test10, true);
	let rated = data[0];
	let unrated = data[1];
	runCosineSimilarity(rated, unrated, 10);

}

function runTest20() {
	let data = dataToArray(test20, true);
	let rated = data[0];
	let unrated = data[1];
	runCosineSimilarity(rated, unrated, 20);
}

/////////////////////END TESTS/////////////////////////////

function App() {
	return(
	<div style={{ display: 'flex', flexDirection: "column", alignItems:"center", paddingTop: "5%" }}>
		<button style={styles.button} onClick={() => { runTest5() }}>Run Test 5</button>
		<button style={styles.button} onClick={() => { runTest10() }}>Run Test 10</button>
		<button style={styles.button} onClick={() => { runTest20() }}>Run Test 20</button>
	</div>
	)
}

const styles = {
	button: {
		margin: '2%',
		width: '30%',
		height: '10%',
		fontSize: '20px',
	}
}
export default App
