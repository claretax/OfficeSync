import React, {useState} from "react";
import axios from 'axios'

function DeadlineExtension({projectId, onExtensionAdded}) {
    const [formData, setFormData] = useState({
        days:"",
        reason:"",
        category:"client_delay"
    })
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const token = localStorage.getItem('token')
        const response =await axios.post(`${import.meta.env.VITE_API_URL}/deadline-extensions`,{...formData, projectId}, {
            headers:{
                'x-auth-token': token
            }
        })
        console.log(response.data)
        if (onExtensionAdded) {
            onExtensionAdded(response.data);
          }
    }

    const handleChange = (e)=>{
        const {name, value} = e.target;
        const data = {...formData, [name]:value}
        setFormData(data)
    }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex justify-start gap-4 items-center mt-4 p-4 bg-white rounded-lg shadow-xl">
        <div className="flex gap-4">
          <div className="flex flex-col justify-between">
            <input
              type="text"
              name="days"
              value={formData.days}
              onChange={handleChange}
              placeholder="Days"
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <textarea
              name="reason"
              rows="1"
              placeholder="reason"
              value={formData.reason}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            ></textarea>
          </div>
        </div>

        <div className="">
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Add Extension
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeadlineExtension;
