import React from 'react'
import Nav_bar from './Nav_bar'
import Queries from './Queries'

function MainPage({file,setFile,message,setMessage,question,setQuestion,answer,setAnswer,loading,setLoading,error,setError}) {
  return (
    <div>
      <Nav_bar />
      <Queries file = {file} setFile = {setFile} message = {message} setMessage = {setMessage} question = {question} setQuestion = {setQuestion} answer = {answer} setAnswer = {setAnswer} loading = {loading} setLoading = {setLoading} error = {error} setError = {setError}/>
    </div>
  )
}

export default MainPage
