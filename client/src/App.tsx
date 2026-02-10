import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Loader2, Download, FileText, Globe } from 'lucide-react';
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError('');
    setStatus('Generating notes...');
    setMarkdown('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
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

  return (
    <div className="container">
      <header>
        <h1>Gemini Transcript Note Generator</h1>
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
              <button className="btn-secondary" onClick={handleDownload}>
                <Download size={16} /> Download .md
              </button>
            </div>
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
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
    </div>
  );
}

export default App;
