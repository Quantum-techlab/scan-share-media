
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ListData {
  title: string;
  description: string;
  items: any[];
  theme: string;
}

interface QRCodeGeneratorProps {
  listData: ListData;
  onClose: () => void;
  generateUrl: () => string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ listData, onClose, generateUrl }) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [listUrl, setListUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (listData.title) {
      const url = generateUrl();
      setListUrl(url);
      generateQRCode(url);
    }
  }, [listData, generateUrl]);

  const generateQRCode = (url: string) => {
    // Simple QR code generation using a service
    // In a real app, you'd use a proper QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrUrl);
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

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${listData.title || 'list'}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "QR code saved to your device",
      });
    }
  };

  const shareList = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listData.title,
          text: listData.description,
          url: listUrl,
        });
        toast({
          title: "Shared!",
          description: "List shared successfully",
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(listUrl);
      }
    } else {
      copyToClipboard(listUrl);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            Share Your List
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* List Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{listData.title || 'Untitled List'}</h3>
              <p className="text-sm text-gray-600">{listData.description || 'No description'}</p>
              <p className="text-xs text-gray-500 mt-2">{listData.items.length} items</p>
            </CardContent>
          </Card>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Scan this QR code to view your list
              </p>
            </div>
          )}

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={listUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(listUrl)}
                className="flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={downloadQRCode}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR
            </Button>
            <Button
              onClick={shareList}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
