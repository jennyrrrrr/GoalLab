import React, { Component } from 'react';
import {Route, BrowserRouter, Link, Switch, Redirect, NavLink, Router} from 'react-router-dom';
import Auth from "./components/Auth";
import Hero from "../../src/components/Hero";
import Profile from "../../src/components/Profile";
import Nav from "../../src/components/Nav";
import Todo from "./components/Todo"
import Home from "../../src/components/Home"
import NewToday from "../../src/components/NewToday"
import MainFooter from "../../src/components/MainFooter"
import firebase from 'firebase/app';
import 'firebase/database';
import './main.css';

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      todos: {},
      todoText: ""
    }; //initialize as empty
    this.sendTodo = this.sendTodo.bind(this)
    this.input = this.input.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user) {
        this.setState({
          user: user
        });
      } else {
        this.setState({ user: null })
      }
    });

    this.todosRef = firebase.database().ref("todos")
    this.todosRef.on("value", (snapshot) => {
      let todos = snapshot.val();
      this.setState({todos: todos})
    })
  }

  // push tofo to the database
  sendTodo = () => {
    let todo = {
      user: firebase.auth().currentUsers.displayName,
      timestamp : firebase.database.ServerValue.TIMESTAMP,
      text: this.state.todoText
    }

    this.todosRef
      .push(todo)
      .then(() => { this.setState({todoText: ""}) }) 
      .catch((d) => console.log("error ", d))
  }

  input = (inputText) => {
    this.setState({todoText: inputText})
  }

  updateTodo() {
    // let text = 
  }

  render() {
    return (
      <div>
        {/* if user, board go to home board, else go to login - signup */}
        <Nav />
        {/* <Home /> */}
        <Switch >
          <Route path="/about" component={Auth} />
          <Route exact path="/" component={Main} />
          <Route path="/complete" component={Main} />
          <Route path="/goals" component={Main} />
          <Route path="/todo" component={ () => <Main todos={this.props.todos} sendTodo={this.state.sendTodo} callback={this.input} /> } />
          {/* <Route path="/todo" component={() => <Main currentUser={this.state.user}/>} /> */}
        </Switch>
        <MainFooter />
      </div>
    );
  }
}

class Main extends Component {
  render() {
    return(
      <div>
        <Hero />
        {/* <Content currentUser={this.props.user} /> */}
        <Content todos={this.props.todos} sendTodo={this.props.sendTodo} callback={this.props.callback} />
      </div>
    )
  }
}

class Content extends Component {
  render() {
    let pathname = window.location.pathname;
    return(
      <section className="section">
      <div className="container">
        <div className="tabs is-centered">
          <ul>
            <li className={pathname=="/"?"tab is-active":"tab"}><a href="/">Todos</a></li>
            <li className={pathname=="/complete"?"tab is-active":"tab"}><a href="/complete">Completed</a></li>
            <li className={pathname=="/goals"?"tab is-active":"tab"}><a href="/goals">Goals</a></li>
          </ul>
        </div>
        <div className="tile is-ancestor">
          <Switch>
            <Route path="/complete" component={Complete} />
            <Route path="/goals" component={Goals} />
            <Route path="/" component={ () => <Todos todos={this.props.todos} sendTodo={this.props.sendTodo} callback={this.props.callback}/> } />
            {/* <Route path="/" component={ () => <NewToday currentUser={this.props.user} /> } /> */}
          </Switch>
          <Profile />
        </div>
      </div>
    </section>
  )}
}

class Today extends Component {
  render() {
    return(
      <div className="tile is-parent is-vertical">
        <article className="tile is-child notification">
          <p className="title">Today</p>
          <div className="today-content content">
            <div className="draggable">
              <div className="todo-item today" draggable="false">
                <div className="icon">
                  <button className="circle" />
                </div>
                <input 
                  className="ipt-today ipt-all input" 
                  type="text" 
                  placeholder="Write a smallest task..." 
                  value={ this.props.todoText }
                  onChange={ (event) => {this.props.callback(event.target.value)} }
                  onKeyDown={ this.props.sendTodo } 
                />
              </div>
              <div className="is-divider" />
            </div>
            <div>
              <TodoLine todos={this.props.todos} sendTodo={this.props.sendTodo} callback={this.props.callback}/>
            </div>
          </div>
        </article>
      </div>
    )
  }
}

class TodoLine extends Component {
  render() {
    if (this.props.todos) {
      Object.keys(this.props.todos).map((d) => {
        return <Todo id={d} key={d} info={this.props.todos[d]} />
      })
    } else {
      return <div />
    }
  }
}

class TodoSec extends Component {
  render() {
    return(
      <div className="tile is-parent">
        <article className="tile is-child notification draggable-area">
          <p className="title">Todos</p>
          <div className="todo-content content">
            <TodoLine />
          </div>
        </article>
      </div>
    )
  }
}

// class TodoLine extends Component {
//   render() {
//     return(
//       <div className="draggable">
//         <div className="todo-item todo" draggable="false">
//           <div className="icon">
//             <button className="circle" />
//           </div>
//           <input 
//             className="ipt-todo ipt-all input" 
//             type="text" 
//             placeholder="Do one task at a time..."
//             onChange={(event) => this.setState({todoText: event.target.value})}
//             onKeyDown={this.onKeyDown} 
//           />
//         </div>
//         <div className="is-divider" />
//       </div>
//     )
//   }
// }

class Todos extends Component {
  render () {
    return(
      <div className="tile is-9 content-tab" id="today">
        <Today todos={this.props.todos} sendTodo={this.props.sendTodo} callback={this.props.callback}/>
        <TodoSec />
      </div>
    )
  }
}

class Complete extends Component {
  render() {
    return(
      <div className="tile is-vertical is-9 content-tab" id="completed">
        <div className="tile is-parent is-vertical">
          <article className="tile is-child notification">
            <p className="title">Completed</p>
            <div className="complete-content content"></div>
          </article>
        </div>
      </div>
    )
  }
}

class Goals extends Component {
  render() {
    return(
      <div className="tile is-vertical is-9 content-tab" id="goals">
        <div className="tile is-parent is-vertical">
          <article className="tile is-child notification">
            <p className="title">Goals</p>
            {/* <div className="goal-content content">
              <div className="draggable">
                <div className="todo-item goal" draggable="false">
                  <div className="icon">
                    <button className="circle" />
                  </div>
                  <input className="ipt-goal input ipt-all" type="text" placeholder="Write a smallest task..." />
                </div>
                <div className="is-divider" />
              </div>
            </div> */}
          </article>
        </div>
      </div>
    )
  }
}

export default App;
