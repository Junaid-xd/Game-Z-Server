import React, {useEffect, useState} from 'react'
import './Home.css'


function Home() {

  const[users, setUsers] = useState([]);

  const [questions, setQuestions] = useState([]);

  const [reloadKey, setReloadKey] = useState(0);






  useEffect(() => {
    const intervalId = setInterval(() => {
      setReloadKey(prevKey => prevKey + 1);
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/playersdata-xrbubxz/endpoint/api/playersData/getUsers")
        
        const result = await response.json()
        
        setUsers(result);
        
       
      } catch (error) {
        console.error("Error fetching data:", error);
        setFailedMessage("Bad Internet Connection");
        setShowEmergencyPopup(true);
      }
    };

    fetchData();   

    setInterval(fetchData, 2000);

  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/playersdata-xrbubxz/endpoint/api/playersData/getQuestions");
        const result = await response.json();
        setQuestions(result);
       
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();

    setInterval(fetchData, 2000);

  }, []);



  useEffect(()=>{
    users.sort((a, b) => b.score - a.score);



    const tableBody = document.querySelector('.players-table-body');
    tableBody.innerHTML = "";
    
    users.forEach((user, index)=>{

    
      tableBody.innerHTML += 
        `<tr class='players-table-row'>
          <td>${user._id}</td>
          <td>${user.username}</td>
          <td>${user.score}</td>
          <td>${user.correctAnswers}</td>
          <td>${user.attempts}</td>
          <td>${user.password}</td>
        </tr>`;
    })

  },[users])
 

  useEffect(()=>{
  
    const tableBody = document.querySelector('.questions-table-body');
    tableBody.innerHTML = "";
    
    questions.forEach((question)=>{

    
      tableBody.innerHTML += 
        `<tr">
          <td>${question._id}</td>
          <td>${question.query}</td>
          <td>${question.createdBy}</td>
          <td>${question.doneBy.length}</td>
          <td>${question.answer}</td>
        </tr>`;

    })

    
    
    
  }, [questions])
  



  const deleteQuestion = async()=>{
    const questionID = document.querySelector('.question-id-input-ele').value;

    if(questionID!=""){

      try{

        const response = await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/playersdata-xrbubxz/endpoint/api/removeQuestion", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(
            {
              id: questionID
            }
          )
        });
  
        const data = await response.json();
  
        if(response.ok){
          document.querySelector('.delete-question-msg-div').innerHTML = "Question Deleted Successfully!";

          setTimeout(()=>{
            document.querySelector('.delete-question-msg-div').innerHTML = "";
          },2000)
        }
        console.log('Question Deleted:', data);
  
        document.querySelector('.question-id-input-ele').value = "";
  
  
      } catch (e){
        console.error('Error deleting a Question:', e);
        throw e;
      }

    }
    else{
      document.querySelector('.delete-question-msg-div').innerHTML = "Enter question ID first*";

      setTimeout(()=>{
        document.querySelector('.delete-question-msg-div').innerHTML = ""
      },2000)
    }


  }




  const createQuestion = ()=>{

    const question = document.querySelector('.form-input-question-ele').value;
    const answerToLowerCase = document.querySelector('.form-input-answer-ele').value.toLowerCase();

    if(question!="" && answerToLowerCase!=""){
      const answer = answerToLowerCase.trim().split(/\s+/).join(' ');
      let hint = document.querySelector('.form-input-hint-ele').value
      const noOfWords = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
      const selectedRadio = document.querySelector('input[name="difficulty"]:checked');

      const difficulty = selectedRadio ? selectedRadio.value : null;

      let reward = 10;

      if(difficulty=="Easy"){
        reward = 10;
      }
      else if(difficulty=="Medium"){
        reward = 30;
      }
      else{
        reward = 50;
      }


      if(!hint){
        hint=null;
      }


      if(difficulty=="Hard" && hint==null){
        document.querySelector('.error-msg-div').innerHTML = "";
        document.querySelector('.error-msg-div').innerHTML = "For hard difficulty, Hint is mandatory*";

        setTimeout(()=>{
          document.querySelector('.error-msg-div').innerHTML = "";
        },3000)

      }
      else{
        const newQuestion = {
          "query":question,
          "answer":answer,
          "difficulty":difficulty,
          "noOfWords": noOfWords,
          "reward":reward,
          "doneBy":[],
          "createdBy":"Game Z",
          "hint":hint
        }


        //===============================================================
        //================ API CALL STARTS FROM HERE ====================
        //===============================================================


        const runCreateQuestionApi = async()=>{
          try{

            const send = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/playersdata-xrbubxz/endpoint/api/playersData/createQuestion', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(newQuestion)
            })
            .then(() =>{
              document.querySelector('.error-msg-div').innerHTML = "";
              document.querySelector('.error-msg-div').innerHTML = "Question Created Successfully";
      
              setTimeout(()=>{
                document.querySelector('.error-msg-div').innerHTML = "";
              },3000)

            });
        

            
            
            document.querySelector('.form-input-question-ele').value = "";
            document.querySelector('.form-input-answer-ele').value = "";

            console.log("G");
            

          }catch(error){
            console.log("Error in creating question: ", error);
          }


        }

        runCreateQuestionApi();
        


        //===============================================================
        //================ API CALL STARTS FROM HERE ====================
        //===============================================================


      }
    }
    else{
      document.querySelector('.error-msg-div').innerHTML = "";
        document.querySelector('.error-msg-div').innerHTML = "Please fill all fields*";

        setTimeout(()=>{
          document.querySelector('.error-msg-div').innerHTML = "";
        },3000)
    }
    
  }


  const deleteUser = async()=>{

    const userID = document.querySelector('.user-id-input-ele').value;

    if(userID!=""){

      try{

        const response = await fetch("https://ap-south-1.aws.data.mongodb-api.com/app/playersdata-xrbubxz/endpoint/api/playersData/removeUser", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(
            {
              id: userID
            }
          )
        });
  
        const data = await response.json();
  
        if(response.ok){
          document.querySelector('.delete-user-msg-div').innerHTML = "User Deleted Successfully!";

          setTimeout(()=>{
            document.querySelector('.delete-user-msg-div').innerHTML = "";
          },2000)
        }
        console.log('User Deleted:', data);
  
        document.querySelector('.user-id-input-ele').value = "";
  
  
      } catch (e){
        console.error('Error deleting a User:', e);
        throw e;
      }

    }
    else{
      document.querySelector('.delete-user-msg-div').innerHTML = "Enter User ID first*";

      setTimeout(()=>{
        document.querySelector('.delete-user-msg-div').innerHTML = "";
      },2000)
    }



  }
 


  return (
    <>
        <div className='main-wrapper'>


          <div className="top-page-div">
            <div>Game Z Server</div>

            <div key={reloadKey} className='nav-bar-bottom'>
              <marquee behavior="slide" direction="right" scrollamount="5" className='slider-tag'>
                <p>JD PRODUCTIONS</p>
              </marquee>  
            </div>

          </div>



          <div className='players-table-wrapper'>

            <div className='heading-div'>
              User Settings
            </div>

            <div><p>Total active users: {users.length}</p></div>
           

            <div className='players-table-div'>
              <table className='players-table'>
                <thead className='players-table-head'>
                  <tr className='players-table-head'>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Aura</th>
                    <th>Right</th>
                    <th>Tried</th>
                    <th>Pass</th>
                  </tr>
                </thead>


                <tbody className='players-table-body'>
                  
                </tbody>

              </table> 


            </div>


            <div className="delete-question-div">
              <div className="delete-question-form-div">

                <div>
                  <input type="text" placeholder='enter user id' className='user-id-input-ele'/>
                </div>

                <div>
                  <button onClick={deleteUser} className='delete-question-btn'>Delete</button>
                </div>
              </div>

              <div className='delete-user-msg-div'>

              </div>
            </div>


          </div>



          <div className='questions-table-wrapper'>

            <div className='heading-div'>Question Settings </div>

            <div>
              <p>Total questions : {questions.length}</p>
            </div>


            <div className='questions-table-div'>
              <table className='questions-table'>
                <thead className='questions-table-head'>
                  <tr className='questions-table-head'>
                    <th>Id</th>
                    <th>Question</th>
                    <th>Created by</th>
                    <th>Answered by</th>
                    <th>Answer</th>
                  </tr>
                </thead>


                <tbody className='questions-table-body'>
                  
                </tbody>

              </table> 


            </div>


           

            <div className="delete-question-div">
              <div className="delete-question-form-div">

                <div>
                  <input type="text" placeholder='enter question id' className='question-id-input-ele'/>
                </div>

                <div>
                  <button onClick={deleteQuestion} className='delete-question-btn'>Delete</button>
                </div>
              </div>

              <div className='delete-question-msg-div'>

              </div>
            </div>






            <div className="new-question-popup-form">

              <div className='form-input'>
                <p style={{fontSize: 13}}>Question</p>
                <input type="text" placeholder='question goes here' className='form-input-question-ele'/>
              </div>


              <div className='form-input'>
                <p style={{fontSize: 13}}>Answer</p>
                <input type="text" placeholder='answer goes here' className='form-input-answer-ele'/>
              </div>

              <div className='form-input'>
                <p style={{fontSize: 13}}>Hint</p>
                <input type="text" placeholder='(optional)' className='form-input-hint-ele'/>
              </div>


              <div className='form-input radio-div'>
                
                <div>
                  <label>
                    <input type="radio" name="difficulty" value="Easy" required defaultChecked className='radio-field'/>
                    Easy
                  </label>
                </div>
              
                <div>
                  <label>
                    <input type="radio" name="difficulty" value="Medium" required className='radio-field'/>
                    Medium
                  </label>
                </div>

                <div>
                  <label>
                    <input type="radio" name="difficulty" value="Hard" required className='radio-field'/>
                    Hard
                  </label>
                </div>

              </div>

              <div className="error-msg-div"></div>


              <div className='create-btn-div'>
                <button className='create-btn' onClick={createQuestion}>CREATE</button>
              </div>

          
            </div>










          </div>




        </div>
    </>
  )
}

export default Home
