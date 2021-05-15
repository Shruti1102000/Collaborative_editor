import React from 'react'
import axios from 'axios';
axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang:'select',
      ip:'',
      out:''
    };
   

    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
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
    // alert(' ' + this.state.code);

    var datas = JSON.stringify({
        "code": this.state.code,
        "language":this.state.lang,
        "input":this.state.ip
        });

    var config = {
            method: 'post',
                url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
            headers: { 
                        'Content-Type': 'application/json'
                    },
            data : datas 
        };

        
  axios(config)
 .then(function (response) {
    this.setState({out : response.data.output} );
    })
.catch(function (error) {
console.log(error);
});
    alert(' ' + this.state.code);
   alert(' ' + this.state.lang);
   alert(' ' + this.state.out);

     event.preventDefault();
  }

  render() {
    return (
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
       
                  <textarea placeholder="Write a code.." value={this.state.code} onChange={this.handleChange} className="form-control" rows="23"/>
                  <input type="submit" value="Run" onClick={this.handleSubmit} className="btn1" />
          </div>          
          
    
          <div className="col my-fcol">
    
                  <textarea placeholder="Enter Input" value={this.state.ip} onChange={this.handleChange1} className="form-control" rows="12" cols="69"/>
                  <textarea placeholder="Output" readOnly="false" value={this.state.out} className="form-control" rows="12" cols="69"/>
               
          </div>
                
        </div>
                
      </form>
    );
  }
}

export default Form
