import React from "react"
import logo from "./logo.svg"
import "./App.css"

import test5 from "./data/test5"
import test10 from "./data/test10"
import test20 from "./data/test20"
import train from "./data/train"

function runTest5() {
	console.log(test5);

}

function runTest10() {
	console.log(test10);
}

function runTest20() {
	console.log(test20);
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
