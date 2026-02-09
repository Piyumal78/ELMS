import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
    HelpCircle,
    Mail,
    Phone,
    MessageSquare,
    BookOpen,
    Video,
    FileText,
    Send,
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Clock,
    MapPin,
    Globe,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import StudentNavbar from './Student/StudentNavbar';

const HelpSupport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [supportForm, setSupportForm] = useState({
        subject: '',
        message: '',
        category: ''
    });

    // FAQ Data
    const faqs = [
        {
            id: 1,
            question: "How do I enroll in a course?",
            answer: "Navigate to the 'My Labs' section from the navigation bar. Browse available courses and click the 'Enroll' button on your desired course. You'll receive a confirmation once your enrollment is successful.",
            category: "Enrollment"
        },
        {
            id: 2,
            question: "How can I submit my lab reports?",
            answer: "Go to the specific lab session page and look for the 'Submit Report' button. Upload your report file (PDF format recommended) and add any comments. You'll receive an email confirmation upon successful submission.",
            category: "Submissions"
        },
        {
            id: 3,
            question: "Where can I view my grades?",
            answer: "Click on 'Grades' in the main navigation menu. You'll see all your course grades, individual lab scores, and overall performance metrics. Grades are updated within 48 hours of submission review.",
            category: "Grades"
        },
        {
            id: 4,
            question: "How do I book a lab session?",
            answer: "Navigate to 'Lab Booking' from the menu. Select your preferred date, time slot, and lab. Confirm your booking - you'll receive a confirmation email with details. Remember to cancel 24 hours in advance if plans change.",
            category: "Lab Booking"
        },
        {
            id: 5,
            question: "What should I do if I forgot my password?",
            answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and you'll receive password reset instructions. Follow the link in the email to create a new password.",
            category: "Account"
        },
        {
            id: 6,
            question: "How can I contact my instructor?",
            answer: "You can reach your instructor through the 'Announcements' section where you can view their contact information, or use the messaging feature available in each course page.",
            category: "Communication"
        },
        {
            id: 7,
            question: "What file formats are accepted for submissions?",
            answer: "We accept PDF, DOC, DOCX for reports. For code submissions, ZIP files containing your project are preferred. Maximum file size is 50MB per submission.",
            category: "Submissions"
        },
        {
            id: 8,
            question: "How do I update my profile information?",
            answer: "Go to your Profile page and click the 'Edit Profile' button. You can update your contact information, address, and other personal details. Changes are saved immediately.",
            category: "Account"
        }
    ];

    // Quick Links Data
    const quickLinks = [
        {
            title: "User Guide",
            description: "Complete guide to using ELMS",
            icon: BookOpen,
            link: "#",
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Video Tutorials",
            description: "Step-by-step video guides",
            icon: Video,
            link: "#",
            color: "from-purple-500 to-pink-500"
        },
        {
            title: "Documentation",
            description: "Technical documentation",
            icon: FileText,
            link: "#",
            color: "from-orange-500 to-red-500"
        },
        {
            title: "System Status",
            description: "Check service availability",
            icon: Globe,
            link: "#",
            color: "from-green-500 to-teal-500"
        }
    ];

    // Filter FAQs based on search
    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleSupportSubmit = (e) => {
        e.preventDefault();
        // Handle support ticket submission
        console.log('Support ticket submitted:', supportForm);
        alert('Thank you! Your support request has been submitted. We\'ll get back to you within 24 hours.');
        setSupportForm({ subject: '', message: '', category: '' });
    };

    return (
        <div>
            <StudentNavbar />    
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                                <HelpCircle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Help & Support
                            </h1>
                            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're here to help! Find answers to common questions or reach out to our support team.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <Card className="backdrop-blur-sm bg-white/90 border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for help articles, FAQs, or topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-6 text-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <Card
                                    key={index}
                                    className="backdrop-blur-sm bg-white/80 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                                >
                                    <CardContent className="p-6 text-center space-y-3">
                                        <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg">{link.title}</h3>
                                        <p className="text-sm text-gray-600">{link.description}</p>
                                        <ExternalLink className="h-4 w-4 mx-auto text-gray-400 group-hover:text-indigo-500" />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* FAQ Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                                    <CardTitle className="flex items-center gap-2 text-3xl">
                                        <Info className="h-7 w-7 text-blue-600" />
                                        Frequently Asked Questions
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Find quick answers to common questions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-3">
                                    {filteredFaqs.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                            <p>No FAQs found matching your search.</p>
                                        </div>
                                    ) : (
                                        filteredFaqs.map((faq) => (
                                            <div
                                                key={faq.id}
                                                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors"
                                            >
                                                <button
                                                    onClick={() => toggleFaq(faq.id)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-indigo-50/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 text-left">
                                                        <Badge variant="outline" className="text-xs">
                                                            {faq.category}
                                                        </Badge>
                                                        <span className="font-semibold text-gray-800">
                                                            {faq.question}
                                                        </span>
                                                    </div>
                                                    {expandedFaq === faq.id ? (
                                                        <ChevronUp className="h-5 w-5 text-indigo-600" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </button>
                                                {expandedFaq === faq.id && (
                                                    <div className="p-4 bg-indigo-50/30 border-t-2 border-gray-200">
                                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact & Support Form Section */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-purple-600" />
                                        Contact Us
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                                <Mail className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Email</p>
                                                <p className="font-medium text-gray-800">support@elms.edu</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                                <Phone className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Phone</p>
                                                <p className="font-medium text-gray-800">+1 (555) 123-4567</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors">
                                            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Office</p>
                                                <p className="font-medium text-gray-800">Building A, Room 101</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                                            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold">Working Hours</p>
                                                <p className="font-medium text-gray-800">Mon-Fri: 9AM - 5PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Ticket Form */}
                            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10">
                                    <CardTitle className="flex items-center gap-2">
                                        <Send className="h-5 w-5 text-indigo-600" />
                                        Submit a Request
                                    </CardTitle>
                                    <CardDescription>
                                        Can't find what you're looking for?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Category
                                            </label>
                                            <select
                                                value={supportForm.category}
                                                onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                <option value="technical">Technical Issue</option>
                                                <option value="account">Account Problem</option>
                                                <option value="enrollment">Enrollment</option>
                                                <option value="grades">Grades</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Subject
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Brief description of your issue"
                                                value={supportForm.subject}
                                                onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                                                className="border-2 border-gray-200 focus:border-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Message
                                            </label>
                                            <Textarea
                                                placeholder="Describe your issue in detail..."
                                                value={supportForm.message}
                                                onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                                                className="border-2 border-gray-200 focus:border-indigo-500 min-h-[120px]"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold py-6"
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Submit Request
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Response Time Info */}
                            <Card className="backdrop-blur-sm bg-gradient-to-r from-green-50 to-emerald-50 border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">Quick Response</h4>
                                            <p className="text-sm text-gray-600">
                                                Our support team typically responds within 24 hours during business days.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
