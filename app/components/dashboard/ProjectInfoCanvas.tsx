'use client';

import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { FaBullseye, FaComments, FaPalette, FaChartBar, FaPencilAlt, FaSearch, FaHashtag } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BrandMetrics from "@/components/dashboard/BrandMetrics";
import { Project } from '@/hooks/types';

interface ProjectInfoCanvasProps {
  project: Project;
  updateProject: (updatedProject: Partial<Project>) => void;
}

export default function ProjectInfoCanvas({ project, updateProject }: ProjectInfoCanvasProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'social'>('overview');

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
      <label className="text-sm font-medium text-foreground mb-1 block">{label}:</label>
      <div className="flex items-center">
        {isEditing[field] ? (
          multiline ? (
            <Textarea
              value={getNestedValue(project, field) || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleSave(field)}
              className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              rows={3}
            />
          ) : (
            <Input
              value={getNestedValue(project, field) || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleSave(field)}
              className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            />
          )
        ) : (
          <>
            <p className="text-base flex-grow text-foreground">{getNestedValue(project, field) || `No ${label.toLowerCase()} defined`}</p>
            <button
              onClick={() => handleEdit(field)}
              className="ml-2 text-primary hover:text-primary-foreground transition-colors duration-200"
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
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground border-b pb-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {renderSection("Project Overview", <FaBullseye className="text-primary" />, (
              <>
                {renderEditableField('name', 'Project Name')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderEditableField('tagline', 'Tagline')}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Owner:</p>
                    <p className="text-base flex items-center gap-2 text-foreground">
                      <FaPencilAlt className="text-muted-foreground" /> {user?.displayName || "Unknown"}
                    </p>
                  </div>
                </div>
              </>
            ))}

            {renderSection("Brand Strategy", <FaBullseye className="text-accent-foreground" />, (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField('brandStrategy.mission', 'Mission', true)}
                {renderEditableField('brandStrategy.vision', 'Vision', true)}
                {renderEditableField('brandStrategy.targetAudience', 'Target Audience', true)}
                {renderEditableField('brandStrategy.positioning', 'Positioning', true)}
              </div>
            ))}

            {renderSection("Brand Voice", <FaComments className="text-secondary-foreground" />, (
              <div className="grid grid-cols-1 gap-4">
                {renderEditableField('brandVoice.toneOfVoice', 'Tone of Voice', true)}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Key Messages:</p>
                  {project.brandVoice?.keyMessages?.map((message, index) => (
                    renderEditableField(`brandVoice.keyMessages.${index}`, `Message ${index + 1}`, true)
                  ))}
                </div>
              </div>
            ))}

            {renderSection("Visual Identity", <FaPalette className="text-muted-foreground" />, (
              <div className="grid grid-cols-1 gap-4">
                {renderEditableField('visualIdentity.logoDescription', 'Logo Description', true)}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Color Palette:</p>
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

            {renderSection("Brand Metrics", <FaChartBar className="text-destructive" />, (
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
          </>
        );
      case 'seo':
        return (
          <div className="space-y-4">
            {renderSection("SEO Insights", <FaSearch className="text-primary" />, (
              <>
                <div>
                  <p className="font-medium text-foreground">Keywords:</p>
                  {project.seoInsights?.keywords && project.seoInsights.keywords.length > 0 ? (
                    project.seoInsights.keywords.map((keyword, index) => (
                      <p key={index} className="text-foreground">
                        {keyword.keyword} - Search Volume: {keyword.volume} - Difficulty: {keyword.difficulty}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No keywords available</p>
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Meta Description:</p>
                  <p className="text-foreground">{project.seoInsights?.metaDescription || 'No meta description available.'}</p>
                </div>
              </>
            ))}
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            {renderSection("Social Media Posts", <FaHashtag className="text-primary" />, (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.socialMedia?.posts?.map((post, index) => (
                  <div key={index} className="bg-background p-4 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      {post.platform === 'Twitter' && <FaHashtag className="text-twitter mr-2" />}
                      {post.platform === 'Facebook' && <FaHashtag className="text-facebook mr-2" />}
                      <p className="text-xl font-semibold text-foreground">{post.platform}</p>
                    </div>
                    <p className="mb-2 text-foreground"><strong>Post:</strong> {post.post}</p>
                    <p className="mb-2 text-primary-foreground">
                      <strong>Hashtags:</strong> {post.hashtags?.map((tag, i) => (
                        <span key={i} className="mr-2 text-secondary-foreground">#{tag}</span>
                      ))}
                    </p>
                    <p className="text-accent-foreground"><strong>CTA:</strong> {post.cta}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaBullseye /> },
    { id: 'seo', label: 'SEO Insights', icon: <FaSearch /> },
    { id: 'social', label: 'Social Media Content', icon: <FaHashtag /> },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap mb-6 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'seo' | 'social')}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors duration-200 flex-grow sm:flex-grow-0 ${
              activeTab === tab.id
                ? `bg-primary text-primary-foreground`
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <div className={`text-2xl mb-2 ${activeTab === tab.id ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>
              {tab.icon}
            </div>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8 w-full text-card-foreground">
        {renderTabContent()}
      </div>
    </div>
  );
}