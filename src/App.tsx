import React from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"



//create an object for each line, with user id, movie id, and rating, and push it to an array
class Entry {
	userId!: number
	movieId!: number;
	rating!: number;

	constructor(userId: number, movieId: number, rating: number) {
		this.userId = userId
		this.movieId = movieId
		this.rating = rating
	}
}


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
		console.log("FILETERED");
		return [rated, unrated];
	}
	console.log("NOT FILTERED");
	return entries;
}


function runTest5() {
	let data = dataToArray(test5, true);
	let rated = Object.entries(data[0]);
	console.log(rated[0][1]);
}

function runTest10() {
	
	let data = dataToArray(test10, true);
	console.log(data);

}

function runTest20() {
	let data = dataToArray(test20, true);

	// runCosineSimilarity(data, 5);
	console.log(data)
}



//accept an entry, and a test number to run
function runCosineSimilarity(input: Entry[], testNum: number) {
	let trainData = dataToArray(train, false);
	let res = input;
	if (testNum === 5) {
		//compute the dot product of the data in the test file and the data in the train file
		// for (let i = 0; i < res.length; i++) {
		// 	let dotProduct = 0;
		// 	for (let j = 0; j < trainData.length; j++) {
		// 		if (res[i].movieId === trainData[j].movieId) {
		// 			dotProduct += res[i].rating * trainData[j].rating;
		// 		}
		// 	}
		// 	res[i].dotProduct = dotProduct;
		// }

	

		return res;
	}
	else if (testNum === 10) {
		return res;
	}
	else if (testNum === 20) {
		return res;
	}
	
	console.log("ERROR: Invalid test number");
	return 0;
}
function runPearsonCorrelation(input: string[]) {
	let res = input;
	

	return res;
}



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
