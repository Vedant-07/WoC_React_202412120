import React from 'react'
import {  Link } from "react-router";

const Navbar = () => {
  return (
    <div className='mx-auto bg-slate-500 p-4 w-full'>
        <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>IDE</h1>
        <div className='flex justify-around gap-4 rounded'>
        <button className='bg-slate-300 p-2'>Login</button>
        <button className='bg-slate-300 p-2' ><Link to="guest">Explore</Link></button>
        </div>
        </div>
    </div>
  )
}

export default Navbar