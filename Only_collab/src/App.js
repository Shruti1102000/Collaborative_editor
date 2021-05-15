 //import Header from './components/Header'
 //import Editor from './components/Editor'
 //import Form from './components/Form'
 //import Ipop from './components/Ipop'
 //import Editor from 'react-medium-editor';
//import 'medium-editor/dist/css/medium-editor.css';
//import 'medium-editor/dist/css/themes/default.css';
import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Identicon from 'react-identicons';
import Sidebar from './components/Sidebar'
import { Component } from 'react';
 import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
import './App.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000');
const contentDefaultMessage = "Start writing your document here";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      userActivity: [],
      username: null,
      code: '',
      lang:'select',
      ip:'',
      out:''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    //this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({code: event.target.value});
  }

  handleChange1(event) {
    this.setState({ip: event.target.value});
  }

  handleChange2(event) {
    this.setState({lang: event.target.value});
  }

  handleSubmit(event) {
  }
  

  logInUser = () => {
    const username = this.username.value;
    if (username.trim()) {
      const data = {
        username
      };
      this.setState({
        ...data
      }, () => {
        client.send(JSON.stringify({
          ...data,
          type: "userevent"
        }));
      });
    }
  }

    /* When content changes, we send the
current content of the editor to the server. */
 onEditorStateChange = (event) => {
  this.setState({code: event.target.value});
  client.send(JSON.stringify({
    type: "contentchange",
    username: this.state.username,
    content: event.target.value
  }));
};

componentWillMount() {
  client.onopen = () => {
    console.log('WebSocket Client Connected');
  };
  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    const stateToChange = {};
    if (dataFromServer.type === "userevent") {
      stateToChange.currentUsers = Object.values(dataFromServer.data.users);
    } else if (dataFromServer.type === "contentchange") {
      stateToChange.code = dataFromServer.data.editorContent || contentDefaultMessage;
    }
    stateToChange.userActivity = dataFromServer.data.userActivity;
    this.setState({
      ...stateToChange
    });
  };
}

  //login page 
  showLoginSection = () => (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <Identicon className="account__avatar" size={64} string="randomness" />
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join to edit the document</p>
          </div>
          <input name="username" ref={(input) => { this.username = input; }} className="form-control" />
          <button type="button" onClick={() => this.logInUser()} className="btn btn-primary account__btn">Join</button>
        </div>
      </div>
    </div>
  )

  showEditorSection = () => (
    
    <div className="main-content">
      <div className="document-holder">
      <div className="container ">
        <div className="row my-row">
          <div className="col-md-2 my-col">
            <img className="class-rounded" id="user-img " src="./code_logo.png" alt="" height='95px' width= '95px'/>
          </div>
          <div className="col-md-8 my-col">
            <div className="currentusers">
            {this.state.currentUsers.map(user => (
              <React.Fragment>
                <span id={user.username} className="userInfo" key={user.username}>
                  <Identicon className="account__avatar" style={{ backgroundColor: user.randomcolor }} size={40} string={user.username} />
                </span>
                <UncontrolledTooltip placement="top" target={user.username}>
                  {user.username}
                </UncontrolledTooltip>
              </React.Fragment>
            ))}
        </div>
        </div>
        </div>
      <div className="row my-row">
        <div className="col-2 my-col ">
              <Sidebar/>
        </div>

        <div className="col my-col ">
        
          <form  className="form" onSubmit={this.handleSubmit}>
          <div className="row">
  
            <div className="col">
              
  
              
                    <select value={this.state.lang} onChange={this.handleChange2} className="dpdown">
                      <option value="select">Select a Language</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                      <option value="cs">C#</option>
                      <option value="java">Java</option>
                      <option value="py">Python</option>
                      <option value="rb">Ruby</option>
                      <option value="kt">Kotlin</option>
                      <option value="swift">Swift</option>
                    </select>
         
                    <textarea className="body-editor" onChange={this.onEditorStateChange} placeholder="Write a code.." value={this.state.code} className="form-control" rows="23"/>
                    <input type="submit" value="Run" onClick={this.handleSubmit} className="btn1" />
            </div>          
            
      
            <div className="col my-fcol">
      
                    <textarea placeholder="Enter Input" value={this.state.ip} onChange={this.handleChange1} className="form-control" rows="12" cols="69"/>
                    <textarea placeholder="Output" readOnly="false" value={this.state.out} className="form-control" rows="12" cols="69"/>
                 
            </div>
                  
          </div>
                  
        </form>
        </div>

      </div>
    </div>
        {/*<Editor
          options={{
            placeholder: {
              text: this.state.text ? contentDefaultMessage : ""
            }
          }}
          className="body-editor"
          text={this.state.text}
          onChange={this.onEditorStateChange}
        />*/}
      </div>
      {/*<div className="history-holder">
        <ul>
          {this.state.userActivity.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
        </ul>
      </div>*/}
    </div>
        )


  render(){
    const {
      username
    } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          {username ? this.showEditorSection() : this.showLoginSection()}
        </div>
      </React.Fragment>
    );
  }
}

   /*return (
    <div className="container ">
      <div className="row my-row">
        <div className="col-2 my-col ">
              <img className="class-rounded" id="user-img " src="./code_logo.png" alt="" height='95px' width= '95px'/>
              <Sidebar/>
        </div>

        <div className="col my-col ">
             <Form/>
        </div>

      </div>
    </div>
    
  );
  }
}*/
export default App;
