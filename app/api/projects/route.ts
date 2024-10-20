// File: /app/dashboard/projects/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json();

    // Ensure seoInsights field is properly initialized
    const newProject = {
      ...projectData,
      socialMedia: {
        posts: projectData.socialMedia?.posts || [],
      },
      seoInsights: {
        keywords: projectData.seoInsights?.keywords || [], // Ensure keywords is always an array
        metaDescription: projectData.seoInsights?.metaDescription || '', // Ensure metaDescription is always a string
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "projects"), newProject);
    return NextResponse.json({ id: docRef.id, ...newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project", details: error.toString() }, { status: 500 });
  }
}
