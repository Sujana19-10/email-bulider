import React, { useState } from 'react';
import { Mail, Calendar, Clock, MapPin, User, Upload, Download, MoveUp, MoveDown, Type, AlignLeft, AlignCenter, AlignRight, Briefcase, Building2 } from 'lucide-react';

interface TextStyle {
  color: string;
  fontSize: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
}

interface Section {
  id: string;
  type: 'subject' | 'greeting' | 'content' | 'closing' | 'signature';
  content: string;
  style: TextStyle;
}

interface EmailTemplate {
  type: 'meeting' | 'proposal' | 'followup' | 'introduction' | 'custom';
  subject: string;
  recipientName: string;
  recipientRole: string;
  senderName: string;
  senderRole: string;
  companyName: string;
  headerImage: string;
  sections: Section[];
}

const defaultTextStyle: TextStyle = {
  color: '#374151',
  fontSize: '16px',
  align: 'left',
  bold: false,
};

const emailTemplates = {
  meeting: {
    subject: 'Meeting Request: [Topic] Discussion',
    greeting: 'Dear [Name],',
    content: 'I hope this email finds you well. I would like to schedule a meeting to discuss [topic]. Your insights would be valuable for our upcoming project.',
    closing: 'Looking forward to your response.',
    signature: 'Best regards,'
  },
  proposal: {
    subject: 'Business Proposal: [Project Name]',
    greeting: 'Dear [Name],',
    content: 'I am writing to present a proposal regarding [project]. Our team has developed a comprehensive solution that addresses your specific needs.',
    closing: 'I look forward to discussing this proposal in detail.',
    signature: 'Kind regards,'
  },
  followup: {
    subject: 'Follow-up: [Previous Meeting/Discussion]',
    greeting: 'Hi [Name],',
    content: 'I wanted to follow up on our previous discussion about [topic]. Have you had a chance to review the information we discussed?',
    closing: 'Thank you for your time.',
    signature: 'Best,'
  },
  introduction: {
    subject: 'Introduction: [Your Company] Services',
    greeting: 'Dear [Name],',
    content: 'I am reaching out to introduce [Company Name] and our services. We specialize in [industry/service] and have helped many businesses like yours achieve their goals.',
    closing: 'I would welcome the opportunity to discuss how we can help your business.',
    signature: 'Warm regards,'
  }
};

