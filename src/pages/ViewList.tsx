
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const ViewList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listData, setListData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, this would fetch from an API
      const savedList = localStorage.getItem(`list-${id}`);
      if (savedList) {
        setListData(JSON.parse(savedList));
      }
      setLoading(false);
    }
  }, [id]);

  const shareList = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listData?.title || 'Check out this list',
          text: listData?.description || 'Shared via ScanShare',
          url: url,
        });
        toast({
          title: "Shared!",
          description: "List shared successfully",
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading list...</p>
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">List Not Found</h1>
          <p className="text-gray-600 mb-8">The list you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

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
              onClick={shareList}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button 
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Create Your Own
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {listData.title}
            </h1>
            {listData.description && (
              <p className="text-xl text-gray-600">
                {listData.description}
              </p>
            )}
          </div>

          {/* Items */}
          <div className="space-y-6">
            {listData.items.map((item, index) => (
              <Card key={item.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  {item.type === 'text' && (
                    <div>
                      {item.title && (
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                          {item.title}
                        </h2>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                        {item.content}
                      </p>
                    </div>
                  )}
                  
                  {item.type === 'image' && (
                    <div>
                      {item.title && (
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                          {item.title}
                        </h2>
                      )}
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md">
                        <img
                          src={item.content}
                          alt={item.title || 'Image'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-lg">
                          {item.description}
                        </p>
                      )}
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
                  This list is empty
                </h3>
                <p className="text-gray-500">
                  No items have been added to this list yet.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-12 py-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              Created with ScanShare
            </p>
            <Button 
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Create Your Own List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewList;
