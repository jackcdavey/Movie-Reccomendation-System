import React, {useState} from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"

import {Entry, User, Movie, Dataset} from "./objects"
import { cosine_usr_usr, cosine_usr_mov } from "./algorithms/cosineSim"

import generateOutput from "./generate-output"


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
			let newUserEntries: Entry[] = [];
			for (let j = 0; j < entries.length; j++) { //Add all entries by this user
				if (entries[j].userId === newUserId) {
					newUserEntries.push(entries[j]);
				}
			}
			users.push(new User(entries[i].userId, newUserEntries));
			
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




	let dataset = new Dataset(entries, users, movies);

	console.log("Users: " + dataset.users.length);
	console.log("Movies: " + dataset.movies.length);
	console.log("Entries: " + dataset.entries.length);



	return dataset;
}

/////////////////////END DATA INITIALIZATION/////////////////////////////



/////////////////////ALGORITHMS/////////////////////////////


function runCosineSimilarity(user: User, movie: Movie) {


}

function runPearsonCorrelation(input: string[]) {
	let res = input;
	return res;
}

/////////////////////END ALGORITHMS/////////////////////////////


function App() {
	const [algChoice, setAlgChoice] = useState(0);
	const [testNum, setTestNum] = useState(0);
	const [outputFileString, setOutputFileString] = useState("");

	const downloadTxtFile = (input: string) => {
		const element = document.createElement("a");
		const file = new Blob([input], {
			type: "text/plain"
		});
		element.href = URL.createObjectURL(file);
		element.download = "result" + testNum + ".txt";
		document.body.appendChild(element);
		element.click();
  	}

	function startTest() {
		let dataset = '';
		if (testNum === 5)
			dataset = test5;
		else if (testNum === 10)
			dataset = test10;
		else if (testNum === 20)
			dataset = test20;
		
		let testDataset = dataToArray(dataset);
		let trainDataset = dataToArray(train);
		
		let predictingEntries: Entry[] = [];
		for (let i = 0; i < testDataset.entries.length; i++) {
			if (testDataset.entries[i].rating === 0) {
				predictingEntries.push(testDataset.entries[i]);
			}
		}
		console.log("Making predictions for " + predictingEntries.length + " entries");


		//For each entry in the predicting entries, pass the user and movie to the cosine similarity function
		

		if (algChoice === 1) {
			let predictedEntries: Entry[] = [];
			for (let i = 0; i < predictingEntries.length; i++) {
				let user = testDataset.users.find(user => user.id === predictingEntries[i].userId)!;
				let movie = testDataset.movies.find(movie => movie.id === predictingEntries[i].movieId)!;
				let combined_datasets: Dataset[] = [testDataset, trainDataset];
				predictedEntries.push(cosine_usr_mov(user, movie, combined_datasets));
				// console.log(predictedEntries[i].userId + ", " + predictedEntries[i].movieId + ", " + predictedEntries[i].rating);
			}

			setOutputFileString(generateOutput(testDataset, predictedEntries));
		}




		// console.log(testDataset.users[0].entries);
		// console.log("Cosine similarity between each user: ");
		// let max = 0.0;
		// let maxUsera = -1;
		// let maxUserb = -1;
		// for (let i = 0; i < testDataset.users.length; i++) {
		// 	for (let j = 0; j < testDataset.users.length; j++) {
		// 		let user1 = testDataset.users[i];
		// 		let user2 = testDataset.users[j];
		// 		let res = cosine_usr_usr(user1, user2);
		// 		if (res > max && res< 0.99999999999){
		// 			max = res;
		// 			maxUsera = user1.id;
		// 			maxUserb = user2.id;
		// 		}
		// 	}
		// }
		// console.log("Max similarity between users " + maxUsera + " and " + maxUserb + " is " + max);
	}


	return (
		<div style={{ textAlign: 'center', justifyContent: 'center', width: '100vw'}}>
			<h2 style={styles.header}>Running Test: {testNum} Using Algorithm: {algChoice} </h2>
			<button style={{backgroundColor:'green', padding: '2%', width: '25vw', borderRadius: '10px', color: 'white', fontSize: '30px', fontWeight: 'bold'}}onClick={() => { startTest() }}>START</button>

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
				<button style={styles.button} onClick={() => {setAlgChoice(1) }}>1. Cosine</button>
				<button style={styles.button} onClick={() => { setAlgChoice(2) }}>2. Pearson</button>
				<button style={styles.button} onClick={() => { setAlgChoice(3) }}>3. IUF</button>
				<button style={styles.button} onClick={() => { setAlgChoice(4) }}>4. Case Amplification</button>
				<button style={styles.button} onClick={() => { setAlgChoice(5) }}>5. Item-based</button>
				<button style={styles.button} onClick={() => { setAlgChoice(6) }}>6. Custom</button>
			</div>
			</div>
			<button style={{ backgroundColor: 'blue', padding: '2%', width: '25vw', borderRadius: '10px', color: 'white', fontSize: '25px', fontWeight: 'bold' }} onClick={() => downloadTxtFile(outputFileString)}>Download Output</button>
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
		// color: '#FFFFFF',
		
		// textAlign: 'center'
	},
}


export default App
