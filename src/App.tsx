import React from "react"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"



//create an object for each line, with user id, movie id, and rating, and push it to the entries array
const entry = (input: string[]) => {
	return {
		userId: parseInt(input[0]),
		movieId: parseInt(input[1]),
		rating: parseInt(input[2])
	}
}

function dataToArray(input: string) {
	let inp = input.split(/\r?\n/);
	let res = [];
	for (let i = 0; i < inp.length; i++) {
		let line = inp[i].split(" ");
		res.push(entry(line));
		}

	return res;
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
	console.log(res);
	return res;
}

function runPearsonCorrelation(input: string[]) {
	let res = input;
	console.log(res);
	return res;
}



function App() {
	let [test5Data, setTest5Data] = React.useState(test5)
	let [test5Output, setTest5Output] = React.useState("")

	let [test10Data, setTest10Data] = React.useState(test10)
	let [test10Output, setTest10Output] = React.useState("")

	let [test20Data, setTest20Data] = React.useState(test20)
	let [test20Output, setTest20Output] = React.useState("")

	let [trainData, setTrainData] = React.useState(train)

	return <>
		<button onClick={() => { runTest5() }}>Run Test 5</button>
		<button onClick={() => { runTest10() }}>Run Test 10</button>
		<button onClick={() => { runTest20() }}>Run Test 20</button>
	</>
}

export default App
