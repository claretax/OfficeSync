import React, {useState} from "react";
import axios from 'axios'

function DeadlineExtension({projectId, onExtensionAdded}) {
    const [formData, setFormData] = useState({
        newDeadline:"",
        reason:"",
        category:""
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
      <form onSubmit={handleSubmit} className="flex justify-between mt-4 p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Deadline
            </label>
            <input
              type="date"
              name="newDeadline"
              value={formData.newDeadline}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            />
          </div>

          <div className="flex flex-col justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            >
              <option value="">Select category</option>
              <option value="client_delay">client_delay</option>
              {/* <option value="resource">Resource</option>
          <option value="scope">Scope Change</option>
          <option value="other">Other</option> */}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              name="reason"
              rows="1"
              value={formData.reason}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-300"
              required
            ></textarea>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
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
