// File: app/dashboard/projects/components/ProjectInput.tsx
import React, { useState } from 'react';

export default function ProjectInput() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
  });
  const [errors, setErrors] = useState({});
  const [aiPreview, setAiPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Project name is required";
    if (formData.description.length < 10) tempErrors.description = "Description should be at least 10 characters";
    return tempErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      // Here we would typically send the data to an API
      console.log("Form submitted:", formData);
      // For now, let's just update the AI preview
      setAiPreview(`Based on your input, here's how the AI might interpret your project:
      - Name: ${formData.name}
      - Key Elements: ${formData.description.split(' ').slice(0, 5).join(', ')}...
      - Target Audience: ${formData.targetAudience || 'General public'}
      `);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Project Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter project name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Project Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Describe your project idea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetAudience">
            Target Audience (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="targetAudience"
            type="text"
            placeholder="Who is this project for?"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Generate Project
          </button>
        </div>
      </form>
      {aiPreview && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">AI Preview</h3>
          <pre className="whitespace-pre-wrap">{aiPreview}</pre>
        </div>
      )}
    </div>
  );
}