function App() {
  const [emailData, setEmailData] = useState<EmailTemplate>({
    type: 'meeting',
    subject: 'Meeting Request: Quarterly Review Discussion',
    recipientName: 'John Smith',
    recipientRole: 'Project Manager',
    senderName: 'Sarah Wilson',
    senderRole: 'Business Development Manager',
    companyName: 'Tech Solutions Inc.',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        id: '1',
        type: 'subject',
        content: 'Meeting Request: Quarterly Review Discussion',
        style: { ...defaultTextStyle, fontSize: '18px', bold: true },
      },
      {
        id: '2',
        type: 'greeting',
        content: 'Dear John,',
        style: defaultTextStyle,
      },
      {
        id: '3',
        type: 'content',
        content: 'I hope this email finds you well. I would like to schedule a meeting to discuss our quarterly review. Your insights would be valuable for our upcoming planning phase.',
        style: defaultTextStyle,
      },
      {
        id: '4',
        type: 'closing',
        content: 'Looking forward to your response.',
        style: defaultTextStyle,
      },
      {
        id: '5',
        type: 'signature',
        content: 'Best regards,\nSarah Wilson\nBusiness Development Manager\nTech Solutions Inc.',
        style: defaultTextStyle,
      },
    ],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleTemplateChange = (type: EmailTemplate['type']) => {
    const template = emailTemplates[type];
    if (!template) return;

    const newSections = [
      {
        id: '1',
        type: 'subject',
        content: template.subject,
        style: { ...defaultTextStyle, fontSize: '18px', bold: true },
      },
      {
        id: '2',
        type: 'greeting',
        content: template.greeting.replace('[Name]', emailData.recipientName),
        style: defaultTextStyle,
      },
      {
        id: '3',
        type: 'content',
        content: template.content,
        style: defaultTextStyle,
      },
      {
        id: '4',
        type: 'closing',
        content: template.closing,
        style: defaultTextStyle,
      },
      {
        id: '5',
        type: 'signature',
        content: `${template.signature}\n${emailData.senderName}\n${emailData.senderRole}\n${emailData.companyName}`,
        style: defaultTextStyle,
      },
    ];

    setEmailData({
      ...emailData,
      type,
      sections: newSections,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
      sections: emailData.sections.map(section => {
        if (section.type === 'greeting') {
          return {
            ...section,
            content: section.content.replace(emailData.recipientName, value),
          };
        }
        if (section.type === 'signature') {
          return {
            ...section,
            content: section.content.replace(emailData.senderName, value),
          };
        }
        return section;
      }),
    });
  };

  const handleSectionMove = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = emailData.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === emailData.sections.length - 1)
    ) {
      return;
    }

    const newSections = [...emailData.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];

    setEmailData({
      ...emailData,
      sections: newSections,
    });
  };

  const handleSectionContentChange = (sectionId: string, content: string) => {
    setEmailData({
      ...emailData,
      sections: emailData.sections.map(section =>
        section.id === sectionId ? { ...section, content } : section
      ),
    });
  };

  const handleStyleChange = (sectionId: string, styleKey: keyof TextStyle, value: string | boolean) => {
    setEmailData({
      ...emailData,
      sections: emailData.sections.map(section =>
        section.id === sectionId
          ? { ...section, style: { ...section.style, [styleKey]: value } }
          : section
      ),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmailData({
          ...emailData,
          headerImage: reader.result as string
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image handling failed:', error);
      alert('Failed to process image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    try {
      const templateString = JSON.stringify(emailData, null, 2);
      const blob = new Blob([templateString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert('Template configuration saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadHTML = async () => {
    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${emailData.subject}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }
    .email-content { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .signature { border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px; }
    ${emailData.sections.map(section => `
      .section-${section.id} {
        color: ${section.style.color};
        font-size: ${section.style.fontSize};
        text-align: ${section.style.align};
        font-weight: ${section.style.bold ? 'bold' : 'normal'};
        margin-bottom: 1em;
      }
    `).join('\n')}
  </style>
</head>
<body>
  <div class="container">
    <img src="${emailData.headerImage}" alt="Header" class="header-image">
    <div class="email-content">
      ${emailData.sections.map(section => `
        <div class="section-${section.id}">
          ${section.content.replace(/\n/g, '<br>')}
        </div>
      `).join('\n')}
    </div>
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'business-email.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Business Email Builder</h2>
              <div className="space-x-2">
                <button
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
                <button
                  onClick={handleDownloadHTML}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Download className="w-4 h-4 inline-block mr-2" />
                  Export HTML
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Template Type
                </label>
                <select
                  value={emailData.type}
                  onChange={(e) => handleTemplateChange(e.target.value as EmailTemplate['type'])}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="meeting">Meeting Request</option>
                  <option value="proposal">Business Proposal</option>
                  <option value="followup">Follow-up</option>
                  <option value="introduction">Introduction</option>
                  <option value="custom">Custom Template</option>
                </select>
              </div>

              {/* Sender & Recipient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recipient Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="recipientName"
                          value={emailData.recipientName}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Role
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="recipientRole"
                          value={emailData.recipientRole}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sender Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="senderName"
                          value={emailData.senderName}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Role
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="senderRole"
                          value={emailData.senderRole}
                          onChange={handleInputChange}
                          className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="companyName"
                    value={emailData.companyName}
                    onChange={handleInputChange}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Header Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                      isUploading ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isUploading ? (
                      <span className="text-gray-500">Uploading...</span>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">
                          Click to upload header image
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Email Sections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Content</h3>
                {emailData.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`border rounded-lg p-4 ${
                      selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{section.type}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSectionMove(section.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSectionMove(section.id, 'down')}
                          disabled={index === emailData.sections.length - 1}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={section.content}
                      onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={section.type === 'content' ? 4 : 2}
                    />

                    {selectedSection === section.id && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4">
                          <input
                            type="color"
                            value={section.style.color}
                            onChange={(e) => handleStyleChange(section.id, 'color', e.target.value)}
                            className="w-8 h-8"
                          />
                          <select
                            value={section.style.fontSize}
                            onChange={(e) => handleStyleChange(section.id, 'fontSize', e.target.value)}
                            className="border rounded p-1"
                          >
                            <option value="14px">Small</option>
                            <option value="16px">Medium</option>
                            <option value="20px">Large</option>
                            <option value="24px">Extra Large</option>
                          </select>
                          <div className="flex border rounded">
                            <button
                              onClick={() => handleStyleChange(section.id, 'align', 'left')}
                              className={`p-1 ${section.style.align === 'left' ? 'bg-gray-200' : ''}`}
                            >
                              <AlignLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStyleChange(section.id, 'align', 'center')}
                              className={`p-1 ${section.style.align === 'center' ? 'bg-gray-200' : ''}`}
                            >
                              <AlignCenter className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStyleChange(section.id, 'align', 'right')}
                              className={`p-1 ${section.style.align === 'right' ? 'bg-gray-200' : ''}`}
                            >
                              <AlignRight className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleStyleChange(section.id, 'bold', !section.style.bold)}
                            className={`p-1 border rounded ${section.style.bold ? 'bg-gray-200' : ''}`}
                          >
                            <Type className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Email Preview</h2>
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="max-w-2xl mx-auto space-y-6">
                <img
                  src={emailData.headerImage}
                  alt="Header"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                
                {emailData.sections.map(section => (
                  <div
                    key={section.id}
                    style={{
                      color: section.style.color,
                      fontSize: section.style.fontSize,
                      textAlign: section.style.align,
                      fontWeight: section.style.bold ? 'bold' : 'normal',
                    }}
                  >
                    {section.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;