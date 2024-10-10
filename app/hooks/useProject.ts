// app/hooks/useProject.ts

import { useEffect, useReducer } from 'react';
import { Project } from './types';

type ProjectState = {
  project: Project | null;
  loading: boolean;
  error: string | null;
};

type ProjectAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Project }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Project> };

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, project: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_PROJECT':
      return state.project
        ? { ...state, project: { ...state.project, ...action.payload } }
        : state;
    default:
      return state;
  }
};

export const useProject = (projectId: string) => {
  const [state, dispatch] = useReducer(projectReducer, {
    project: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.status}`);
        }
        const projectData: Project = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: projectData });
      } catch (error) {
        console.error("Detailed error fetching project data:", error);
        dispatch({ type: 'FETCH_ERROR', payload: error instanceof Error ? error.message : 'An unknown error occurred' });
      }
    };

    fetchProjectData();
  }, [projectId]);

  const updateProject = (section: keyof Project, data: any) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { [section]: data } });
  };

  const saveProject = async (section: keyof Project) => {
    if (!state.project) {
      console.error('No project data to save');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [section]: state.project[section] }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      console.log(`${section} updated successfully`);
    } catch (error) {
      console.error('Error saving changes:', error);
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to save changes. Please try again.' });
    }
  };

  return { ...state, updateProject, saveProject };
};