
import React, { useState, useEffect, useRef } from 'react';
// FIX: Import Blob from @google/genai as GenaiBlob to avoid conflict with the native browser Blob type.
import { GoogleGenAI, Chat, Modality } from '@google/genai';
import { Module, AgeRange, ChatMessage, InstructionStep, Instrument } from './types';
import { SYSTEM_PROMPT, ICONS, BackIcon, INSTRUMENTS_BY_AGE, INSTRUCTION_IMAGES, COLORS, BRUSH_SIZES, TOOL_ICONS } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

type Tool = 'brush' | 'eraser';

// --- NEW COMPONENT: ColoringStudio ---
// Moved from inside App to prevent re-mounting on every state change.
interface ColoringStudioProps {
  coloringPage: string;
  onSave: () => void;
}

const ColoringStudio: React.FC<ColoringStudioProps> = ({ coloringPage, onSave }) => {
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [brushSize, setBrushSize] = useState<number>(BRUSH_SIZES[1]);
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);

  const saveHistory = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    historyRef.current.splice(historyIndexRef.current + 1);
    historyRef.current.push(currentDrawing);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const handleUndo = () => {
    if (historyIndexRef.current <= 0 || !drawingCanvasRef.current) return;

    historyIndexRef.current -= 1;
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = historyRef.current[historyIndexRef.current];
    ctx.putImageData(imageData, 0, 0);
  };

  const handleClear = () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const handleSave = () => {
    if (!canvasRef.current || !drawingCanvasRef.current) return;
    const baseCanvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = baseCanvas.width;
    finalCanvas.height = baseCanvas.height;
    const ctx = finalCanvas.getContext('2d');

    if(!ctx) return;

    ctx.drawImage(baseCanvas, 0, 0);
    ctx.drawImage(drawingCanvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = 'minha-arte.png';
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
    
    onSave();
  };
  
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    saveHistory();
  };

  useEffect(() => {
    const baseCanvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    if (!coloringPage || !baseCanvas || !drawingCanvas) return;

    const image = new Image();
    image.src = coloringPage;
    image.onload = () => {
        const container = baseCanvas.parentElement;
        if (!container) return;

        const aspectRatio = image.width / image.height;
        let newWidth = container.clientWidth;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > container.clientHeight) {
            newHeight = container.clientHeight;
            newWidth = newHeight * aspectRatio;
        }

        baseCanvas.width = newWidth;
        baseCanvas.height = newHeight;
        drawingCanvas.width = newWidth;
        drawingCanvas.height = newHeight;

        const baseCtx = baseCanvas.getContext('2d');
        if (baseCtx) {
            baseCtx.clearRect(0, 0, newWidth, newHeight);
            baseCtx.drawImage(image, 0, 0, newWidth, newHeight);
        }
        
        const drawingCtx = drawingCanvas.getContext('2d');
        if (drawingCtx) {
            historyRef.current = [];
            historyIndexRef.current = -1;
            drawingCtx.clearRect(0, 0, newWidth, newHeight);
            saveHistory();
        }
    };
  }, [coloringPage]);
  
  return (
      <div className="flex flex-col h-full w-full bg-gray-200">
          <div className="flex-none p-2 bg-white border-b flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {/* Tools */}
              <div className="flex items-center gap-2 border-r pr-2 md:pr-4">
                  <button onClick={() => setCurrentTool('brush')} className={`p-2 rounded-lg ${currentTool === 'brush' ? 'bg-orange-200' : 'hover:bg-gray-100'}`}>{TOOL_ICONS.brush}</button>
                  <button onClick={() => setCurrentTool('eraser')} className={`p-2 rounded-lg ${currentTool === 'eraser' ? 'bg-orange-200' : 'hover:bg-gray-100'}`}>{TOOL_ICONS.eraser}</button>
                  <button onClick={handleUndo} className="p-2 rounded-lg hover:bg-gray-100">{TOOL_ICONS.undo}</button>
              </div>
              {/* Colors */}
              <div className="flex items-center gap-1 border-r pr-2 md:pr-4 flex-wrap">
                  {COLORS.map(color => (
                      <button key={color} onClick={() => setCurrentColor(color)} className={`w-6 h-6 rounded-full border-2 ${currentColor === color ? 'border-orange-500 scale-125' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                  ))}
              </div>
              {/* Brush Sizes */}
              <div className="flex items-center gap-2 border-r pr-2 md:pr-4">
                  {BRUSH_SIZES.map(size => (
                      <button key={size} onClick={() => setBrushSize(size)} className={`rounded-full flex items-center justify-center ${brushSize === size ? 'bg-orange-500' : 'bg-gray-300'}`} style={{ width: size+10, height: size+10 }}>
                          <div className="bg-black rounded-full" style={{ width: size, height: size }}></div>
                      </button>
                  ))}
              </div>
               {/* Actions */}
               <div className="flex items-center gap-2">
                   <button onClick={handleClear} className="p-2 rounded-lg hover:bg-red-100 text-red-600" title="Limpar Tudo">{TOOL_ICONS.clear}</button>
                   <button onClick={handleSave} className="p-2 rounded-lg hover:bg-green-100 text-green-600 font-bold" title="Salvar Desenho">{TOOL_ICONS.save}</button>
               </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden relative">
              <canvas ref={canvasRef} className="absolute inset-0 m-auto" style={{ zIndex: 1 }} />
              <canvas
                  ref={drawingCanvasRef}
                  className="absolute inset-0 m-auto cursor-crosshair"
                  style={{ zIndex: 2, touchAction: 'none' }}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
              />
          </div>
      </div>
  );
}
// --- END NEW COMPONENT ---


const App: React.FC = () => {
    const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // For Pintura module
    const [pinturaStep, setPinturaStep] = useState<'start' | 'comparison' | 'coloring' | 'finished'>('start');
    const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
    const [coloringPage, setColoringPage] = useState<string | null>(null);
    
    // For Instrumento module
    const [instrumentStep, setInstrumentStep] = useState<'selection' | 'instructions' | 'photo' | 'chat' | 'recording' | 'recorded' | 'playingOrchestra'>('selection');
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
    const [instructions, setInstructions] = useState<InstructionStep[]>([]);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [instrumentPhoto, setInstrumentPhoto] = useState<string | null>(null);
    const [isInstrumentRecording, setIsInstrumentRecording] = useState(false);
    const [recordedInstrumentClip, setRecordedInstrumentClip] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const chatRef = useRef<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const addMessage = (sender: 'user' | 'ai' | 'system', content: React.ReactNode, actions?: React.ReactNode) => {
        setChatMessages(prev => [...prev, { id: Date.now().toString(), sender, content, actions }]);
    };
    
    const handleModuleSelect = (module: Module) => {
        setCurrentModule(module);
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: SYSTEM_PROMPT },
        });
        chatRef.current = newChat;

        if (module === Module.Pintura) {
            setIsLoading(true);
            const initialPrompt = `Olá! Eu sou um aluno na faixa etária de ${ageRange} anos e escolhi o módulo "${module}". Por favor, me dê as boas-vindas e me peça para enviar uma foto.`
            newChat.sendMessage({ message: initialPrompt }).then(response => {
                addMessage('ai', response.text);
            }).catch(err => {
                console.error(err);
                addMessage('system', 'Oops! Algo deu errado. Tente novamente.');
            }).finally(() => {
                setIsLoading(false);
            });
        } else if (module === Module.Instrumento) {
            addMessage('ai', "Que legal! Construir nosso próprio instrumento é pura magia. Qual desses você quer criar hoje?");
        }
    };
    
    const handleBack = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setCurrentModule(null);
        setChatMessages([]);
        
        // Reset Pintura state
        setColoringPage(null);
        setOriginalPhoto(null);
        setPinturaStep('start');

        // Reset Instrumento state
        setInstrumentStep('selection');
        setSelectedInstrument(null);
        setInstructions([]);
        setInstructionIndex(0);
        setInstrumentPhoto(null);
        setRecordedInstrumentClip(null);
        setIsInstrumentRecording(false);
        chatRef.current = null;
    };

    // --- PINTURA MODULE ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        addMessage('system', 'Transformando sua foto em um desenho... ✨');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setOriginalPhoto(base64String);
            const base64Data = base64String.split(',')[1];
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            { inlineData: { data: base64Data, mimeType: file.type } },
                            { text: 'Transforme esta imagem em uma página de livro de colorir em preto e branco com contornos bem definidos para uma criança, fundo branco.' }
                        ]
                    },
                    config: { responseModalities: [Modality.IMAGE] },
                });

                const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
                if (imagePart && imagePart.inlineData) {
                    const generatedImage = `data:image/png;base64,${imagePart.inlineData.data}`;
                    setColoringPage(generatedImage);
                    setPinturaStep('comparison');
                } else {
                    throw new Error("No image data returned.");
                }
            } catch (error) {
                console.error("Image generation error:", error);
                addMessage('system', 'Oh não! Não consegui transformar sua foto. Que tal tentar outra?');
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrawingSaved = () => {
        setPinturaStep('finished');
        if (chatRef.current) {
            setIsLoading(true);
            chatRef.current.sendMessage({ message: "(O aluno terminou e salvou o desenho. Elogie-o e incentive a criar mais.)"})
                .then(res => addMessage('ai', res.text))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    };

    const handleStartNewDrawing = () => {
        setColoringPage(null);
        setOriginalPhoto(null);
        setPinturaStep('start');
        setChatMessages([]);
        handleModuleSelect(Module.Pintura);
    };

    // --- INSTRUMENTO MODULE ---
    const handleInstrumentSelect = async (instrument: Instrument) => {
        setSelectedInstrument(instrument);
        setIsLoading(true);
        setChatMessages([]);
        addMessage('system', `Buscando o passo a passo para o ${instrument.name}...`);
        
        if (!chatRef.current) return;

        try {
            const response = await chatRef.current.sendMessage({ message: `Por favor, gere as instruções em JSON para construir um "${instrument.name}".` });
            
            const text = response.text;
            const startIndex = text.indexOf('[');
            const endIndex = text.lastIndexOf(']');

            if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
                throw new Error("Resposta da IA não contém um JSON de instruções válido.");
            }

            const jsonString = text.substring(startIndex, endIndex + 1);
            const parsedInstructions = JSON.parse(jsonString);
            
            if (!Array.isArray(parsedInstructions) || parsedInstructions.length === 0) {
                 throw new Error("O passo a passo recebido da IA está vazio ou inválido.");
            }

            setInstructions(parsedInstructions);
            setInstrumentStep('instructions');
        } catch (error) {
            console.error("Failed to get or parse instructions:", error);
            addMessage('system', 'Oops! Não consegui encontrar as instruções. Que tal escolher outro instrumento?');
            setInstrumentStep('selection');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishBuilding = () => {
        setChatMessages([]);
        addMessage('ai', "Uau, que obra de arte! Seu instrumento ficou incrível! Que tal tirar uma foto para guardar de recordação e mostrar para todo mundo?");
        setInstrumentStep('photo');
    };

    const handleInstrumentPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onloadend = () => {
            setInstrumentPhoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handlePhotoTaken = async () => {
        if (!chatRef.current || !selectedInstrument) return;
        setChatMessages([]);
        setIsLoading(true);
        setInstrumentStep('chat');
    
        try {
            let response = await chatRef.current.sendMessage({ message: `(O aluno terminou de construir e fotografar o ${selectedInstrument.name}. Use o novo texto de exemplo para elogiá-lo e ensinar um ritmo.)` });
            addMessage('ai', response.text);
    
            response = await chatRef.current.sendMessage({ message: `(Agora, use o novo texto de exemplo para convidar o aluno para gravar seu som para a 'Orquestra Reciclada'.)` });
            addMessage('ai', response.text, (
                <button
                    onClick={() => setInstrumentStep('recording')}
                    className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                    Gravar para a Orquestra!
                </button>
            ));
        } catch (err) {
            console.error(err);
            addMessage('system', 'Desculpe, tive um probleminha. Vamos tentar de novo?');
        } finally {
            setIsLoading(false);
        }
    }

    const startInstrumentRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedInstrumentClip(audioUrl);
                setInstrumentStep('recorded');
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsInstrumentRecording(true);
        } catch (err) {
            console.error("Mic access error:", err);
            addMessage('system', 'Não consegui acessar seu microfone. Verifique as permissões e tente novamente.');
            setInstrumentStep('chat');
        }
    };
    
    const stopInstrumentRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsInstrumentRecording(false);
        }
    };

    const playOrchestra = async () => {
        if (!recordedInstrumentClip) return;
    
        setInstrumentStep('playingOrchestra');
        addMessage('system', 'A orquestra está tocando! 🎶');
    
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const response = await fetch(recordedInstrumentClip);
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const userSource = audioContext.createBufferSource();
        userSource.buffer = decodedBuffer;
        userSource.connect(audioContext.destination);
    
        const playSound = (type: 'kick' | 'snare' | 'hihat', time: number) => {
            if (type === 'kick') {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.frequency.setValueAtTime(150, time);
                osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
                gain.gain.setValueAtTime(0.8, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start(time);
                osc.stop(time + 0.1);
            } else if (type === 'snare') {
                const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < noiseBuffer.length; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const noise = audioContext.createBufferSource();
                noise.buffer = noiseBuffer;
                const gain = audioContext.createGain();
                gain.gain.setValueAtTime(0.3, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
                noise.connect(gain);
                gain.connect(audioContext.destination);
                noise.start(time);
                noise.stop(time + 0.1);
            } else if (type === 'hihat') {
                 const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.05, audioContext.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < noiseBuffer.length; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const noise = audioContext.createBufferSource();
                noise.buffer = noiseBuffer;
                 const bandpass = audioContext.createBiquadFilter();
                 bandpass.type = 'highpass';
                 bandpass.frequency.value = 7000;
                const gain = audioContext.createGain();
                gain.gain.setValueAtTime(0.1, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);
                noise.connect(bandpass);
                bandpass.connect(gain);
                gain.connect(audioContext.destination);
                noise.start(time);
                noise.stop(time + 0.05);
            }
        };
    
        const startTime = audioContext.currentTime + 0.1;
        const totalDuration = Math.max(decodedBuffer.duration, 8); // Play for at least 8 seconds
        const tempo = 120; // beats per minute
        const quarterNoteTime = 60 / tempo;
        const eighthNoteTime = quarterNoteTime / 2;
    
        for (let i = 0; i < (totalDuration / eighthNoteTime); i++) {
            const time = startTime + i * eighthNoteTime;
            // Kick on 1 and 3
            if (i % 4 === 0) {
                playSound('kick', time);
            }
            // Snare on 2 and 4
            if ((i - 2) % 4 === 0) {
                 playSound('snare', time);
            }
            // Hi-hat on every 8th note
            playSound('hihat', time);
        }
    
        userSource.start(startTime);
        
        userSource.onended = () => {
            if (chatRef.current) {
                 setIsLoading(true);
                 chatRef.current.sendMessage({ message: "(A criança acabou de tocar na orquestra. Dê um elogio muito animado sobre a contribuição dela!)" }).then(res => {
                    addMessage('ai', res.text);
                 }).finally(() => {
                    setIsLoading(false);
                    setInstrumentStep('chat');
                    if(recordedInstrumentClip) URL.revokeObjectURL(recordedInstrumentClip);
                    setRecordedInstrumentClip(null);
                 });
             }
        };
    };
    
     const renderModuleContent = () => {
        if (currentModule === Module.Instrumento) {
            return renderInstrumentoModule();
        }
        if (currentModule === Module.Pintura) {
            return renderPinturaModule();
        }
        return null;
    };

    const renderPinturaModule = () => {
        if (pinturaStep === 'coloring' && coloringPage) {
            return <ColoringStudio coloringPage={coloringPage} onSave={handleDrawingSaved} />;
        }
        
        if (pinturaStep === 'comparison' && originalPhoto && coloringPage) {
            return (
                <div className="flex flex-col h-full items-center justify-center p-4 bg-orange-50/50">
                    <h2 className="text-2xl font-bold text-yellow-900 mb-4 text-center">Uau, veja a mágica!</h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 text-center">
                            <h3 className="font-semibold text-yellow-800 mb-2">Sua Foto</h3>
                            <img src={originalPhoto} alt="Original" className="rounded-lg shadow-md max-h-64 object-contain mx-auto" />
                        </div>
                        <div className="flex-1 text-center">
                            <h3 className="font-semibold text-yellow-800 mb-2">Seu Desenho</h3>
                            <img src={coloringPage} alt="Para Colorir" className="rounded-lg shadow-md max-h-64 object-contain mx-auto bg-white" />
                        </div>
                    </div>
                    <button
                        onClick={() => setPinturaStep('coloring')}
                        className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors text-xl"
                    >
                        Vamos Colorir?
                    </button>
                </div>
            );
        }

        return (
             <div className="flex flex-col h-full">
                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                                <div className="text-center w-full text-sm text-gray-500 my-2">{msg.content}</div>
                            ) : (
                                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
                    )}
                </div>
                <div className="p-4 border-t border-orange-200 bg-orange-50 text-center">
                    {pinturaStep === 'start' && !isLoading && (
                        <button onClick={() => fileInputRef.current?.click()} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                            Enviar uma Foto
                        </button>
                    )}
                     {pinturaStep === 'finished' && !isLoading && (
                         <button onClick={handleStartNewDrawing} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                            Criar Novo Desenho
                        </button>
                     )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                </div>
            </div>
        );
    };

    const renderInstrumentoModule = () => {
        const availableInstruments = ageRange ? INSTRUMENTS_BY_AGE[ageRange] : [];
    
        if (instrumentStep === 'selection') {
            return (
                <div className="p-6 overflow-y-auto">
                    <div className="text-center mb-6 text-lg text-yellow-800">{chatMessages[0]?.content}</div>
                     {isLoading ? (
                         <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableInstruments.map(inst => (
                                <button key={inst.name} onClick={() => handleInstrumentSelect(inst)} className="bg-white p-4 rounded-xl shadow text-left group transition-transform transform hover:-translate-y-1">
                                    <h3 className="font-bold text-yellow-900 text-lg">{inst.name}</h3>
                                    <p className="text-sm text-yellow-700">{inst.description}</p>
                                </button>
                            ))}
                        </div>
                     )}
                </div>
            );
        }

        if (instrumentStep === 'instructions') {
            const currentStep = instructions[instructionIndex];
            const image = INSTRUCTION_IMAGES[currentStep?.imageKey] || INSTRUCTION_IMAGES['default'];
            return (
                <div className="flex flex-col h-full">
                    <div className="p-4 text-center">
                         <h3 className="text-2xl font-bold text-yellow-900 mb-2">{selectedInstrument?.name}</h3>
                         <p className="text-lg text-yellow-800">Passo {instructionIndex + 1} de {instructions.length}</p>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-orange-50/50">
                        <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-lg shadow-inner flex items-center justify-center p-2">
                             {React.cloneElement(image, { className: "w-full h-full object-contain" })}
                        </div>
                        <p className="md:flex-1 text-center md:text-left text-yellow-900 bg-white p-4 rounded-lg shadow-sm max-w-md">{currentStep?.text}</p>
                    </div>
                    <div className="p-4 border-t border-orange-200 flex justify-between items-center">
                         <button onClick={() => setInstructionIndex(i => i - 1)} disabled={instructionIndex === 0} className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full disabled:opacity-50">Anterior</button>
                         {instructionIndex < instructions.length - 1 ? (
                             <button onClick={() => setInstructionIndex(i => i + 1)} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full">Próximo</button>
                         ) : (
                             <button onClick={handleFinishBuilding} className="bg-green-500 text-white font-bold py-2 px-4 rounded-full">Terminei!</button>
                         )}
                    </div>
                </div>
            )
        }

        if (instrumentStep === 'photo') {
            return (
                <>
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className="flex justify-start">
                                <div className="flex flex-col items-start">
                                    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-orange-200 bg-orange-50 text-center">
                        {!instrumentPhoto ? (
                            <button onClick={() => fileInputRef.current?.click()} className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                                Enviar Foto
                            </button>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <img src={instrumentPhoto} alt="Instrumento do aluno" className="rounded-lg shadow-md max-h-48 object-contain"/>
                                <button onClick={handlePhotoTaken} className="bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-green-600 transition-colors">
                                    Continuar
                                </button>
                            </div>
                        )}
                         <input type="file" ref={fileInputRef} onChange={handleInstrumentPhotoChange} accept="image/*" className="hidden"/>
                    </div>
                </>
            );
        }
        
        // Chat, Recording, Recorded, PlayingOrchestra steps
        return (
             <>
                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                                <div className="text-center w-full text-sm text-gray-500 my-2">{msg.content}</div>
                            ) : (
                                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                        {msg.content}
                                    </div>
                                     {msg.actions && <div className="mt-2">{msg.actions}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
                     )}
                </div>
                 <div className="p-4 border-t border-orange-200 bg-orange-50">
                     {instrumentStep === 'recording' && (
                        <div className="text-center">
                            <button onClick={isInstrumentRecording ? stopInstrumentRecording : startInstrumentRecording} className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg transition-colors ${isInstrumentRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'}`}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>
                            </button>
                            <p className="text-sm text-gray-600 mt-2">{isInstrumentRecording ? "Gravando seu som..." : "Clique para começar a gravar!"}</p>
                        </div>
                    )}
                     {instrumentStep === 'recorded' && (
                        <div className="text-center">
                            <h3 className="font-semibold text-yellow-900">Sua gravação ficou ótima!</h3>
                            <audio src={recordedInstrumentClip!} controls className="my-2 mx-auto w-full max-w-xs"/>
                            <button onClick={playOrchestra} className="mt-2 bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-purple-600 transition-colors">
                                Tocar com a Orquestra!
                            </button>
                        </div>
                    )}
                    {instrumentStep === 'playingOrchestra' && (
                        <div className="text-center text-yellow-900 font-semibold">
                            <div className="animate-pulse">🎶 Tocando com a orquestra... 🎶</div>
                        </div>
                    )}
                </div>
            </>
        )
    };

    const renderContent = () => {
        if (!ageRange) {
            return (
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-yellow-900 mb-4">Olá, artista! 🎨</h1>
                    <p className="text-lg md:text-xl text-yellow-800 mb-8">Para começar, qual a sua idade?</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {(['6-8', '9-11', '12-16'] as AgeRange[]).map(age => (
                            <button key={age} onClick={() => setAgeRange(age)} className="bg-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105">
                                {age} anos
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (!currentModule) {
            return (
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-2">Vamos criar juntos!</h1>
                    <p className="text-lg text-yellow-800 mb-8">O que você quer fazer hoje?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(Object.values(Module) as Module[]).map(mod => (
                            <button key={mod} onClick={() => handleModuleSelect(mod)} className="bg-white p-6 rounded-2xl shadow-lg text-center group transition-transform transform hover:-translate-y-2">
                                <div className="w-20 h-20 mx-auto bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                                    {React.cloneElement(ICONS[mod], { className: "w-10 h-10" })}
                                </div>
                                <h2 className="text-xl font-bold text-yellow-900">{mod}</h2>
                            </button>
                        ))}
                    </div>
                     <button onClick={() => setAgeRange(null)} className="mt-8 text-yellow-800 hover:text-yellow-900 font-semibold">Mudar idade</button>
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <header className="flex items-center p-4 bg-orange-50 border-b border-orange-200">
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-orange-200 transition-colors">
                        <BackIcon/>
                    </button>
                    <h2 className="text-xl font-bold text-yellow-900 ml-4">{currentModule}</h2>
                </header>
                {renderModuleContent()}
            </div>
        );
    };

    return (
        <main className="bg-orange-100 min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[90vh] max-h-[800px] relative">
                {renderContent()}
                {!ageRange ? (
                    <div className="text-center absolute bottom-6 left-0 right-0 px-4">
                        <p className="text-lg font-semibold text-yellow-800">"Arte Viva na Escola"</p>
                        <p className="text-base text-yellow-700">Escola Municipal Glória Marques Diniz - Contagem/MG</p>
                    </div>
                ) : (
                    <footer className="absolute bottom-2 left-0 right-0 text-center text-xs text-yellow-700/80">
                        "Arte Viva na Escola" - Escola Municipal Glória Marques Diniz - Contagem/MG
                    </footer>
                )}
            </div>
        </main>
    );
};

export default App;
