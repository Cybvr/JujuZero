// @app/dashboard/page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import {
  FileText,
  Wand2,
  QrCode,
  Image,
  Video,
  FileAudio,
  FileSpreadsheet,
  Crop,
  Stamp,
  PenTool,
  RefreshCw,
  Sparkles,
  FileVideo,
  Plus,
  Rocket,
} from "lucide-react";
import ToolsSearch from "@/components/dashboard/ToolsSearch";

interface Tool {
  name: string;
  slug: string;
  description: string;
  imageSrc: string;
  category: string;
  access: string;
  icon: React.ElementType;
}

interface Item {
  id: string;
  name: string;
  createdAt: { seconds: number; nanoseconds: number };
  type: "project" | "document";
}

const tools: Tool[] = [
  {
    name: "Visual Summarizer",
    slug: "visual-summarizer",
    description:
      "AI generates infographic-like summaries of long articles or reports.",
    imageSrc: "/images/tools/visual-summarizer.png",
    category: "AI-powered",
    access: "free",
    icon: Wand2,
  },
  {
    name: "Simple PDF",
    slug: "simple-pdf",
    description: "Simple tool to edit PDF files",
    imageSrc: "/images/tools/pdf-editor.png",
    category: "Workspace",
    access: "free",
    icon: FileText,
  },
  {
    name: "Invoice Generator",
    slug: "invoice-generator",
    description: "Create professional invoices easily",
    imageSrc: "/images/tools/invoice-generator.png",
    category: "Productivity",
    access: "free",
    icon: FileSpreadsheet,
  },
  {
    name: "Text Behind Image",
    slug: "text-behind-image",
    description: "Add text behind your images",
    imageSrc: "/images/tools/text-behind-image.png",
    category: "Design",
    access: "free",
    icon: Image,
  },
  {
    name: "Video Notes",
    slug: "video-notes",
    description:
      "Generate FAQs, Study Guides, Table of Contents, Timelines, and Briefing Docs from YouTube videos",
    imageSrc: "/images/tools/video-notes.png",
    category: "AI-powered",
    access: "free",
    icon: Video,
  },
  {
    name: "Sketch to Image",
    slug: "sketch-to-image",
    description: "Generate an image from your sketch and description using AI.",
    imageSrc: "/images/tools/sketch-to-image.png",
    category: "AI-powered",
    access: "signin",
    icon: PenTool,
  },
  {
    name: "Uncrop",
    slug: "uncrop",
    description: "Extend or crop your image using AI.",
    imageSrc: "/images/tools/uncrop.png",
    category: "Design",
    access: "signin",
    icon: Crop,
  },
  {
    name: "Image Reimagine",
    slug: "imagine",
    description: "Reimagine your image with AI.",
    imageSrc: "/images/tools/imagine.png",
    category: "AI-powered",
    access: "signin",
    icon: RefreshCw,
  },
  {
    name: "Remove Background",
    slug: "remove-background",
    description: "Remove image backgrounds",
    imageSrc: "/images/tools/2.png",
    category: "Design",
    access: "free",
    icon: Image,
  },
  {
    name: "Compress Image",
    slug: "compress-image",
    description: "Compress images to save space",
    imageSrc: "/images/tools/3.png",
    category: "Design",
    access: "free",
    icon: Image,
  },
  {
    name: "Video to MP4",
    slug: "video-to-mp4",
    description: "Convert videos to MP4 format",
    imageSrc: "/images/tools/video-to-mp4.png",
    category: "Video",
    access: "free",
    icon: FileVideo,
  },
  {
    name: "Audio to MP3",
    slug: "audio-to-mp3",
    description: "Convert audio files to MP3 format.",
    imageSrc: "/images/tools/audio-to-mp3.png",
    category: "Workspace",
    access: "signin",
    icon: FileAudio,
  },
  {
    name: "Document to PDF",
    slug: "document-to-pdf",
    description:
      "Convert documents like Word, Excel, and PowerPoint to PDF format.",
    imageSrc: "/images/tools/document-to-pdf.png",
    category: "Workspace",
    access: "signin",
    icon: FileText,
  },
  {
    name: "Image Crop",
    slug: "image-crop",
    description: "Crop images easily.",
    imageSrc: "/images/tools/crop.png",
    category: "Design",
    access: "premium",
    icon: Crop,
  },
  {
    name: "Add Watermark",
    slug: "add-watermark",
    description: "Add watermark to images.",
    imageSrc: "/images/tools/add-watermark.png",
    category: "Design",
    access: "premium",
    icon: Stamp,
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description: "Create custom QR codes",
    imageSrc: "/images/tools/1.png",
    category: "Productivity",
    access: "free",
    icon: QrCode,
  },
  {
    name: "Paraphraser",
    slug: "paraphraser",
    description: "Rephrase your text using AI.",
    imageSrc: "/images/tools/paraphraser.png",
    category: "AI-powered",
    access: "signin",
    icon: RefreshCw,
  },
  {
    name: "Text Summarizer",
    slug: "text-summarizer",
    description: "Summarize long texts using AI.",
    imageSrc: "/images/tools/text-summarizer.png",
    category: "AI-powered",
    access: "signin",
    icon: Sparkles,
  },
];

