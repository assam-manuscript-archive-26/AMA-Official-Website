export const navRoutes = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Collections', href: '/collections', icon: 'Gallery' },
  { label: 'Gallery', href: '/picture-gallery', icon: 'Image' },
  { label: 'Events', href: '/events', icon: 'Calendar' },
  { label: 'Resources', href: '/resources', icon: 'FileText' },
  { label: 'Visit', href: '/visit', icon: 'MapPin' },
  { label: 'Feedback', href: '/feedback', icon: 'MessageSquare' },
  { label: 'About', href: '/about', icon: 'Info' },
];

export const adminNavRoutes = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard', primary: true },
  { label: 'Upload', href: '/admin/upload', icon: 'Upload', primary: true },
  { label: 'Artifacts', href: '/admin/artifacts', icon: 'Image', primary: true },
  { label: 'Feedback', href: '/admin/feedback', icon: 'MessageSquare', primary: true },
  { label: 'Events', href: '/admin/events', icon: 'Calendar' },
  { label: 'News', href: '/admin/news', icon: 'Newspaper' },
  { label: 'Contact', href: '/admin/contact', icon: 'Mail' },
];

export const footerLinks = {
  Collections: ['Browse All', 'By Period', 'By Style'],
  Visit: ['Plan Your Visit', 'Location', 'Hours'],
  About: ['Our Story', 'Satra History', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Use'],
};