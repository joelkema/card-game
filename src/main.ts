import { startGame } from "./startGame";
import "./style.css";

const canvas = document.getElementById("game")! as HTMLCanvasElement;

startGame(canvas.getContext("2d")!);
