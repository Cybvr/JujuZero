"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';

export default function NewProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAudience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to an API
    console.log("Form submitted:", formData);
    // For now, let's just redirect to the projects page
    router.push('/dashboard/projects');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => router.back()} 
        variant="ghost" 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Fill in the details to create a new project.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project idea"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Who is this project for?"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Project</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}