import { startGame } from "./startGame2";
import "./style.css";
import { from, of } from "./observers/Observable";

// Usage example
const fruits = ["orange", "apple", "banana"];

of(fruits).subscribe(console.log); // ['orange','apple','banana']
from(fruits).subscribe(console.log); // 'orange','apple','banana'

const canvas = document.getElementById("game")! as HTMLCanvasElement;

// startGame(canvas.getContext("2d")!);