const getBackgroundColor = (index: number) => {
  const colors = [
    "#FFA726", // orange
    "#66BB6A", // green
    "#42A5F5", // blue
    "#AB47BC", // purple
    "#FF7043", // deep orange
    "#26A69A", // teal
    "#EF5350", // red
    "#EC407A", // pink
  ];
  return colors[index % colors.length];
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"All" | "Projects" | "Documents">("All");

  useEffect(() => {
    if (user) {
      fetchRecentItems();
    }
  }, [user]);

  const fetchRecentItems = async () => {
    if (!user) return;
    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const documentsQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const [projectsSnapshot, documentsSnapshot] = await Promise.all([
      getDocs(projectsQuery),
      getDocs(documentsQuery),
    ]);
    const projects = projectsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data(), type: "project" }) as Item
    );
    const documents = documentsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          type: "document",
          name: doc.data().title,
        } as Item)
    );
    setRecentItems(
      [...projects, ...documents].sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      )
    );
  };

  const filteredItems = useMemo(() => {
    return recentItems.filter((item) => {
      if (filter === "All") return true;
      if (filter === "Projects") return item.type === "project";
      if (filter === "Documents") return item.type === "document";
      return false;
    });
  }, [recentItems, filter]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-0 lg:px-8 md:px-2 md:px-4 py-4 sm:py-2 md:py-2 lg:py-2">
        <div className="mb-8 p-6 rounded-lg bg-[url('/images/background.png')] bg-cover bg-center text-white shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">👋 Welcome</h1>
          <ToolsSearch />
        </div>

        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-4">
            {tools.map((tool, index) => (
              <Link href={`/dashboard/tools/${tool.slug}`} key={tool.slug}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2`}
                    style={{ backgroundColor: getBackgroundColor(index) }}
                  >
                    <tool.icon className="w-8 h-8 text-white stroke-2" />
                  </div>
                  <span className="text-sm text-center whitespace-nowrap text-foreground">
                    {tool.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {user && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Items
              </h2>
              <div className="flex space-x-2">
                {["All", "Projects", "Documents"].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setFilter(option as "All" | "Projects" | "Documents")}
                    variant={filter === option ? "default" : "outline"}
                    size="sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 bg-card"
                  onClick={() =>
                    router.push(
                      `/dashboard/${item.type}s/${
                        item.type === "document" ? "edit/" : ""
                      }${item.id}`
                    )
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center text-card-foreground">
                      {item.type === "document" ? (
                        <FileText className="mr-2" />
                      ) : (
                        <Rocket className="mr-2" />
                      )}
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} •{" "}
                      Created: {" "}
                      {new Date(
                        item.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                onClick={() => router.push("/dashboard/projects/new")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-3 w-3" /> New Project
              </Button>
              <Button
                onClick={() => router.push("/dashboard/documents/new")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-3 w-3" /> New Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}