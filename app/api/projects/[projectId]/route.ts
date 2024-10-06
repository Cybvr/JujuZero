import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;
  console.log('Fetching project:', projectId);

  try {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      console.log('Project not found');
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectSnap.data();
    console.log('Project data:', projectData);

    return NextResponse.json({ id: projectSnap.id, ...projectData });
  } catch (error) {
    console.error("Detailed error in GET request:", error);
    return NextResponse.json({ error: "Failed to fetch project", details: error.toString() }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  try {
    const updateData = await request.json();
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, updateData);
    return NextResponse.json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  try {
    const projectRef = doc(db, "projects", projectId);
    await deleteDoc(projectRef);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}