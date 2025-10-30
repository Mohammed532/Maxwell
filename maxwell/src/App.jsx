import React, { useState } from 'react';

// LaTeX rendering component
function LaTeXContent({ content }) {
  const renderWithLatex = (text) => {
    if (!text) return null;
    
    // Split by LaTeX delimiters (both inline $...$ and display $...$)
    const parts = [];
    let lastIndex = 0;
    
    // Match both display ($...$) and inline ($...$) math
    const regex = /\$\$(.*?)\$\$|\$(.*?)\$/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add the LaTeX expression
      const isDisplay = match[0].startsWith('$');
      const latex = isDisplay ? match[1] : match[2];
      parts.push({
        type: 'latex',
        content: latex,
        display: isDisplay
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }
    
    return parts.map((part, idx) => {
      if (part.type === 'text') {
        return <span key={idx}>{part.content}</span>;
      } else {
        return (
          <span
            key={idx}
            className={part.display ? 'katex-display' : 'katex-inline'}
            dangerouslySetInnerHTML={{
              __html: window.katex.renderToString(part.content, {
                displayMode: part.display,
                throwOnError: false
              })
            }}
          />
        );
      }
    });
  };
  
  // Check if KaTeX is loaded
  if (typeof window.katex === 'undefined') {
    return <span>{content}</span>;
  }
  
  return <span>{renderWithLatex(content)}</span>;
}

// Configuration
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

// Landing Page Component
function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100" data-theme="synthwave">
      <div className="text-center">
        <div className="mb-8 flex justify-center px-4">
          <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" style={{width: '600px', height: '150px'}}>
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#E779C1',stopOpacity:1}} />
                <stop offset="50%" style={{stopColor:'#58C7F3',stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#F806CC',stopOpacity:1}} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g opacity="0.4" stroke="#58C7F3" strokeWidth="2" fill="none">
              <line x1="10" y1="75" x2="70" y2="75" strokeLinecap="round"/>
              <line x1="530" y1="75" x2="590" y2="75" strokeLinecap="round"/>
              <line x1="70" y1="75" x2="90" y2="50" strokeLinecap="round"/>
              <line x1="70" y1="75" x2="90" y2="100" strokeLinecap="round"/>
              <line x1="510" y1="50" x2="530" y2="75" strokeLinecap="round"/>
              <line x1="510" y1="100" x2="530" y2="75" strokeLinecap="round"/>
              <path d="M 70 75 L 75 70 L 80 80 L 85 70 L 90 80 L 95 70 L 100 75" stroke="#E779C1" strokeWidth="2.5"/>
              <path d="M 500 75 L 505 70 L 510 80 L 515 70 L 520 80 L 525 70 L 530 75" stroke="#E779C1" strokeWidth="2.5"/>
              <circle cx="70" cy="75" r="4" fill="#58C7F3"/>
              <circle cx="530" cy="75" r="4" fill="#58C7F3"/>
              <circle cx="90" cy="50" r="3" fill="#E779C1"/>
              <circle cx="90" cy="100" r="3" fill="#E779C1"/>
              <circle cx="510" cy="50" r="3" fill="#E779C1"/>
              <circle cx="510" cy="100" r="3" fill="#E779C1"/>
            </g>
            <text x="300" y="95" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" textAnchor="middle" fill="url(#textGradient)" filter="url(#glow)">
              Maxwell
            </text>
            <text x="300" y="120" fontFamily="Arial, sans-serif" fontSize="14" textAnchor="middle" fill="#58C7F3" opacity="0.9">
              Your Circuitry Companion
            </text>
            <g transform="translate(150, 110)" opacity="0.6">
              <circle cx="0" cy="0" r="1.5" fill="#E779C1"/>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#E779C1" strokeWidth="1"/>
            </g>
            <g transform="translate(450, 110)" opacity="0.6">
              <circle cx="0" cy="0" r="1.5" fill="#F806CC"/>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#F806CC" strokeWidth="1"/>
            </g>
          </svg>
        </div>
        <div className="flex gap-6 justify-center">
          <button 
            className="btn btn-primary btn-lg text-xl px-8"
            onClick={() => onNavigate('circuit-analyzer')}
          >
            Circuit Analyzer
          </button>
          <button 
            className="btn btn-secondary btn-lg text-xl px-8"
            onClick={() => onNavigate('study-buddy')}
          >
            Study Buddy
          </button>
        </div>
      </div>
    </div>
  );
}

// Circuit Analyzer Page Component
function CircuitAnalyzer({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  console.log('CircuitAnalyzer render - isAnalyzing:', isAnalyzing, 'analysisResult:', analysisResult);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      
      console.log('Sending request to backend proxy at http://localhost:3001/api/analyze-circuit');
      
      try {
        const response = await fetch(`${API_URL}/api/analyze-circuit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-nano-12b-v2-vl',
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                },
                {
                  type: 'text',
                  text: 'Analyze this circuit diagram completely. First, provide a brief simplified description of the circuit (e.g., "This is a circuit with a 12V battery and equivalent resistance of 300Ω in series"). Then provide detailed analysis including: 1) Total equivalent resistance (Req), 2) Voltage, 3) Current, 4) For AC circuits: impedance, average power, and frequency, 5) Complete mathematical explanation showing all work and formulas used. Use LaTeX notation for mathematical expressions (use $ for inline math like $V = IR$ and $ for display math like $R_{eq} = R_1 + R_2$).'
                }
              ]
            }],
            max_tokens: 2048,
            temperature: 0.2,
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        if (!content) {
          throw new Error('No content in API response');
        }
        
        const reqMatch = content.match(/(?:Req|equivalent resistance|total resistance)[:\s]+([0-9.]+\s*[kKmMΩ]?Ω)/i);
        const voltageMatch = content.match(/(?:voltage|V(?:oltage)?)[:\s]+([0-9.]+\s*[kKmM]?V)/i);
        const currentMatch = content.match(/(?:current|I(?:current)?)[:\s]+([0-9.]+\s*[kKmMµμ]?A)/i);
        const impedanceMatch = content.match(/(?:impedance|Z)[:\s]+([0-9.]+\s*[kKmMΩ]?Ω)/i);
        const powerMatch = content.match(/(?:power|P(?:avg)?)[:\s]+([0-9.]+\s*[kKmM]?W)/i);
        const frequencyMatch = content.match(/(?:frequency|f)[:\s]+([0-9.]+\s*[kKmM]?Hz)/i);
        
        setAnalysisResult({
          simplifiedCircuit: content.split('\n').slice(0, 2).join(' ').substring(0, 200) || 'Circuit analyzed successfully',
          details: content,
          circuitData: {
            voltage: voltageMatch ? voltageMatch[1] : null,
            current: currentMatch ? currentMatch[1] : null,
            req: reqMatch ? reqMatch[1] : null,
            impedance: impedanceMatch ? impedanceMatch[1] : null,
            power: powerMatch ? powerMatch[1] : null,
            frequency: frequencyMatch ? frequencyMatch[1] : null
          }
        });
      } catch (error) {
        console.error('Analysis error:', error);
        alert(`Failed to analyze circuit: ${error.message}. Please try again.`);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className="min-h-screen bg-base-100 p-8" data-theme="synthwave">
      <div className="max-w-6xl mx-auto">
        <button 
          className="btn btn-ghost mb-8"
          onClick={() => onNavigate('home')}
        >
          ← Back to Home
        </button>
        
        <h1 className="text-5xl font-bold mb-8 text-center text-primary">Circuit Analyzer</h1>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-2xl">
            <label 
              htmlFor="circuit-image" 
              className="flex flex-col items-center justify-center w-full h-96 border-4 border-dashed border-primary rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 transition-colors"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Circuit preview" 
                  className="max-h-full max-w-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-xl text-primary font-semibold">Click to upload circuit image</p>
                  <p className="text-sm text-secondary">PNG, JPG or JPEG</p>
                </div>
              )}
              <input 
                id="circuit-image" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          </div>
          
          <button 
            className="btn btn-secondary btn-lg mt-6 px-12"
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="loading loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Circuit'
            )}
          </button>
        </div>

        {isAnalyzing && (
          <div className="mt-12 flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-xl text-secondary">Analyzing circuit with NVIDIA Nemotron...</p>
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <div className="mt-12 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary mb-4">Simplified Circuit</h2>
                  <div className="bg-base-300 rounded-lg p-6">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{analysisResult.simplifiedCircuit}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-secondary mb-4">
                    Circuit Values {analysisResult.isAC ? '(AC)' : '(DC)'}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {analysisResult.circuitData?.voltage && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Voltage</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.voltage}</p>
                      </div>
                    )}
                    {analysisResult.circuitData?.current && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Current</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.current}</p>
                      </div>
                    )}
                    {analysisResult.circuitData?.req && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Equivalent Resistance</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.req}</p>
                      </div>
                    )}
                    {analysisResult.circuitData?.impedance && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Impedance</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.impedance}</p>
                      </div>
                    )}
                    {analysisResult.circuitData?.power && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Average Power</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.power}</p>
                      </div>
                    )}
                    {analysisResult.circuitData?.frequency && (
                      <div className="bg-base-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-secondary mb-1 uppercase tracking-wide">Frequency</p>
                        <p className="text-xl font-bold text-primary">{analysisResult.circuitData.frequency}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-base-300 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-3">Mathematical Explanation</h3>
                    <div className="text-sm leading-relaxed overflow-y-auto max-h-96">
                      <LaTeXContent content={analysisResult.details} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Study Buddy Page Component
function StudyBuddy({ onNavigate }) {
  const [quizLength, setQuizLength] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [studySuggestions, setStudySuggestions] = useState(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const generateQuiz = async (numQuestions) => {
    setIsGenerating(true);
    setQuizLength(numQuestions);
    
    try {
      const response = await fetch(`${API_URL}/api/analyze-circuit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-12b-v2-vl',
          messages: [{
            role: 'user',
            content: `Generate exactly ${numQuestions} multiple choice questions about circuit theory. Topics should include: Ohm's Law, series and parallel circuits, Kirchhoff's laws, AC/DC circuits, capacitors, inductors, resistors, power calculations, and circuit analysis.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer letter
4. A detailed explanation of why the correct answer is right and why other answers are wrong

Format your response EXACTLY like this:
QUESTION 1: [question text]
A) [option A]
B) [option B]
C) [option C]
D) [option D]
CORRECT: [letter]
EXPLANATION: [detailed explanation]

QUESTION 2: [question text]
...and so on.`
          }],
          max_tokens: 4096,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      const questions = [];
      const questionBlocks = content.split(/QUESTION \d+:/g).slice(1);
      
      questionBlocks.forEach((block, idx) => {
        const lines = block.trim().split('\n');
        const questionText = lines[0].trim();
        
        const options = [];
        const optionRegex = /^([A-D])\)\s*(.+)$/;
        
        for (let i = 1; i < lines.length; i++) {
          const match = lines[i].match(optionRegex);
          if (match) {
            options.push({ letter: match[1], text: match[2].trim() });
          }
          if (options.length === 4) break;
        }
        
        const correctMatch = block.match(/CORRECT:\s*([A-D])/i);
        const explanationMatch = block.match(/EXPLANATION:\s*(.+?)(?=QUESTION \d+:|$)/s);
        
        if (questionText && options.length === 4 && correctMatch) {
          questions.push({
            id: idx,
            question: questionText,
            options: options,
            correctAnswer: correctMatch[1],
            explanation: explanationMatch ? explanationMatch[1].trim() : 'No explanation provided.'
          });
        }
      });
      
      setQuiz(questions);
    } catch (error) {
      console.error('Quiz generation error:', error);
      alert(`Failed to generate quiz: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRetry = () => {
    setQuiz(null);
    setQuizLength(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setStudySuggestions(null);
    setIsLoadingSuggestions(false);
  };

  React.useEffect(() => {
    const generateSuggestions = async () => {
      if (!showResults || !quiz) return;
      
      const incorrectQuestions = quiz.filter(q => userAnswers[q.id] !== q.correctAnswer);
      
      if (incorrectQuestions.length === 0) {
        setIsLoadingSuggestions(false);
        return;
      }
      
      setIsLoadingSuggestions(true);
      
      try {
        const questionsText = incorrectQuestions.map((q, idx) => 
          `${idx + 1}. ${q.question}`
        ).join('\n');
        
        const response = await fetch('http://localhost:3001/api/analyze-circuit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-nano-12b-v2-vl',
            messages: [{
              role: 'user',
              content: `Based on these circuit theory questions that a student got wrong:

${questionsText}

Analyze the common themes and knowledge gaps, then provide 3-5 specific study recommendations. For each recommendation, include:
1. The topic name
2. A brief description of what to focus on
3. Why it's important for understanding circuits

Format as:
TOPIC: [topic name]
FOCUS: [what to study]
WHY: [importance]

Keep recommendations concise and actionable.`
            }],
            max_tokens: 1024,
            temperature: 0.5,
            stream: false
          })
        });
        
        if (!response.ok) throw new Error('Failed to generate suggestions');
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        const suggestions = [];
        const topicBlocks = content.split(/TOPIC:/g).slice(1);
        
        topicBlocks.forEach(block => {
          const topicMatch = block.match(/^(.+?)(?=FOCUS:|$)/s);
          const focusMatch = block.match(/FOCUS:\s*(.+?)(?=WHY:|$)/s);
          const whyMatch = block.match(/WHY:\s*(.+?)(?=TOPIC:|$)/s);
          
          if (topicMatch) {
            suggestions.push({
              topic: topicMatch[1].trim(),
              focus: focusMatch ? focusMatch[1].trim() : '',
              why: whyMatch ? whyMatch[1].trim() : ''
            });
          }
        });
        
        setStudySuggestions(suggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    
    generateSuggestions();
  }, [showResults, quiz, userAnswers]);

  // Quiz Length Selection
  if (!quizLength && !isGenerating) {
    return (
      <div className="min-h-screen bg-base-100 p-8" data-theme="synthwave">
        <div className="max-w-4xl mx-auto">
          <button 
            className="btn btn-ghost mb-8"
            onClick={() => onNavigate('home')}
          >
            ← Back to Home
          </button>
          
          <h1 className="text-5xl font-bold mb-8 text-center text-primary">Study Buddy</h1>
          <p className="text-xl text-center text-secondary mb-12">Test your circuit theory knowledge!</p>
          
          <div className="flex flex-col items-center gap-6">
            <p className="text-2xl text-primary">Choose quiz length:</p>
            <div className="flex gap-6">
              <button 
                className="btn btn-primary btn-lg text-xl px-12"
                onClick={() => generateQuiz(5)}
              >
                5 Questions
              </button>
              <button 
                className="btn btn-secondary btn-lg text-xl px-12"
                onClick={() => generateQuiz(10)}
              >
                10 Questions
              </button>
              <button 
                className="btn btn-accent btn-lg text-xl px-12"
                onClick={() => generateQuiz(25)}
              >
                25 Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center" data-theme="synthwave">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-xl text-secondary">Generating your {quizLength}-question quiz...</p>
      </div>
    );
  }

  if (quiz && !showResults) {
    const question = quiz[currentQuestion];
    const allAnswered = quiz.every(q => userAnswers[q.id]);
    
    return (
      <div className="min-h-screen bg-base-100 p-8" data-theme="synthwave">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button 
              className="btn btn-ghost"
              onClick={handleRetry}
            >
              ← Exit Quiz
            </button>
            <div className="text-secondary text-lg">
              Question {currentQuestion + 1} of {quiz.length}
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-primary mb-6">
                <LaTeXContent content={question.question} />
              </h2>
              
              <div className="space-y-4">
                {question.options.map((option) => (
                  <label 
                    key={option.letter}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                      userAnswers[question.id] === option.letter 
                        ? 'bg-primary text-primary-content' 
                        : 'bg-base-300 hover:bg-base-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.letter}
                      checked={userAnswers[question.id] === option.letter}
                      onChange={() => handleAnswerSelect(question.id, option.letter)}
                      className="radio radio-primary mr-4"
                    />
                    <span className="text-lg">
                      <strong>{option.letter})</strong> <LaTeXContent content={option.text} />
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            
            {currentQuestion < quiz.length - 1 ? (
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentQuestion(Math.min(quiz.length - 1, currentQuestion + 1))}
              >
                Next →
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={!allAnswered}
              >
                Submit Quiz
              </button>
            )}
          </div>
          
          {!allAnswered && currentQuestion === quiz.length - 1 && (
            <div className="text-center mt-4 text-warning">
              Please answer all questions before submitting
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = quiz.reduce((acc, q) => 
      acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0), 0
    );
    const percentage = Math.round((score / quiz.length) * 100);
    const incorrectQuestions = quiz.filter(q => userAnswers[q.id] !== q.correctAnswer);
    
    return (
      <div className="min-h-screen bg-base-100 p-8" data-theme="synthwave">
        <div className="max-w-4xl mx-auto">
          <button 
            className="btn btn-ghost mb-8"
            onClick={handleRetry}
          >
            ← Back to Menu
          </button>
          
          <div className="card bg-base-200 shadow-xl mb-8">
            <div className="card-body text-center">
              <h2 className="text-4xl font-bold text-primary mb-4">Quiz Complete!</h2>
              <div className="text-6xl font-bold text-secondary mb-2">{percentage}%</div>
              <p className="text-2xl text-secondary">
                You got {score} out of {quiz.length} questions correct
              </p>
            </div>
          </div>
          
          {incorrectQuestions.length > 0 && (
            <div className="card bg-base-200 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="text-3xl font-bold text-primary mb-4">📚 Study Recommendations</h2>
                
                {isLoadingSuggestions ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-secondary">Analyzing your results...</p>
                  </div>
                ) : studySuggestions && studySuggestions.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-secondary mb-4">
                      Based on the questions you missed, here are some topics to focus on:
                    </p>
                    {studySuggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-base-300 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {idx + 1}. {suggestion.topic}
                        </h3>
                        {suggestion.focus && (
                          <p className="text-sm mb-2">
                            <strong className="text-secondary">Focus on:</strong> {suggestion.focus}
                          </p>
                        )}
                        {suggestion.why && (
                          <p className="text-sm">
                            <strong className="text-secondary">Why it matters:</strong> {suggestion.why}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary">Great job! Keep practicing to maintain your skills.</p>
                )}
              </div>
            </div>
          )}
          
          <h3 className="text-3xl font-bold text-primary mb-6">Review Your Answers</h3>
          
          <div className="space-y-6">
            {quiz.map((question, idx) => {
              const isCorrect = userAnswers[question.id] === question.correctAnswer;
              
              return (
                <div key={question.id} className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`badge badge-lg ${isCorrect ? 'badge-success' : 'badge-error'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2">
                          Question {idx + 1}: <LaTeXContent content={question.question} />
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option) => {
                        const isUserAnswer = userAnswers[question.id] === option.letter;
                        const isCorrectAnswer = question.correctAnswer === option.letter;
                        
                        return (
                          <div 
                            key={option.letter}
                            className={`p-3 rounded-lg ${
                              isCorrectAnswer 
                                ? 'bg-success text-success-content' 
                                : isUserAnswer 
                                ? 'bg-error text-error-content' 
                                : 'bg-base-300'
                            }`}
                          >
                            <strong>{option.letter})</strong> <LaTeXContent content={option.text} />
                            {isCorrectAnswer && ' ✓ Correct Answer'}
                            {isUserAnswer && !isCorrectAnswer && ' ✗ Your Answer'}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-base-300 rounded-lg p-4">
                      <h4 className="font-bold text-secondary mb-2">Explanation:</h4>
                      <p className="text-sm leading-relaxed">
                        <LaTeXContent content={question.explanation} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleRetry}
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'circuit-analyzer':
        return <CircuitAnalyzer onNavigate={setCurrentPage} />;
      case 'study-buddy':
        return <StudyBuddy onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css" rel="stylesheet" type="text/css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        [data-theme="synthwave"] {
          color-scheme: dark;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        /* KaTeX styling */
        .katex-display {
          display: block;
          margin: 1em 0;
          text-align: center;
        }
        .katex-inline {
          display: inline;
        }
        .katex {
          font-size: 1.1em;
        }
        /* Override any conflicting styles */
        [data-theme="synthwave"] .text-7xl {
          font-size: 4.5rem !important;
          line-height: 1 !important;
        }
        [data-theme="synthwave"] .text-5xl {
          font-size: 3rem !important;
          line-height: 1 !important;
        }
        [data-theme="synthwave"] .text-2xl {
          font-size: 1.5rem !important;
          line-height: 2rem !important;
        }
        [data-theme="synthwave"] .text-xl {
          font-size: 1.25rem !important;
          line-height: 1.75rem !important;
        }
        [data-theme="synthwave"] .mb-4 {
          margin-bottom: 1rem !important;
        }
        [data-theme="synthwave"] .mb-8 {
          margin-bottom: 2rem !important;
        }
        [data-theme="synthwave"] .mb-12 {
          margin-bottom: 3rem !important;
        }
      `}</style>
      {renderPage()}
    </>
  );
}