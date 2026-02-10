import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Loader2, Download, FileText, Globe, Copy, Check } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './App.css';

interface NoteResponse {
  status: string;
  markdown: string;
  filename: string;
  message?: string;
}

interface FormData {
  title: string;
  transcript: string;
  language: string;
}

function App() {
  const {
    register,
    handleSubmit: handleSubmitForm,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      transcript: '',
      language: 'English',
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError('');
    setStatus('Generating notes...');
    setMarkdown('');

    try {
      let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      if (baseUrl && !baseUrl.startsWith('http')) {
        baseUrl = `https://${baseUrl}`;
      }
      const response = await fetch(`${baseUrl}/generate-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData: NoteResponse = await response.json();

      if (response.ok) {
        setMarkdown(responseData.markdown);
        setFilename(responseData.filename || `${data.title}.md`);
        setStatus('Notes generated successfully!');
      } else {
        setError(responseData.message || 'An error occurred');
        setStatus('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setIsPdfGenerating(true);

    const element = contentRef.current;
    const clone = element.cloneNode(true) as HTMLElement;
    clone.className = 'markdown-body pdf-content';

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: filename.replace('.md', '.pdf') || 'notes.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AI Transcript Note Generator</h1>
        <p className="subtitle">Convert your transcripts into structured Markdown notes using AI</p>
      </header>

      <main>
        <section className="card form-section">
          <form onSubmit={handleSubmitForm(onSubmit)}>
            <div className="form-group">
              <label htmlFor="title">
                <FileText size={16} /> Note Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., SQL Basics Part 1"
              />
              {errors.title && <span className="error-text">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="language">
                <Globe size={16} /> Target Language
              </label>
              <input
                type="text"
                id="language"
                {...register("language")}
                placeholder="e.g., Traditional Chinese, English, Spanish"
              />
              <p className="helper-text">Specify the language you want the notes to be generated in.</p>
            </div>

            <div className="form-group">
              <label htmlFor="transcript">
                <FileText size={16} /> Transcript Content
              </label>
              <textarea
                id="transcript"
                {...register("transcript", { required: "Transcript is required" })}
                placeholder="Paste your transcript here..."
              />
              {errors.transcript && <span className="error-text">{errors.transcript.message}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={20} /> Generating...
                </>
              ) : (
                'Generate Notes'
              )}
            </button>
          </form>

          {error && <div className="status-message error">{error}</div>}
          {status && !error && <div className="status-message success">{status}</div>}
        </section>

        {markdown && (
          <section className="card result-section">
            <div className="result-header">
              <h2>Generated Result</h2>
              <div className="action-buttons">
                <button className="btn-secondary" onClick={handleDownload} disabled={isPdfGenerating}>
                  <Download size={16} /> Download .md
                </button>
                <button className="btn-secondary" onClick={handleDownloadPdf} disabled={isPdfGenerating}>
                  {isPdfGenerating ? <Loader2 className="spin" size={16} /> : <FileText size={16} />}
                  {isPdfGenerating ? 'Generating PDF...' : 'Download .pdf'}
                </button>
                <button className="btn-secondary" onClick={handleCopy} disabled={!markdown}>
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  {isCopied ? 'Copied!' : ''}
                </button>
              </div>
            </div>
            <div className="markdown-body" ref={contentRef}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { ref, ...rest } = props;
                    return match ? (
                      <SyntaxHighlighter
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        {...rest}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </section>
        )}
      </main>
    </div >
  );
}

export default App;
