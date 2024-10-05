// components/ui/SamplePrompts.tsx
"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Feather, Lightbulb, GraduationCap } from 'lucide-react';

interface SamplePromptsProps {
  onSelectPrompt: (text: string) => void;
}

const samplePrompts = [
  {
    icon: <Feather className="w-6 h-6 text-purple-400" />,
    title: "Summarize research paper",
    fullText: "Create a visual summary of this research paper's key findings: 'The Impact of Artificial Intelligence on Climate Change Mitigation Strategies' by Dr. Jane Smith et al. The paper discusses how AI can be used to optimize renewable energy systems, improve climate modeling accuracy, and enhance energy efficiency in various sectors. It presents case studies from smart grid implementations in Europe and predictive maintenance systems in wind farms. The conclusion emphasizes the potential of AI to reduce global carbon emissions by 4% by 2030 if widely adopted across industries. Please highlight the main AI applications discussed, their potential impact on emissions reduction, and any challenges or limitations mentioned in the paper."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
    title: "Condense meeting notes",
    fullText: "Turn these meeting notes into a visual summary for easy reference: 'Q3 Product Strategy Meeting - July 15, 2024. Attendees: Marketing, Engineering, and Sales teams. Key Points Discussed: 1) Launch of new mobile app features including AI-powered personalization and voice commands. Target release date: September 1st. 2) Pricing strategy revision - considering a new tiered model to attract small business customers. Decision pending market research results due August 1st. 3) Customer feedback analysis revealed high demand for improved data visualization tools. Engineering to prioritize this in Q4 roadmap. 4) Sales team reported 20% increase in enterprise client inquiries. Need to enhance onboarding process to handle increased volume. 5) Marketing presented new brand guidelines and social media strategy focusing on user-generated content. Action Items: Engineering to provide timeline for data viz tools by July 25th. Sales to draft proposal for streamlined onboarding by August 5th. Marketing to begin new social media campaign on August 15th. Next meeting scheduled for August 20th to finalize Q4 strategy.' Please create a visual representation that clearly shows the main discussion points, decisions made, action items, and their respective deadlines."
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
    title: "Visualize project timeline",
    fullText: "Generate a visual timeline from this project brief: 'Green City Initiative - 2025 Sustainability Project. Objective: Transform downtown area into a model of urban sustainability. Key Phases: 1) Planning and Community Engagement (Jan-Mar 2025): Conduct town halls, surveys, and form citizen advisory committee. 2) Infrastructure Assessment (Apr-May 2025): Evaluate current energy systems, water management, and transportation networks. 3) Design and Approval (Jun-Aug 2025): Develop detailed plans for green spaces, energy-efficient buildings, and sustainable transportation solutions. Submit for city council approval by August 15th. 4) Implementation Phase I (Sep-Dec 2025): Begin construction of bike lanes, installation of solar panels on public buildings, and upgrading of water recycling systems. 5) Public Education Campaign (Oct-Dec 2025): Launch awareness programs about new sustainability features and how citizens can contribute. 6) Evaluation and Adjustment (Dec 2025): Assess Phase I results, gather public feedback, and adjust plans for Phase II. Key Milestones: Community Engagement Report due March 31st, 2025. Final Design Presentation to City Council on August 1st, 2025. Ribbon Cutting for First Completed Green Space on November 15th, 2025. Year-End Progress Report and Phase II Proposal due December 31st, 2025.' Please create a visual timeline that clearly shows the project phases, their durations, key activities within each phase, and important milestones."
  }
];

const SamplePrompts: React.FC<SamplePromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {samplePrompts.map((prompt, index) => (
        <Card 
          key={index} 
          className="bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
          onClick={() => onSelectPrompt(prompt.fullText)}
        >
          <CardContent className="p-4 flex flex-col items-start">
            {prompt.icon}
            <h3 className="text-gray-300 mt-2 mb-1">{prompt.title}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SamplePrompts;