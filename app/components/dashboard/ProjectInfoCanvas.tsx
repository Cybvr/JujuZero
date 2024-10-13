import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import BrandMetrics from "@/components/dashboard/BrandMetrics";
import { Project } from '@/hooks/types';
import { FaBullseye, FaComments, FaPalette, FaChartBar, FaUser, FaPencilAlt } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProjectInfoCanvasProps {
  project: Project;
  updateProject: (updatedProject: Partial<Project>) => void;
}

const ProjectInfoCanvas: React.FC<ProjectInfoCanvasProps> = ({ project, updateProject }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  const handleEdit = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    const updatedProject = { ...project };
    setNestedValue(updatedProject, field, getNestedValue(project, field));
    updateProject(updatedProject);
  };

  const handleChange = (field: string, value: string) => {
    const updatedProject = { ...project };
    setNestedValue(updatedProject, field, value);
    updateProject(updatedProject);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
    lastObj[lastKey!] = value;
  };

  const renderEditableField = (field: string, label: string, multiline = false) => (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}:</label>
      <div className="flex items-center">
        {isEditing[field] ? (
          multiline ? (
            <Textarea
              value={getNestedValue(project, field) || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleSave(field)}
              className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          ) : (
            <Input
              value={getNestedValue(project, field) || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleSave(field)}
              className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )
        ) : (
          <>
            <p className="text-base flex-grow">{getNestedValue(project, field) || `No ${label.toLowerCase()} defined`}</p>
            <button
              onClick={() => handleEdit(field)}
              className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <FaPencilAlt className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full">
      {renderSection("Project Overview", <FaBullseye className="text-blue-500" />, (
        <>
          {renderEditableField('name', 'Project Name')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderEditableField('tagline', 'Tagline')}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Owner:</p>
              <p className="text-base flex items-center gap-2">
                <FaUser className="text-gray-500" /> {user?.displayName || "Unknown"}
              </p>
            </div>
          </div>
        </>
      ))}

      {renderSection("Brand Strategy", <FaBullseye className="text-green-500" />, (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderEditableField('brandStrategy.mission', 'Mission', true)}
          {renderEditableField('brandStrategy.vision', 'Vision', true)}
          {renderEditableField('brandStrategy.targetAudience', 'Target Audience', true)}
          {renderEditableField('brandStrategy.positioning', 'Positioning', true)}
        </div>
      ))}

      {renderSection("Brand Voice", <FaComments className="text-yellow-500" />, (
        <div className="grid grid-cols-1 gap-4">
          {renderEditableField('brandVoice.toneOfVoice', 'Tone of Voice', true)}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Key Messages:</p>
            {project.brandVoice?.keyMessages?.map((message, index) => (
              renderEditableField(`brandVoice.keyMessages.${index}`, `Message ${index + 1}`, true)
            ))}
          </div>
        </div>
      ))}

      {renderSection("Visual Identity", <FaPalette className="text-purple-500" />, (
        <div className="grid grid-cols-1 gap-4">
          {renderEditableField('visualIdentity.logoDescription', 'Logo Description', true)}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Color Palette:</p>
            <div className="flex flex-wrap gap-2">
              {project.visualIdentity?.colorPalette?.map((color, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full mr-2" 
                    style={{ backgroundColor: color }}
                  ></div>
                  {renderEditableField(`visualIdentity.colorPalette.${index}`, `Color ${index + 1}`)}
                </div>
              ))}
            </div>
          </div>
          {renderEditableField('visualIdentity.typography.primary', 'Primary Font')}
          {renderEditableField('visualIdentity.typography.secondary', 'Secondary Font')}
        </div>
      ))}

      {renderSection("Brand Metrics", <FaChartBar className="text-red-500" />, (
        <BrandMetrics
          healthScore={85}
          healthMessage="Your brand is strong. Keep up the good work!"
          achievements={[
            "Social Media Guru",
            "Content Creator",
            "Brand Strategist",
          ]}
          level={3}
          xp={65}
          maxXp={100}
        />
      ))}
    </div>
  );
};

export default ProjectInfoCanvas;