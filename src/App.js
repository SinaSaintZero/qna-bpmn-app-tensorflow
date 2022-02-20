import React,  {useRef, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
// 0. Install dependencies
// npm i @tensorflow/tfjs @tensorflow-models/qna react-loader-spinner

import * as tf from '@tensorflow/tfjs';
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Fragment } from 'react';
import { div } from '@tensorflow/tfjs';

import dataaa from './dataaa.txt';

const App = ()=>{

  // 3. Setup references and state hooks
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  const [passageText , setPassageText] = useState('');
  // getting kobe data
  const passage = dataaa;

  fetch(passage)
  .then(r => r.text())
  .then(text => {
    // console.log('text decoded:', text);
     setPassageText(text);
  });
  // ---- finishing with console logging his data

  // 4. load the tensorflow model
  const loadModel = async ()=>{
    const loadedModel = await qna.load()
    setModel(loadedModel);
    console.log('Model loaded...');
  }

  useEffect(()=>{loadModel()}, []);

  const answerQuestion = async (e)=>{
    // we are checking if the user USED the ENTER key to submit which is 13
    if(e.which ===13 && model !== null){
      console.log('Question submitted.');
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, passage);
      setAnswer(answers);
      console.log(answers);
    }
  }

  // setup input, questions and result areas
  return(
    <div className='App'>
      <header className='App-header'>
        {model == null ? 
        <div>
          <div>Model Loading</div>
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}/>
        </div>
        :
        // if our model has loaded
        <Fragment>
          {/* Passage */}
          <textarea ref={passageRef} value={passageText} style={{display:'none'}} rows='30' cols = '100'>  </textarea>
          Ask a Question
          <input ref={questionRef} onKeyPress={answerQuestion} size = '80'></input>
          <br/>
          Answers
          {answer? answer.map((ans, idx)=> <div> <b>Answer {idx+1} - </b> {ans.text} ({Math.floor(ans.score*100)/100}) </div>) : "" }
        </Fragment>
        }
      </header>

    </div>
  )
}

export default App;
