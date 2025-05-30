
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Copy, 
  ExternalLink, 
  Flag, 
  QrCode,
  Phone, 
  Mail, 
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
  MapPin
} from "lucide-react";
import WhatsappIcon from "./icons/WhatsappIcon";
import { type NGO } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface ExtensionDemoProps {
  ngo?: NGO;
  isOpen?: boolean;
  onClose?: () => void;
}

const ExtensionDemo: React.FC<ExtensionDemoProps> = ({ 
  ngo,
  isOpen = true, 
  onClose 
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Reset loading states when a new NGO is loaded
  useEffect(() => {
    console.log("ExtensionDemo - NGO data:", ngo);
    setQrLoaded(false);
    setLogoLoaded(false);
  }, [ngo]);

  // If no NGO data is provided, use a fallback
  const ngoData = ngo || {
    id: "mock",
    name: "Children First Foundation",
    logo: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=100&auto=format&fit=crop",
    upiId: "childrenfirst@ybl",
    phone: "+91-9876543210",
    email: "donate@childrenfirst.org",
    website: "https://childrenfirst.org",
    coverImage: "https://source.unsplash.com/random/800x600/?charity",
    verified: true,
    category: "Children",
    location: "Mumbai, India",
    images: [],
    foundedYear: 2010,
    totalRaised: 5000000,
    supporters: 2500,
    trustScore: 92,
    regNumber: "NGO12345",
    description: "A mock NGO description",
    achievements: [],
    team: []
  };

  const handleCopy = (text: string, type: string) => {
    if (!text) {
      toast.error(`No ${type} available to copy`);
      return;
    }
    
    navigator.clipboard.writeText(text);
    setCopied(type);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
    
    toast.success(`${type} copied to clipboard!`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = ngoData.phone?.replace(/[^0-9]/g, '');
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleViewOnCare4All = () => {
    if (ngo) {
      onClose?.();
    } else {
      toast.success('Redirecting to NGO profile on Care4All');
    }
  };

  const handleReportInfo = () => {
    toast.success('Report submitted. Our team will review the information.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <Card className="w-full max-w-[350px] shadow-lg border-2 relative bg-gray-900 text-white dark:bg-gray-900">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <CardHeader className="border-b border-gray-700 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-800 relative">
              {!logoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
              )}
              <img 
                src={ngoData.logo} 
                alt={`${ngoData.name} logo`} 
                className={`h-full w-full object-cover ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLogoLoaded(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/252525/64748b?text=Logo";
                  setLogoLoaded(true);
                }}
              />
            </div>
            <div>
              <CardTitle className="text-base font-medium text-white">
                {ngoData.name}
              </CardTitle>
              {ngoData.verified && (
                <Badge className="bg-green-600 text-white mt-1 text-xs">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Verified on Care4All
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-4 pb-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1 text-gray-300">
              <QrCode className="h-4 w-4 text-gray-400" />
              QR Code for UPI Donation
            </h3>
            <div className="flex justify-center">
              <div className="border border-gray-700 p-2 rounded-md bg-white relative" style={{ minHeight: "134px" }}>
                {!qrLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                  </div>
                )}
                {/* Generate QR code based on UPI ID */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${ngoData.upiId || 'example@upi'}`} 
                  alt="UPI QR Code" 
                  className={`w-[130px] h-[130px] ${qrLoaded ? 'opacity-100' : 'opacity-0'}`} 
                  onLoad={() => setQrLoaded(true)}
                  onError={() => setQrLoaded(true)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">UPI ID</h3>
            <div className="flex">
              <Input 
                value={ngoData.upiId || 'Not available'} 
                readOnly 
                className="rounded-r-none bg-gray-800 border-gray-700 text-white"
              />
              <Button 
                variant="secondary" 
                size="sm"
                className="rounded-l-none bg-gray-700 hover:bg-gray-600"
                onClick={() => handleCopy(ngoData.upiId || "", "UPI ID")}
                disabled={!ngoData.upiId}
              >
                {copied === "UPI ID" ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">Contact Info</h3>
            <div className="space-y-2">
              {ngoData.phone ? (
                <div className="flex items-center">
                  <div className="flex gap-2 items-center flex-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-200">{ngoData.phone}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-gray-700 bg-transparent hover:bg-gray-800"
                      onClick={handleWhatsApp}
                    >
                      <WhatsappIcon className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-gray-700 bg-transparent hover:bg-gray-800"
                      onClick={() => handleCopy(ngoData.phone || "", "Phone")}
                    >
                      {copied === "Phone" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-200" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex gap-2 items-center flex-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Phone not available</span>
                  </div>
                </div>
              )}
              
              {ngoData.email ? (
                <div className="flex items-center">
                  <div className="flex gap-2 items-center flex-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-200">{ngoData.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 border-gray-700 bg-transparent hover:bg-gray-800"
                    onClick={() => handleCopy(ngoData.email || "", "Email")}
                  >
                    {copied === "Email" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-200" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="flex gap-2 items-center flex-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Email not available</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <div className="flex gap-2 items-center flex-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-200">{ngoData.location || 'Location not available'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-2">
            {ngo ? (
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                asChild
              >
                <Link to={`/ngo/${ngo.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Care4All
                </Link>
              </Button>
            ) : (
              <Button 
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                onClick={handleViewOnCare4All}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Care4All
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full border-gray-700 bg-transparent hover:bg-gray-800 text-red-400 hover:text-red-300"
              onClick={handleReportInfo}
            >
              <Flag className="mr-2 h-4 w-4" />
              Report Incorrect Information
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center pt-2">
            Powered by Care4All NGO Analyzer
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionDemo;
