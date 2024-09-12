// app/(admin)/admin/HelpPageForm.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

interface HelpPage {
  id: string;
  title: string;
  sortOrder: number;
  categories: string[];
  content: {
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

interface HelpPageFormProps {
  pages: HelpPage[];
  selectedPage: HelpPage | null;
  editedContent: HelpPage;
  allCategories: string[];
  newCategory: string;
  handlePageSelect: (page: HelpPage) => void;
  handleContentChange: (field: keyof HelpPage, value: any) => void;
  handleSectionChange: (index: number, field: string, value: string) => void;
  handleSave: () => Promise<void>;
  handleDeletePage: (pageId: string) => Promise<void>;
  handleDeleteSection: (index: number) => void;
  handleAddCategory: () => void;
  handleSelectCategory: (category: string) => void;
  handleRemoveCategory: (category: string) => void;
  setNewCategory: (category: string) => void;
}

const HelpPageForm: React.FC<HelpPageFormProps> = ({
  pages,
  selectedPage,
  editedContent,
  allCategories,
  newCategory,
  handlePageSelect,
  handleContentChange,
  handleSectionChange,
  handleSave,
  handleDeletePage,
  handleDeleteSection,
  handleAddCategory,
  handleSelectCategory,
  handleRemoveCategory,
  setNewCategory
}) => {
  return (
    <div className="flex space-x-6">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Help Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pages.map(page => (
              <li key={page.id} className="flex justify-between items-center">
                <button onClick={() => handlePageSelect(page)} className="text-blue-500 hover:underline">
                  {page.title}
                </button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}><Trash2 className="h-4 w-4" /></Button>
              </li>
            ))}
          </ul>
          <Button onClick={() => handlePageSelect({ id: '', title: '', sortOrder: 0, categories: [], content: { intro: '', sections: [] } })} className="mt-4" variant="outline"><Plus className="mr-2 h-4 w-4" /> Add New Page</Button>
        </CardContent>
      </Card>
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>{selectedPage ? 'Edit Page' : 'New Page'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={editedContent.title}
            onChange={(e) => handleContentChange('title', e.target.value)}
            className="mb-4"
            placeholder="Page Title"
          />
          <Input
            type="number"
            value={editedContent.sortOrder}
            onChange={(e) => handleContentChange('sortOrder', parseInt(e.target.value))}
            className="mb-4"
            placeholder="Sort Order"
          />
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedContent.categories.map(category => (
                <span key={category} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                  {category}
                  <button onClick={() => handleRemoveCategory(category)} className="ml-1 text-blue-800 hover:text-blue-900">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleSelectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category, index) => (
                    <SelectItem key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Introduction</h4>
            <Editor
              apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3" // Replace with your actual TinyMCE API key
              value={editedContent.content.intro}
              onEditorChange={(content) => handleContentChange('content', { ...editedContent.content, intro: content })}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-4">Sections</h3>
          {editedContent.content.sections.map((section, index) => (
            <Card key={index} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Input
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                  className="font-bold"
                  placeholder="Section Title"
                />
                <div className="flex items-center space-x-2">
                  {index > 0 && (
              <Button variant="ghost" size="sm" onClick={() => handleSectionChange(index, 'order', (index - 1).toString())}><ArrowUp className="h-4 w-4" /></Button>

                  )}
                  {index < editedContent.content.sections.length - 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSectionChange(index, 'order', (index + 1).toString())}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <Editor
                  apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3" // Replace with your actual TinyMCE API key
                  value={section.content}
                  onEditorChange={(content) => handleSectionChange(index, 'content', content)}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Button onClick={() => handleContentChange('content', {
            ...editedContent.content,
            sections: [...editedContent.content.sections, { title: '', content: '' }]
          })} variant="outline" className="mr-2"><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Page</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPageForm;