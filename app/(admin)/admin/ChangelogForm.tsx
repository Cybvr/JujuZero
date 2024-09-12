import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, X } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE Editor
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChangelogEntry {
  id: string;
  name: string;
  categories: string[];
  content: string;
  images: string[];
  isPublished: boolean;
  updatedAt: Timestamp;
}

interface ChangelogFormProps {
  changelogEntries: ChangelogEntry[];
  selectedChangelogEntry: ChangelogEntry | null;
  editedChangelogEntry: ChangelogEntry;
  handleChangelogEntrySelect: (entry: ChangelogEntry | null) => void;
  handleChangelogEntryChange: (field: keyof ChangelogEntry, value: any) => void;
  handleChangelogImageUpload: (file: File) => Promise<void>;
  handleChangelogSave: () => Promise<void>;
  handleChangelogDelete: (entryId: string) => Promise<void>;
}

const ChangelogForm: React.FC<ChangelogFormProps> = ({
  changelogEntries,
  selectedChangelogEntry,
  editedChangelogEntry,
  handleChangelogEntrySelect,
  handleChangelogEntryChange,
  handleChangelogImageUpload,
  handleChangelogSave,
  handleChangelogDelete
}) => {
  const formatDate = (date: Timestamp): string => {
    return date.toDate().toLocaleDateString();
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...editedChangelogEntry.images];
    newImages.splice(index, 1);
    handleChangelogEntryChange('images', newImages);
  };

  return (
    <div className="flex space-x-6">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Changelog Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {changelogEntries.map(entry => (
              <li key={entry.id} className="flex justify-between items-center">
                <button onClick={() => handleChangelogEntrySelect(entry)} className="text-blue-500 hover:underline">
                  {entry.name} - {formatDate(entry.updatedAt)}
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this changelog entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The entry "{entry.name}" will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleChangelogDelete(entry.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
          <Button onClick={() => handleChangelogEntrySelect(null)} className="mt-4" variant="outline"><Plus className="mr-2 h-4 w-4" /> Add New Entry</Button>
        </CardContent>
      </Card>
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>{selectedChangelogEntry ? 'Edit Changelog Entry' : 'New Changelog Entry'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={editedChangelogEntry.name}
            onChange={(e) => handleChangelogEntryChange('name', e.target.value)}
            className="mb-4"
            placeholder="Name"
          />
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Categories</h4>
            <Input
              value={editedChangelogEntry.categories.join(', ')}
              onChange={(e) => handleChangelogEntryChange('categories', e.target.value.split(',').map(cat => cat.trim()))}
              placeholder="Enter categories separated by commas"
            />
          </div>
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Content</h4>
            <Editor
              apiKey="s2a631sfb5156httfdykdsiodaya9sij4sljhy2frrh10zb3" // Replace with your actual TinyMCE API key
              value={editedChangelogEntry.content}
              onEditorChange={(content) => handleChangelogEntryChange('content', content)}
              init={{
                // selector: 'textarea',  // This is not strictly necessary for React, but doesn't hurt
                width: '100%',
                height: 500,
                plugins: [
                  'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
                  'searchreplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
                  'table', 'emoticons', 'help'
                ],
                toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
                  'forecolor backcolor emoticons | help',
                menu: {
                  favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons' }
                },
                menubar: 'favs file edit view insert format tools table help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
              }}
            />
          </div>
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Images</h4>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleChangelogImageUpload(e.target.files[0])}
              className="mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {editedChangelogEntry.images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Changelog Image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => handleImageRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={editedChangelogEntry.isPublished}
              onChange={(e) => handleChangelogEntryChange('isPublished', e.target.checked)}
              className="mr-2"
            />
            Published
          </label>
          <Button onClick={handleChangelogSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangelogForm;