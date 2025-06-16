
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, X } from 'lucide-react';

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

interface ListPreviewProps {
  listData: ListData;
  onClose: () => void;
}

const ListPreview: React.FC<ListPreviewProps> = ({ listData, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Preview
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
          {/* Mobile Frame */}
          <div className="mx-auto max-w-sm bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              {/* Phone Status Bar */}
              <div className="bg-black text-white text-xs px-4 py-2 flex justify-between items-center">
                <span>9:41</span>
                <span>•••</span>
                <span>100%</span>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4 min-h-[500px] bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {listData.title || 'Untitled List'}
                  </h1>
                  {listData.description && (
                    <p className="text-gray-600 text-sm">
                      {listData.description}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {listData.items.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-gray-500">No items yet</p>
                    </div>
                  ) : (
                    listData.items.map((item, index) => (
                      <Card key={item.id} className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-4">
                          {item.type === 'text' && (
                            <div>
                              {item.title && (
                                <h3 className="font-semibold text-gray-800 mb-2">
                                  {item.title}
                                </h3>
                              )}
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {item.content}
                              </p>
                            </div>
                          )}
                          
                          {item.type === 'image' && (
                            <div>
                              {item.title && (
                                <h3 className="font-semibold text-gray-800 mb-2">
                                  {item.title}
                                </h3>
                              )}
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                                <img
                                  src={item.content}
                                  alt={item.title || 'Image'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {item.description && (
                                <p className="text-gray-600 text-sm">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created with ScanShare
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListPreview;
