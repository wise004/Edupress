import { useState, useEffect } from 'react';
import { Download, Share2, Eye, Award, Calendar, User, CheckCircle, ExternalLink } from 'lucide-react';
import { CertificateAPI } from '../services/api';
import type { Certificate } from '../types/api';

interface CertificateDisplayProps {
  certificateId?: number;
  certificateUrl?: string;
  isPublic?: boolean;
}

interface CertificateListProps {
  userId?: number;
}

// Component for displaying a single certificate
export function CertificateDisplay({ certificateId, certificateUrl, isPublic = false }: CertificateDisplayProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadCertificate();
  }, [certificateId, certificateUrl]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      let certData;
      
      if (isPublic && certificateUrl) {
        certData = await CertificateAPI.getPublicCertificate(certificateUrl);
      } else if (certificateId) {
        certData = await CertificateAPI.getCertificateById(certificateId);
      } else {
        throw new Error('Certificate ID or URL is required');
      }
      
      setCertificate(certData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!certificate) return;

    try {
      setDownloading(true);
      const blob = await CertificateAPI.downloadCertificate(certificate.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (!certificate?.certificateUrl) return;
    
    const shareUrl = `${window.location.origin}/certificates/${certificate.certificateUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.courseName}`,
        text: `Check out my certificate for completing ${certificate.courseName}!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  const openPublicView = () => {
    if (!certificate?.certificateUrl) return;
    
    const publicUrl = `${window.location.origin}/certificates/${certificate.certificateUrl}`;
    window.open(publicUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading certificate...</span>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Award className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Certificate Not Found</h3>
        <p className="text-red-600">{error || 'This certificate could not be found or is no longer available.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
          <Award className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
          <p className="text-blue-100">This is to certify that</p>
        </div>

        {/* Certificate Body */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {certificate.studentName}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">
              {certificate.courseName}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Completion Date</div>
              <div className="text-lg font-semibold">
                {new Date(certificate.completionDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="text-center">
              <User className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Instructor</div>
              <div className="text-lg font-semibold">{certificate.instructorName}</div>
            </div>
            
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-600">Certificate ID</div>
              <div className="text-lg font-semibold font-mono">{certificate.certificateId}</div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              This certificate can be verified by visiting our verification page with the certificate ID.
            </p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            
            {certificate.certificateUrl && (
              <>
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                
                {!isPublic && (
                  <button
                    onClick={openPublicView}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Public View
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for displaying user's certificate list
export function CertificateList({ userId }: CertificateListProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCertificates();
  }, [userId]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const certificatesData = await CertificateAPI.getUserCertificates();
      setCertificates(certificatesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading certificates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
        <p className="text-gray-600">Complete courses to earn certificates and showcase your achievements!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
        <span className="text-gray-600">{certificates.length} certificates earned</span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-yellow-500" />
                <span className="text-xs font-mono text-gray-500">{certificate.certificateId}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {certificate.courseName}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                Instructor: {certificate.instructorName}
              </p>
              
              <p className="text-sm text-gray-500 mb-4">
                Completed {new Date(certificate.completionDate).toLocaleDateString()}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/certificate/${certificate.id}`, '_blank')}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                
                {certificate.certificateUrl && (
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/certificates/${certificate.certificateUrl}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Certificate link copied!');
                    }}
                    className="flex items-center px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificateDisplay;
