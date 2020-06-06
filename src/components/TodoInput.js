import React, { Component } from 'react';
import 'firebase/database';
import firebase from 'firebase/app';

//A form the user can use to post a todo
export default class NewToday extends Component {
  constructor(props){
    super(props);
    this.state = {
      todo:''
    };
    this.userId = firebase.auth().currentUser.uid;
    this.userName = firebase.auth().currentUser.displayName;
    this.userPhoto = firebase.auth().currentUser.photoURL;
    this.time = firebase.database.ServerValue.TIMESTAMP;
  }

  //when the text in the form changes
  updatePost = (event) => {
    this.setState({
      todo: event.target.value
    });
  }

  //post a new todo to the database
  postTodo = (event) => {
    event.preventDefault(); //don't submit
    let newTodo = {
      text: this.state.todo,
      userId: this.userId,
      userName: this.userName,
      userPhoto: this.userPhoto,
      time: this.time,
      type: this.props.currentType
    }
    firebase.database().ref('todos').push(newTodo);
    this.setState({todo:''}); //empty out post for next time
  }

  render() {
    return (
      <div className="draggable">
        <div className="todo-item today" draggable="false">
          <div className="icon">
            <button className="circle" />
          </div>
          <input 
            className="ipt-today ipt-all input" 
            type="text" 
            placeholder="Write a smallest task..." 
            value={this.state.post}
            onChange={this.updatePost}
            onBlur = {this.postTodo} 
          />
        </div>
        <div className="is-divider" />
        {/* Only show this if the post length is > 140 */}
          {/* {this.state.post.length > 140 &&
            <small className="form-text">140 character limit!</small>
          } */}
      </div>
    );
  }
}