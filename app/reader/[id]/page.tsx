"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as pdfjsLib from "pdfjs-dist" // Assuming setup in lib/pdf.ts handles worker
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  PlayIcon, 
  StopIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  CpuChipIcon,
  SparklesIcon,
  EyeIcon,
  CodeBracketIcon
} from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export default function ReaderPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [logs, setLogs] = useState<{type: 'reader' | 'director' | 'artist', message: string}[]>([])
  const [memory, setMemory] = useState<any>({})

  const loadPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      setIsProcessing(true)
      addLog('reader', `Initializing PDF parser for ${f.name}...`)
      
      try {
        const buffer = await f.arrayBuffer()
        const pdf = await pdfjsLib.getDocument(buffer).promise
        const textPages = []
        for (let i = 1; i <= pdf.numPages; i++) {

          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const text = textContent.items.map((item: any) => item.str).join(' ')
          textPages.push(text)
        }
        setPages(textPages)
        addLog('reader', `Extracted ${textPages.length} pages successfully.`)
        setIsProcessing(false)
      } catch (err) {
        console.error(err)
        addLog('reader', 'Error parsing PDF.')
        setIsProcessing(false)
      }
    }
  }

  const generateCurrentPage = async () => {
    if (!pages[currentPage]) return

    setIsProcessing(true)
    setImageUrl(null)
    addLog('reader', `Analyzing page ${currentPage + 1}...`)

    try {
        const payload = {
            page_number: currentPage + 1,
           
            page_text: pages[currentPage].substring(0, 5000), 
            memory: Object.keys(memory).length > 0 ? memory : null,
            prev_image_url: imageUrl 
        }
        
        
        const res = await fetch('http://localhost:8000/api/generate/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })
        
        if (!res.ok) throw new Error('Backend error')
        
        const data = await res.json()
        const state = data.state
        
        
        if (state.reader_output) {
            addLog('reader', `Scene: ${state.reader_output.scene}`)
            addLog('reader', `Mood: ${state.reader_output.emotions}`)
        }
        
        if (state.director_output) {
            addLog('director', `Prompt: ${state.director_output.image_prompt.substring(0, 50)}...`)
        }
        
        if (state.current_image_url) {
            setImageUrl(state.current_image_url)
            addLog('artist', 'Image rendered successfully.')
        }

        // Update Memory
        if (state.memory) {
            setMemory(state.memory)
        }

    } catch (error) {
        console.error(error)
        addLog('artist', 'Generation failed.')
    } finally {
        setIsProcessing(false)
    }
  }

  const addLog = (type: 'reader' | 'director' | 'artist', message: string) => {
    setLogs(prev => [...prev, { type, message }])
  }

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans">
      
      {/* LEFT: Text Reader */}
      <div className="w-1/3 border-r border-border bg-card/10 flex flex-col relative z-20 min-w-[320px]">
         <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-background/50 backdrop-blur-sm shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" />
                Source Text
            </span>
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono">{pages.length > 0 ? `Page ${currentPage + 1} / ${pages.length}` : 'No File'}</span>
            </div>
         </header>
         
         <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-lg text-foreground/80 selection:bg-primary/20">
            {pages.length > 0 ? (
                <p>{pages[currentPage]}</p>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <div className="p-8 border-2 border-dashed border-border rounded-lg bg-card/30 hover:bg-card/50 transition-colors cursor-pointer relative group">
                        <input type="file" onChange={loadPDF} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                             <ArrowUpRightIcon className="w-8 h-8 opacity-50" />
                             <span className="text-sm font-mono uppercase">Upload PDF</span>
                        </div>
                    </div>
                </div>
            )}
         </div>

         <div className="h-16 border-t border-border p-4 flex items-center justify-between bg-background/50 backdrop-blur-sm shrink-0">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                disabled={currentPage === 0 || pages.length === 0}
            >
                <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            
            <Button 
                className="bg-primary text-primary-foreground font-mono hover:bg-primary/90 w-32"
                onClick={generateCurrentPage}
                disabled={pages.length === 0 || isProcessing}
            >
                {isProcessing ? 'PROCESSING...' : 'VISUALIZE'}
            </Button>

            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                disabled={currentPage === pages.length - 1 || pages.length === 0}
            >
                <ArrowRightIcon className="w-4 h-4" />
            </Button>
         </div>
      </div>

      {/* MIDDLE: Visual Canvas */}
      <div className="flex-1 bg-dots-pattern relative flex flex-col bg-background">
          <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-background/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <PhotoIcon className="w-4 h-4" />
                Neural Output
            </span>
             <Badge variant="outline" className="font-mono text-[10px] h-5 rounded-none border-primary/20 text-primary bg-primary/5">
                {imageUrl ? 'RENDER COMPLETE' : 'AWAITING INPUT'}
             </Badge>
         </header>

         <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {imageUrl ? (
                    <motion.div
                        key={imageUrl}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative shadow-2xl border border-border bg-card p-2"
                    >
                        <img 
                            src={imageUrl} 
                            className="max-h-[80vh] max-w-full object-contain"
                            alt="Generated Scene"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-2 py-1 text-[10px] text-white font-mono">
                            GEN-ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="text-muted-foreground font-mono text-xs flex flex-col items-center gap-4 opacity-50"
                    > 
                        <div className="w-32 h-32 border border-border flex items-center justify-center bg-card/10">
                            <SparklesIcon className="w-8 h-8 opacity-20" />
                        </div>
                        <span>// VISUAL FEED OFFLINE</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                     <div className="flex flex-col items-center gap-6">
                         <div className="w-64 h-1 bg-secondary overflow-hidden relative">
                             <motion.div 
                                className="absolute inset-y-0 left-0 bg-primary w-1/3"
                                animate={{ x: ['0%', '200%', '0%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                             />
                         </div>
                         <div className="flex items-center gap-2 text-xs font-mono animate-pulse">
                            <CpuChipIcon className="w-4 h-4" />
                            <span>PROCESSING SCENE DATA...</span>
                         </div>
                     </div>
                </div>
            )}
         </div>
      </div>

      {/* RIGHT: Agent Logs (The "Tech" part) */}
      <div className="w-80 border-l border-border bg-card/5 flex flex-col relative z-20 shrink-0">
         <header className="h-14 border-b border-border px-4 flex items-center bg-background/50 backdrop-blur-sm shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CpuChipIcon className="w-4 h-4" />
                System Logs
            </span>
         </header>
         
         <ScrollArea className="flex-1">
             <div className="p-4 space-y-3 font-mono text-[10px]">
                {logs.length === 0 && <span className="text-muted-foreground opacity-50">// System idle...</span>}
                {logs.map((log, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-[60px_1fr] gap-2 items-start"
                    >
                        <span className={`shrink-0 uppercase font-bold text-right ${
                            log.type === 'reader' ? 'text-blue-500' : 
                            log.type === 'director' ? 'text-purple-500' : 'text-green-500'
                        }`}>
                            [{log.type}]
                        </span>
                        <span className="text-muted-foreground border-l border-border pl-2 break-words leading-tight">
                            {log.message}
                        </span>
                    </motion.div>
                ))}
                {/* Dummy spacer for scrolling */}
                <div className="h-4" />
            </div>
         </ScrollArea>
         
         <div className="h-1/3 border-t border-border p-4 bg-card/10 mt-auto shrink-0 flex flex-col">
             <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-mono uppercase text-muted-foreground">Active Memory State</span>
                 <CodeBracketIcon className="w-3 h-3 text-muted-foreground" />
             </div>
             <div className="flex-1 bg-background border border-border p-2 overflow-auto rounded-none">
                <pre className="text-[9px] font-mono text-muted-foreground opacity-70 whitespace-pre-wrap">
                    {JSON.stringify(memory, null, 2) === '{}' ? '// No active memory context' : JSON.stringify(memory, null, 2)}
                </pre>
             </div>
         </div>
      </div>

    </div>
  )
}

function ArrowUpRightIcon({className}: {className?: string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
    )
}
