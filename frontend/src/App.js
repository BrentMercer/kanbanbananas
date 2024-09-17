import React, {Component} from "react";
import Board from './components/Board';

class App extends Component{
  state = {
    boards: [
      {
        id: 1,
        title: "Work projects"
      },
      {
        id: 2,
        title: "Personal projects"
      },
      {
        id: 3,
        title: "Kids projects"
      }
    ]
  }



  render() {
    console.log(this.state.boards);
    return (
        <div className="App">
          <h1>Easy Kanban</h1>
          <Board />
        </div>
    );
  }
}

export default App;
