import { Download } from 'lucide-react';

const DownloadButton = ({ file }) => {
  return (
    <a
      href={file}
      download
      className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
    >
      <Download className="w-4 h-4" />
      Download Lesson Notes
    </a>
  );
};

export default DownloadButton;
