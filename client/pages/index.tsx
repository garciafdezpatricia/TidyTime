import React from 'react'

export default function Prueba() {

  async function loginInrupt() {
    window.location.assign("http://localhost:8080/solid/login");
  }

  return (
  <section className='index-container'>
    <button onClick={loginInrupt}>LOGIN INRUPT</button>
  </section>
  )
}