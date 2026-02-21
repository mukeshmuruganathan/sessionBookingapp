import React from 'react'
import { useState } from 'react';

const ReservationForm = () => {
  const [selectedDate, setSelectedDate] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: ''
  });
  const handleChange=(e)=>{
    setSelectedDate({
      ...selectedDate,
      [e.target.name]:e.target.value
    })
  }


  const GenerataTimeSloats=()=>{
    const slots=[];
    for(let hours=9;hours<21;hours++){
      const startHour=hours%12===0?12:hours%12;
      const startPeriod=hours<12?'AM':'PM';
      const endHour=(hours+1)%12===0?12:(hours+1)%12;
      const endPeriod=(hours+1)<12?'AM':'PM';
      slots.push(`${startHour}:00 ${startPeriod} - ${endHour}:00 ${endPeriod}`)
    }
    return slots;
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 '>
      <form className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h2 className='text-4xl font-semibold text-center text-gray-700 md-6'>Reservation Form</h2>
        <p className='text-lg font-semibold text-center text-gray-400 md-6'>Please Fill out the form below to make a reservation.</p>
        <input className='w-full p-3 mb-4 border rounded-lg focus:ring focus:ring-offset-blue-400'type='name' value={selectedDate.name} onChange={handleChange} placeholder='Full Name' required/>
        <input className='w-full p-3 mb-4 border rounded-lg focus:ring focus:ring-offset-blue-400'type='email' value={selectedDate.email} onChange={handleChange} placeholder='Email Address' required/>
        <input className='w-full p-3 mb-4 border rounded-lg focus:ring focus:ring-offset-blue-400'type='phone' value={selectedDate.phone} onChange={handleChange} placeholder='Phone Number' required/>
        <input className='w-full p-3 mb-4 border rounded-lg focus:ring focus:ring-offset-blue-400'type='date' value={selectedDate.date} onChange={handleChange} required/>
        <select className='w-full p-3 mb-4 border rounded-lg focus:ring focus:ring-offset-blue-400' value={selectedDate.timeSlot} onChange={handleChange} required>
          <option value="">Select Time Slot</option>
          {GenerataTimeSloats().map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>
        <button type='submit' className='w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition duration-300'>Book Now</button>
        
      </form>
    </div>
  )
}

export default ReservationForm
