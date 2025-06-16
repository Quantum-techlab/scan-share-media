
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, ArrowUp, ArrowDown, Upload, Eye, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import ListPreview from '@/components/ListPreview';

interface ListItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'file';
  content: string;
  title?: string;
  description?: string;
}

interface ListData {
  title: string;
  description: string;
  items: ListItem[];
  theme: string;
}

const CreateList = () => {
  const navigate = useNavigate();
  const [listData, setListData] = useState<ListData>({
    title: '',
    description: '',
    items: [],
    theme: 'default'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const addTextItem = () => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      title: '',
      description: ''
    };
    setListData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const addImageItem = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newItem: ListItem = {
            id: Date.now().toString(),
            type: 'image',
            content: e.target?.result as string,
            title: file.name,
            description: ''
          };
          setListData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateItem = (id: string, field: keyof ListItem, value: string) => {
    setListData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteItem = (id: string) => {
    setListData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setListData(prev => {
      const items = [...prev.items];
      const index = items.findIndex(item => item.id === id);
      if (
        (direction === 'up' && index > 0) ||
        (direction === 'down' && index < items.length - 1)
      ) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [items[index], items[newIndex]] = [items[newIndex], items[index]];
      }
      return { ...prev, items };
    });
  };

  const generateListUrl = () => {
    const listId = Date.now().toString();
    // In a real app, this would save to a database
    localStorage.setItem(`list-${listId}`, JSON.stringify(listData));
    return `${window.location.origin}/list/${listId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            <span 
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            >
              ScanShare
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button 
              onClick={() => setShowQRCode(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Generate QR Code
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* List Info */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Title
                </label>
                <Input
                  value={listData.title}
                  onChange={(e) => setListData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your list title..."
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  value={listData.description}
                  onChange={(e) => setListData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your list..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Add Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={addTextItem}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                >
                  <span className="text-lg">📝</span>
                  Add Text
                </Button>
                <Button
                  onClick={addImageItem}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
                >
                  <Upload className="w-4 h-4" />
                  Add Image
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                  disabled
                >
                  <span className="text-lg">🎥</span>
                  Add Video <span className="text-xs text-gray-500">(Coming Soon)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* List Items */}
          <div className="space-y-4">
            {listData.items.map((item, index) => (
              <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Item {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === listData.items.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {item.type === 'text' && (
                    <div className="space-y-4">
                      <Input
                        value={item.title || ''}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        placeholder="Item title..."
                        className="font-semibold"
                      />
                      <Textarea
                        value={item.content}
                        onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                        placeholder="Enter your text content..."
                        rows={4}
                      />
                    </div>
                  )}

                  {item.type === 'image' && (
                    <div className="space-y-4">
                      <Input
                        value={item.title || ''}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        placeholder="Image caption..."
                        className="font-semibold"
                      />
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.content}
                          alt={item.title || 'Uploaded image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Image description (optional)..."
                        rows={2}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {listData.items.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Your list is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Start adding items to create your multimedia list
                </p>
                <Button
                  onClick={addTextItem}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ListPreview
          listData={listData}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeGenerator
          listData={listData}
          onClose={() => setShowQRCode(false)}
          generateUrl={generateListUrl}
        />
      )}
    </div>
  );
};

export default CreateList;
