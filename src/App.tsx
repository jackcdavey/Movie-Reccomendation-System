import React from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"



//create an object for each line, with user id, movie id, and rating, and push it to an array
const entry = (input: string[]) => {
	return {
		userId: parseInt(input[0]),
		movieId: parseInt(input[1]),
		rating: parseInt(input[2])
	}
}



function filterRatedFromUnrated(input: any[]) {
	let rated = [];
	let unrated = [];
	for (let i = 0; i < input.length; i++) {
		if(input[i].rating === 0) 
			unrated.push(input[i]);
		else
			rated.push(input[i]);
	}
	return {
		rated: rated,
		unrated: unrated
	}
	
	
}

function dataToArray(input: string) {
	let inp = input.split(/\r?\n/);
	let res = [];
	for (let i = 0; i < inp.length; i++) {
		let line = inp[i].split(" ");
		res.push(entry(line));
	}
	let sorted = filterRatedFromUnrated(res);
	return sorted;
}


function runTest5() {
	let data = dataToArray(test5);
	console.log(data);
}

function runTest10() {
	
	let data = dataToArray(test10);
	console.log(data)
}

function runTest20() {
	let data = dataToArray(test20);
	console.log(data)
}




function runCosineSimilarity(input: string[]) {
	let res = input;
	

	return res;
}

function runPearsonCorrelation(input: string[]) {
	let res = input;
	

	return res;
}



function App() {
	return <>
		<button onClick={() => { runTest5() }}>Run Test 5</button>
		<button onClick={() => { runTest10() }}>Run Test 10</button>
		<button onClick={() => { runTest20() }}>Run Test 20</button>
	</>
}

export default App
